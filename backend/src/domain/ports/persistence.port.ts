import { ExchangeRate } from '../entities/exchange-rate';

/**
 * Puerto abstracto para persistencia durable de tasas de cambio.
 * Funciona como fallback ante caida simultanea de API y cache.
 */
export interface PersistencePort {
  save(rate: ExchangeRate): Promise<void>;
  getLatest(baseCurrency: string, targetCurrency: string): Promise<ExchangeRate | null>;
}

export const PERSISTENCE_PORT = Symbol('PersistencePort');
