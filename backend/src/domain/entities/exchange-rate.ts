/**
 * Entidad de dominio que representa una tasa de cambio entre dos divisas.
 * Agnostica a cualquier par de divisas especifico.
 */
export class ExchangeRate {
  constructor(
    public readonly baseCurrency: string,
    public readonly targetCurrency: string,
    public readonly rate: number,
    public readonly date: string,
    public readonly source: string,
  ) {}

  /**
   * Convierte un monto de la divisa base a la divisa destino.
   */
  convert(amount: number): number {
    return amount * this.rate;
  }

  /**
   * Convierte un monto de la divisa destino a la divisa base (operacion inversa).
   */
  convertInverse(amount: number): number {
    if (this.rate === 0) {
      throw new Error('Cannot perform inverse conversion with a rate of 0');
    }
    return amount / this.rate;
  }
}
