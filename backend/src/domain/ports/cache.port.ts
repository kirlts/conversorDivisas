import { ExchangeRate } from '../entities/exchange-rate';

/**
 * Puerto abstracto para cache de tasas de cambio.
 * TTL gestionado por el adaptador concreto.
 */
export interface CachePort {
  get(baseCurrency: string, targetCurrency: string): Promise<ExchangeRate | null>;
  set(rate: ExchangeRate): Promise<void>;
}

export const CACHE_PORT = Symbol('CachePort');
