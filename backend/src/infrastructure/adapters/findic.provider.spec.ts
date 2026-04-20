import { FindicProvider } from './findic.provider';

describe('FindicProvider', () => {
    let provider: FindicProvider;

    beforeEach(() => {
        provider = new FindicProvider();
        // Mock global fetch
        global.fetch = jest.fn();
    });

    it('debería arrojar error para moneda no soportada', async () => {
        await expect(provider.getExchangeRate('NOEXISTS', 'CLP')).rejects.toThrow(/does not support base currency/);
    });

    it('debería usar la ruta /dolar para consultar USD', async () => {
        const fetchMock = global.fetch as jest.Mock;
        fetchMock.mockResolvedValue({
            ok: true,
            json: async () => ({ serie: [{ fecha: '2026-04-20', valor: 850.5 }] })
        });

        const rate = await provider.getExchangeRate('USD', 'CLP');
        
        expect(fetchMock).toHaveBeenCalledWith(
            expect.stringContaining('/api/dolar'),
            expect.anything()
        );
        expect(rate.baseCurrency).toBe('USD');
        expect(rate.targetCurrency).toBe('CLP');
        expect(rate.rate).toBe(850.5);
    });

    it('debería usar la ruta /euro para consultar EUR', async () => {
        const fetchMock = global.fetch as jest.Mock;
        fetchMock.mockResolvedValue({
            ok: true,
            json: async () => ({ serie: [{ fecha: '2026-04-20', valor: 900.2 }] })
        });

        const rate = await provider.getExchangeRate('EUR', 'CLP');
        
        expect(fetchMock).toHaveBeenCalledWith(
            expect.stringContaining('/api/euro'),
            expect.anything()
        );
        expect(rate.baseCurrency).toBe('EUR');
    });
});
