import { ExchangeRate } from '../entities/exchange-rate';

/**
 * Puerto abstracto para obtener tasas de cambio.
 * Cualquier adaptador de API externa debe implementar esta interfaz.
 */
export interface ExchangeRateProviderPort {
  getExchangeRate(
    baseCurrency: string,
    targetCurrency: string,
  ): Promise<ExchangeRate>;
}

export const EXCHANGE_RATE_PROVIDER = Symbol('ExchangeRateProviderPort');
