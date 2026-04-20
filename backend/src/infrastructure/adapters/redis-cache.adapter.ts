import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { ExchangeRate } from '../../domain/entities/exchange-rate';
import { CachePort } from '../../domain/ports/cache.port';

/**
 * Adaptador de cache usando Redis.
 * TTL calculado dinamicamente: expira a las 00:00:01 del dia siguiente (hora Chile).
 */
@Injectable()
export class RedisCacheAdapter implements CachePort, OnModuleDestroy {
  private readonly logger = new Logger(RedisCacheAdapter.name);
  private readonly redis: Redis;

  constructor(private readonly configService: ConfigService) {
    const redisUrl = this.configService.get<string>('REDIS_URL')!;
    this.redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 1,      // Evitar que operaciones queden colgadas infinitamente
      enableOfflineQueue: false     // Fail-fast si la conexión física no existe
    });
    
    this.redis.on('error', (err) => {
      this.logger.error(`Redis connection error: ${err.message}`);
    });
    this.redis.on('connect', () => {
      this.logger.log('Connected to Redis');
    });
  }

  /**
   * Genera la clave de cache para un par de divisas y fecha.
   */
  private buildKey(base: string, target: string): string {
    const today = new Date().toISOString().split('T')[0];
    return `exchange_rate:${base}:${target}:${today}`;
  }

  async get(
    baseCurrency: string,
    targetCurrency: string,
  ): Promise<ExchangeRate | null> {
    try {
      const key = this.buildKey(baseCurrency, targetCurrency);
      const cached = await this.redis.get(key);

      if (!cached) {
        return null;
      }

      const data = JSON.parse(cached);
      return new ExchangeRate(
        data.baseCurrency,
        data.targetCurrency,
        data.rate,
        data.date,
        'cache',
      );
    } catch (error) {
      this.logger.warn(`Cache get failed: ${error}`);
      return null;
    }
  }

  async set(rate: ExchangeRate): Promise<void> {
    try {
      const key = this.buildKey(rate.baseCurrency, rate.targetCurrency);
      const ttl = this.calculateTTL();
      const payload = JSON.stringify({
        baseCurrency: rate.baseCurrency,
        targetCurrency: rate.targetCurrency,
        rate: rate.rate,
        date: rate.date,
        source: rate.source,
      });

      await this.redis.set(key, payload, 'EX', ttl);
      this.logger.log(
        `Cached ${rate.baseCurrency}/${rate.targetCurrency} with TTL ${ttl}s`,
      );
    } catch (error) {
      this.logger.warn(`Cache set failed: ${error}`);
    }
  }

  /**
   * Calcula los segundos restantes hasta las 00:00:01 del dia siguiente (UTC-4 Chile).
   * Garantiza que el cache se invalide cuando el valor de la UF pueda cambiar.
   */
  private calculateTTL(): number {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 1, 0);

    const ttl = Math.floor((tomorrow.getTime() - now.getTime()) / 1000);
    return Math.max(ttl, 60); // Minimo 60 segundos para evitar edge cases
  }

  /**
   * Retorna el TTL restante de la clave actual (para header X-UF-TTL).
   */
  async getTTL(baseCurrency: string, targetCurrency: string): Promise<number> {
    try {
      const key = this.buildKey(baseCurrency, targetCurrency);
      return await this.redis.ttl(key);
    } catch (error) {
      this.logger.warn(`Cache getTTL failed: ${error}`);
      return -1;
    }
  }

  /**
   * Metodo de salud: realiza ping a Redis y retorna la latencia.
   * Usado por el HealthController.
   */
  async ping(): Promise<void> {
    const pong = await this.redis.ping();
    if (pong !== 'PONG') throw new Error('Unexpected Redis PING response');
  }

  async onModuleDestroy() {
    await this.redis.quit();
    this.logger.log('Redis connection closed');
  }
}
