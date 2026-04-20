import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  HttpException,
  HttpStatus,
  Logger,
  Query,
} from '@nestjs/common';
import type { Response } from 'express';
import { ConvertCurrencyUseCase } from '../../application/use-cases/convert-currency.use-case';
import { GetSupportedCurrenciesUseCase } from '../../application/use-cases/get-supported-currencies.use-case';
import { ConvertDto } from '../dto/convert.dto';
import { RedisCacheAdapter } from '../../infrastructure/adapters/redis-cache.adapter';

/**
 * Controlador REST para conversion de divisas.
 *
 * Endpoints:
 *   GET  /api/uf/current  - Obtener valor UF actual
 *   POST /api/convert      - Ejecutar conversion
 */
@Controller('api')
export class ConversionController {
  private readonly logger = new Logger(ConversionController.name);

  constructor(
    private readonly convertCurrencyUseCase: ConvertCurrencyUseCase,
    private readonly getSupportedCurrenciesUseCase: GetSupportedCurrenciesUseCase,
    private readonly cacheAdapter: RedisCacheAdapter,
  ) {}

  /**
   * GET /api/uf/current
   * Retorna el valor actual de la UF y metadata.
   */
  @Get('uf/current')
  async getCurrentUfValue(@Res() res: Response) {
    try {
      const rate = await this.convertCurrencyUseCase.getCurrentRate('UF', 'CLP');
      const ttl = await this.cacheAdapter.getTTL('UF', 'CLP');

      res.setHeader('X-Cache', rate.source === 'cache' ? 'HIT' : 'MISS');
      res.setHeader('X-UF-Source', rate.source);
      res.setHeader('X-UF-TTL', ttl.toString());

      return res.json({
        baseCurrency: rate.baseCurrency,
        targetCurrency: rate.targetCurrency,
        rate: rate.rate,
        date: rate.date,
        source: rate.source,
        ttl,
      });
    } catch (error) {
      this.logger.error(`GET /api/uf/current failed: ${error}`);
      throw new HttpException(
        {
          error: 'No se pudo obtener el valor de la UF',
          details: error instanceof Error ? error.message : String(error),
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  /**
   * GET /api/currencies
   * Retorna lista de monedas soportadas para conversion
   */
  @Get('currencies')
  async getSupportedCurrencies() {
      try {
          const currencies = await this.getSupportedCurrenciesUseCase.execute();
          return currencies;
      } catch (error) {
          this.logger.error(`GET /api/currencies failed: ${error}`);
          throw new HttpException(
              { error: 'No se pudo obtener las monedas soportadas' },
              HttpStatus.SERVICE_UNAVAILABLE,
          );
      }
  }

  /**
   * POST /api/convert
   * Ejecuta una conversion entre divisas.
   *
   * Body: { amount: number, fromCurrency: string, toCurrency: string }
   */
  @Post('convert')
  async convert(@Body() body: ConvertDto, @Res() res: Response) {
    try {
      const result = await this.convertCurrencyUseCase.execute(
        body.amount,
        body.fromCurrency,
        body.toCurrency,
      );

      const ttl = await this.cacheAdapter.getTTL(
        result.fromCurrency === 'UF' ? 'UF' : result.toCurrency,
        result.fromCurrency === 'UF' ? result.toCurrency : result.fromCurrency,
      );

      res.setHeader('X-Cache', result.source === 'cache' ? 'HIT' : 'MISS');
      res.setHeader('X-UF-Source', result.source);
      res.setHeader('X-UF-TTL', ttl.toString());

      return res.json({
        amount: result.amount,
        fromCurrency: result.fromCurrency,
        toCurrency: result.toCurrency,
        rateApplied: result.rateApplied,
        result: result.result,
        source: result.source,
        timestamp: result.timestamp,
      });
    } catch (error) {
      const technicalMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`POST /api/convert failed: ${technicalMessage}`);

      // Traduccion de Errores Tecnicos a Lenguaje Natural de Negocio (UX)
      if (technicalMessage.includes('does not support pair')) {
        throw new HttpException(
          { error: 'El proveedor configurado actualmente no soporta la conversión directa entre estas dos divisas particulares. Intenta convertir hacia CLP primero.' },
          HttpStatus.BAD_REQUEST,
        );
      }
      
      if (technicalMessage.includes('does not support base currency')) {
        throw new HttpException(
          { error: 'La divisa de origen seleccionada se encuentra temporalmente deshabilitada o no es reconocida de forma válida.' },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (technicalMessage.includes('cannot convert')) {
         throw new HttpException(
          { error: 'Incongruencia algorítmica: El sistema no puede matemáticamente trazar esta ruta de conversión.' },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Fallback a error genérico para la UI sin exponer trazas crudas del sistema
      throw new HttpException(
        {
          error: 'Servicio de conversión degradado. Por favor, intente nuevamente más tarde.',
          // Solo devolvemos la razon natural, no el technicalMessage (que ya quedó en logger.error)
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
