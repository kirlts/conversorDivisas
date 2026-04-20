import { Module } from '@nestjs/common';
import { ConversionController } from '../../presentation/controllers/conversion.controller';
import { HealthController } from '../../presentation/controllers/health.controller';
import { ConvertCurrencyUseCase } from '../../application/use-cases/convert-currency.use-case';
import { GetSupportedCurrenciesUseCase } from '../../application/use-cases/get-supported-currencies.use-case';
import { FindicProvider } from '../adapters/findic.provider';
import { RedisCacheAdapter } from '../adapters/redis-cache.adapter';
import { SqlitePersistenceAdapter } from '../adapters/sqlite-persistence.adapter';
import { EXCHANGE_RATE_PROVIDER } from '../../domain/ports/exchange-rate-provider.port';
import { CACHE_PORT } from '../../domain/ports/cache.port';
import { PERSISTENCE_PORT } from '../../domain/ports/persistence.port';

/**
 * Modulo de conversion de divisas.
 * Aqui se produce la inyeccion de dependencias hexagonal:
 *   - Los puertos (interfaces del dominio) se vinculan con los adaptadores concretos.
 *   - El controlador y el caso de uso reciben abstracciones, no implementaciones.
 */
@Module({
  controllers: [ConversionController, HealthController],
  providers: [
    ConvertCurrencyUseCase,
    GetSupportedCurrenciesUseCase,
    RedisCacheAdapter,
    SqlitePersistenceAdapter,
    {
      provide: EXCHANGE_RATE_PROVIDER,
      useClass: FindicProvider,
    },
    {
      provide: CACHE_PORT,
      useExisting: RedisCacheAdapter,
    },
    {
      provide: PERSISTENCE_PORT,
      useExisting: SqlitePersistenceAdapter,
    },
  ],
  exports: [ConvertCurrencyUseCase, GetSupportedCurrenciesUseCase, RedisCacheAdapter, SqlitePersistenceAdapter],
})
export class ExchangeRateModule {}
