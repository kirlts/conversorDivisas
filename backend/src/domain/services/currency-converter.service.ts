import { ExchangeRate } from '../entities/exchange-rate';
import { ConversionResult } from '../entities/conversion-result';

/**
 * Servicio de dominio puro. Sin dependencias de infraestructura.
 * Ejecuta la logica de conversion bidireccional usando una ExchangeRate dada.
 */
export class CurrencyConverterService {
  /**
   * Convierte un monto entre dos divisas usando la tasa proporcionada.
   *
   * Si fromCurrency coincide con baseCurrency de la tasa, se multiplica.
   * Si fromCurrency coincide con targetCurrency, se divide (conversion inversa).
   */
  convert(
    amount: number,
    fromCurrency: string,
    toCurrency: string,
    rate: ExchangeRate,
  ): ConversionResult {
    let result: number;

    if (
      fromCurrency === rate.baseCurrency &&
      toCurrency === rate.targetCurrency
    ) {
      // Conversion directa: ej. UF -> CLP
      result = rate.convert(amount);
    } else if (
      fromCurrency === rate.targetCurrency &&
      toCurrency === rate.baseCurrency
    ) {
      // Conversion inversa: ej. CLP -> UF
      result = rate.convertInverse(amount);
    } else {
      throw new Error(
        `Rate ${rate.baseCurrency}/${rate.targetCurrency} cannot convert ${fromCurrency} to ${toCurrency}`,
      );
    }

    return new ConversionResult(
      amount,
      fromCurrency,
      toCurrency,
      rate.rate,
      result,
      rate.source as 'cache' | 'api' | 'fallback',
      new Date().toISOString(),
    );
  }
}
