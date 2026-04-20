import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExchangeRate } from '../../domain/entities/exchange-rate';
import { ConversionResult } from '../../domain/entities/conversion-result';
import { CurrencyConverterService } from '../../domain/services/currency-converter.service';
import { EXCHANGE_RATE_PROVIDER } from '../../domain/ports/exchange-rate-provider.port';
import type { ExchangeRateProviderPort } from '../../domain/ports/exchange-rate-provider.port';
import { CACHE_PORT } from '../../domain/ports/cache.port';
import type { CachePort } from '../../domain/ports/cache.port';
import { PERSISTENCE_PORT } from '../../domain/ports/persistence.port';
import type { PersistencePort } from '../../domain/ports/persistence.port';

/**
 * Caso de uso principal: Obtener tasa de cambio y ejecutar conversion.
 *
 * Flujo de resolucion de tasa:
 *   1. Redis cache (hit -> retorno inmediato)
 *   2. API externa via ExchangeRateProvider (con backoff)
 *   3. SQLite fallback (ultimo valor conocido, modo degradado)
 */
@Injectable()
export class ConvertCurrencyUseCase implements OnModuleInit {
  private readonly logger = new Logger(ConvertCurrencyUseCase.name);
  private readonly converterService = new CurrencyConverterService();

  constructor(
    @Inject(EXCHANGE_RATE_PROVIDER)
    private readonly rateProvider: ExchangeRateProviderPort,
    @Inject(CACHE_PORT)
    private readonly cache: CachePort,
    @Inject(PERSISTENCE_PORT)
    private readonly persistence: PersistencePort,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Warm-up: al arrancar la aplicacion, intenta poblar el cache configurado.
   * Lee la variable de entorno WARMUP_PAIRS (ej. "UF:CLP,USD:CLP")
   */
  async onModuleInit() {
    const warmupPairs = this.configService.get<string>('WARMUP_PAIRS');
    if (!warmupPairs) {
      this.logger.log('No cache warm-up configured (set WARMUP_PAIRS)');
      return;
    }

    this.logger.log(`Executing cache warm-up for: ${warmupPairs}`);
    const pairs = warmupPairs.split(',');

    for (const pair of pairs) {
      const [base, target] = pair.split(':');
      if (base && target) {
        try {
          await this.resolveRate(base, target);
        } catch (error) {
          this.logger.warn(
            `Cache warm-up failed for ${base}/${target} (non-blocking): ${error}`,
          );
        }
      }
    }
    this.logger.log('Cache warm-up cycle completed');
  }

  /**
   * Ejecuta la conversion completa: resuelve la tasa y aplica la logica de dominio.
   */
  async execute(
    amount: number,
    fromCurrency: string,
    toCurrency: string,
  ): Promise<ConversionResult> {
    // Determinar el par base/target para la tasa
    const { base, target } = this.normalizePair(fromCurrency, toCurrency);
    const rate = await this.resolveRate(base, target);

    return this.converterService.convert(amount, fromCurrency, toCurrency, rate);
  }

  /**
   * Obtiene la tasa actual sin ejecutar conversion (para UfStatus del frontend).
   */
  async getCurrentRate(
    baseCurrency: string,
    targetCurrency: string,
  ): Promise<ExchangeRate> {
    return this.resolveRate(baseCurrency, targetCurrency);
  }

  /**
   * Resuelve la tasa de cambio siguiendo la cascada: Cache -> API -> SQLite.
   */
  private async resolveRate(
    baseCurrency: string,
    targetCurrency: string,
  ): Promise<ExchangeRate> {
    // 1. Intentar cache
    const cached = await this.cache.get(baseCurrency, targetCurrency);
    if (cached) {
      this.logger.log(`Cache HIT for ${baseCurrency}/${targetCurrency}`);
      return cached;
    }
    this.logger.log(`Cache MISS for ${baseCurrency}/${targetCurrency}`);

    // 2. Intentar API externa
    try {
      const rate = await this.rateProvider.getExchangeRate(
        baseCurrency,
        targetCurrency,
      );

      // Persistir en ambos: cache + SQLite
      await Promise.all([
        this.cache.set(rate),
        this.persistence.save(rate),
      ]);

      this.logger.log(
        `API fetch successful: ${baseCurrency}/${targetCurrency} = ${rate.rate}`,
      );
      return rate;
    } catch (apiError) {
      this.logger.error(`API fetch failed: ${apiError}`);
    }

    // 3. Fallback: SQLite (ultimo valor conocido)
    const fallback = await this.persistence.getLatest(
      baseCurrency,
      targetCurrency,
    );
    if (fallback) {
      this.logger.warn(
        `Using FALLBACK value: ${baseCurrency}/${targetCurrency} = ${fallback.rate} (${fallback.date})`,
      );
      return fallback;
    }

    // Sin datos de ninguna fuente
    throw new Error(
      `No exchange rate available for ${baseCurrency}/${targetCurrency} from any source`,
    );
  }

  private normalizePair(
    from: string,
    to: string,
  ): { base: string; target: string } {
    const fromUpper = from.toUpperCase();
    const toUpper = to.toUpperCase();

    // Si una de las divisas es puramente moneda objetivo base (CLP), la otra debe ser la base a buscar.
    if (toUpper === 'CLP' || toUpper === 'USD') {
        return { base: fromUpper, target: toUpper };
    }
    if (fromUpper === 'CLP' || fromUpper === 'USD') {
        return { base: toUpper, target: fromUpper };
    }

    // Default estricto
    return { base: fromUpper, target: toUpper };
  }
}
