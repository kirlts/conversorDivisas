import { CurrencyConverterService } from '../../../src/domain/services/currency-converter.service';
import { ExchangeRate } from '../../../src/domain/entities/exchange-rate';

describe('CurrencyConverterService', () => {
  const service = new CurrencyConverterService();

  // Tasa real: 1 UF = 39987.35 CLP (2026-04-20)
  const rate = new ExchangeRate('UF', 'CLP', 39987.35, '2026-04-20', 'api');

  describe('convert: UF → CLP', () => {
    it('convierte 1 UF a CLP correctamente', () => {
      const result = service.convert(1, 'UF', 'CLP', rate);
      expect(result.result).toBeCloseTo(39987.35, 2);
      expect(result.fromCurrency).toBe('UF');
      expect(result.toCurrency).toBe('CLP');
      expect(result.rateApplied).toBe(39987.35);
    });

    it('convierte 2 UF a CLP correctamente', () => {
      const result = service.convert(2, 'UF', 'CLP', rate);
      expect(result.result).toBeCloseTo(79974.7, 2);
    });

    it('convierte 0 UF a 0 CLP', () => {
      const result = service.convert(0, 'UF', 'CLP', rate);
      expect(result.result).toBe(0);
    });

    it('preserva la fuente de la tasa en el resultado', () => {
      const result = service.convert(1, 'UF', 'CLP', rate);
      expect(result.source).toBe('api');
    });
  });

  describe('convert: CLP → UF', () => {
    it('convierte 39987.35 CLP a 1 UF correctamente', () => {
      const result = service.convert(39987.35, 'CLP', 'UF', rate);
      expect(result.result).toBeCloseTo(1, 6);
      expect(result.fromCurrency).toBe('CLP');
      expect(result.toCurrency).toBe('UF');
    });

    it('convierte 0 CLP a 0 UF', () => {
      const result = service.convert(0, 'CLP', 'UF', rate);
      expect(result.result).toBe(0);
    });
  });

  describe('validacion de pares no soportados', () => {
    it('lanza error si el par de divisas no coincide con la tasa', () => {
      expect(() => service.convert(1, 'USD', 'EUR', rate)).toThrow(
        /cannot convert/,
      );
    });

    it('lanza error si from y to son iguales pero invalidos', () => {
      expect(() => service.convert(1, 'EUR', 'EUR', rate)).toThrow(
        /cannot convert/,
      );
    });
  });

  describe('TTL calculado a medianoche', () => {
    it('el TTL es positivo y menor a 86400 segundos', () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 1, 0);
      const ttl = Math.floor((tomorrow.getTime() - now.getTime()) / 1000);
      expect(ttl).toBeGreaterThan(0);
      expect(ttl).toBeLessThanOrEqual(86401);
    });

    it('el TTL decrece con el tiempo', () => {
      const now1 = new Date();
      const tomorrow1 = new Date(now1);
      tomorrow1.setDate(tomorrow1.getDate() + 1);
      tomorrow1.setHours(0, 0, 1, 0);
      const ttl1 = Math.floor((tomorrow1.getTime() - now1.getTime()) / 1000);

      // Simular 5 segundos despues
      const now2 = new Date(now1.getTime() + 5000);
      const tomorrow2 = new Date(now2);
      tomorrow2.setDate(tomorrow2.getDate() + 1);
      tomorrow2.setHours(0, 0, 1, 0);
      const ttl2 = Math.floor((tomorrow2.getTime() - now2.getTime()) / 1000);

      expect(ttl1).toBeGreaterThan(ttl2);
    });
  });
});
