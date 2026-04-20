/**
 * Entidad de dominio que encapsula el resultado de una conversion entre divisas.
 * Incluye metadata de trazabilidad (fuente del dato, timestamp).
 */
export class ConversionResult {
  constructor(
    public readonly amount: number,
    public readonly fromCurrency: string,
    public readonly toCurrency: string,
    public readonly rateApplied: number,
    public readonly result: number,
    public readonly source: 'cache' | 'api' | 'fallback',
    public readonly timestamp: string,
  ) {}
}
