import { Controller, Get, Logger } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { RedisCacheAdapter } from '../../infrastructure/adapters/redis-cache.adapter';
import { SqlitePersistenceAdapter } from '../../infrastructure/adapters/sqlite-persistence.adapter';

/**
 * GET /health
 * Retorna el estado operativo de los adaptadores criticos del sistema.
 * No requiere autenticacion. Apto para uso en readiness probes de orquestadores.
 */
@ApiTags('Observabilidad')
@Controller('health')
// Limite estricto asimetrico para Orquestadores: 5 reqs / 10s
@Throttle({ default: { limit: 5, ttl: 10000 } })
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  constructor(
    private readonly cache: RedisCacheAdapter,
    private readonly persistence: SqlitePersistenceAdapter,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Estado del sistema',
    description:
      'Verifica conectividad de Redis y SQLite, y retorna el ultimo valor conocido del indicador UF/CLP.',
  })
  @ApiResponse({ status: 200, description: 'Sistema operativo' })
  @ApiResponse({ status: 503, description: 'Uno o mas adaptadores degradados' })
  async getHealth() {
    const redisStatus = await this.probeRedis();
    const sqliteStatus = await this.probeSqlite();
    const lastRate = await this.persistence.getLatestRate('UF', 'CLP');

    const allHealthy = redisStatus.ok && sqliteStatus.ok;

    return {
      status: allHealthy ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      adapters: {
        redis: redisStatus,
        sqlite: sqliteStatus,
      },
      lastKnownRate: lastRate
        ? {
            baseCurrency: lastRate.baseCurrency,
            targetCurrency: lastRate.targetCurrency,
            rate: lastRate.rate,
            date: lastRate.date,
            source: lastRate.source,
          }
        : null,
    };
  }

  private async probeRedis(): Promise<{ ok: boolean; latencyMs?: number; error?: string }> {
    const start = Date.now();
    try {
      await this.cache.ping();
      return { ok: true, latencyMs: Date.now() - start };
    } catch (e) {
      this.logger.warn(`Redis probe failed: ${e}`);
      return { ok: false, error: e instanceof Error ? e.message : String(e) };
    }
  }

  private async probeSqlite(): Promise<{ ok: boolean; error?: string }> {
    try {
      this.persistence.probe();
      return { ok: true };
    } catch (e) {
      this.logger.warn(`SQLite probe failed: ${e}`);
      return { ok: false, error: e instanceof Error ? e.message : String(e) };
    }
  }
}
