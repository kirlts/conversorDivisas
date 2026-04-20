import { GetSupportedCurrenciesUseCase } from './get-supported-currencies.use-case';
import { ExchangeRateProviderPort } from '../../domain/ports/exchange-rate-provider.port';

describe('GetSupportedCurrenciesUseCase', () => {
  let useCase: GetSupportedCurrenciesUseCase;
  let mockProvider: jest.Mocked<ExchangeRateProviderPort>;

  beforeEach(() => {
    mockProvider = {
      getExchangeRate: jest.fn(),
      getSupportedCurrencies: jest.fn().mockResolvedValue(['CLP', 'UF', 'USD']),
      getSupportedPairs: jest.fn().mockResolvedValue({ CLP: ['UF', 'USD'], UF: ['CLP'], USD: ['CLP'] }),
    };
    useCase = new GetSupportedCurrenciesUseCase(mockProvider);
  });

  it('delegates to provider successfully', async () => {
    const result = await useCase.execute();
    expect(result).toEqual({ 
      currencies: ['CLP', 'UF', 'USD'], 
      matrix: { CLP: ['UF', 'USD'], UF: ['CLP'], USD: ['CLP'] } 
    });
    expect(mockProvider.getSupportedCurrencies).toHaveBeenCalledTimes(1);
    expect(mockProvider.getSupportedPairs).toHaveBeenCalledTimes(1);
  });
});
