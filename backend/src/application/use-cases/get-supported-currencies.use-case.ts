import { Injectable, Inject } from '@nestjs/common';
import type { ExchangeRateProviderPort } from '../../domain/ports/exchange-rate-provider.port';
import { EXCHANGE_RATE_PROVIDER } from '../../domain/ports/exchange-rate-provider.port';

@Injectable()
export class GetSupportedCurrenciesUseCase {
  constructor(
    @Inject(EXCHANGE_RATE_PROVIDER)
    private readonly provider: ExchangeRateProviderPort,
  ) {}

  async execute(): Promise<{ currencies: string[], matrix: Record<string, string[]> }> {
    const currencies = await this.provider.getSupportedCurrencies();
    const matrix = await this.provider.getSupportedPairs();
    return { currencies, matrix };
  }
}
