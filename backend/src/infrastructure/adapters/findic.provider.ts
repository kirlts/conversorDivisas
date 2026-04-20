import { Injectable, Logger } from '@nestjs/common';
import { ExchangeRate } from '../../domain/entities/exchange-rate';
import { ExchangeRateProviderPort } from '../../domain/ports/exchange-rate-provider.port';

/**
 * Adaptador concreto que obtiene tasas de cambio desde findic.cl.
 * Implementa Exponential Backoff nativo con AbortController.
 *
 * findic.cl expone:
 *   GET https://api.findic.cl/indicadores/uf
 *   Respuesta: { serie: [{ fecha: "YYYY-MM-DD", valor: number }] }
 */
@Injectable()
export class FindicProvider implements ExchangeRateProviderPort {
  private readonly logger = new Logger(FindicProvider.name);

  private readonly BASE_URL = 'https://findic.cl/api';
  private readonly MAX_RETRIES = 3;
  private readonly INITIAL_DELAY_MS = 500;
  private readonly TIMEOUT_MS = 3500;

  /**
   * Mapeo interno: par de divisas -> segmento de ruta en findic.cl.
   * Ej: findic.cl/api/uf -> devuelve la serie UF en pesos.
   * El adaptador sabe que UF se resuelve consultando /uf.
   */
  private readonly INDICATOR_MAP: Record<string, string> = {
    UF: 'uf',
    USD: 'dolar',
    EUR: 'euro',
    UTM: 'utm',
    YEN: 'yen',
    BTC: 'bitcoin',
    ETH: 'ethereum'
  };

  async getSupportedCurrencies(): Promise<string[]> {
    return ['CLP', ...Object.keys(this.INDICATOR_MAP)];
  }

  async getSupportedPairs(): Promise<Record<string, string[]>> {
    return {
      CLP: ['UF', 'USD', 'EUR', 'UTM', 'YEN'],
      UF: ['CLP'],
      USD: ['CLP', 'BTC', 'ETH'],
      EUR: ['CLP'],
      UTM: ['CLP'],
      YEN: ['CLP'],
      BTC: ['USD'],
      ETH: ['USD']
    };
  }

  async getExchangeRate(
    baseCurrency: string,
    targetCurrency: string,
  ): Promise<ExchangeRate> {
    const base = baseCurrency.toUpperCase();
    const target = targetCurrency.toUpperCase();
    
    const indicator = this.INDICATOR_MAP[base];
    if (!indicator) {
      throw new Error(`FindicProvider does not support base currency: ${base}`);
    }

    // Findic.cl devuelve en USD para crypto, en CLP para el resto
    const expectedTarget = (base === 'BTC' || base === 'ETH') ? 'USD' : 'CLP';
    if (target !== expectedTarget) {
      throw new Error(`FindicProvider does not support pair: ${base}/${target}. Expected target for ${base} is ${expectedTarget} in this adapter.`);
    }

    const url = `${this.BASE_URL}/${indicator}`;
    const data = await this.fetchWithBackoff(url);

    // Parsear respuesta de findic.cl
    // La serie viene en orden descendente: serie[0] es el valor más reciente
    const latest = data.serie?.[0];
    if (!latest || typeof latest.valor !== 'number') {
      throw new Error('Invalid response structure from findic.cl');
    }

    return new ExchangeRate(
      baseCurrency.toUpperCase(),
      targetCurrency.toUpperCase(),
      latest.valor,
      latest.fecha,
      'api',
    );
  }

  /**
   * Exponential Backoff nativo con Jitter.
   * Intentos: 500ms -> 1000ms -> 2000ms (con jitter aleatorio).
   * Cada intento tiene un timeout de 3.5s via AbortController.
   */
  private async fetchWithBackoff(url: string): Promise<any> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < this.MAX_RETRIES; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

      try {
        this.logger.log(
          `Attempt ${attempt + 1}/${this.MAX_RETRIES}: GET ${url}`,
        );

        const response = await fetch(url, { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        this.logger.log(`Success on attempt ${attempt + 1}`);
        return data;
      } catch (error) {
        lastError =
          error instanceof Error ? error : new Error(String(error));

        this.logger.warn(
          `Attempt ${attempt + 1} failed: ${lastError.message}`,
        );

        if (attempt < this.MAX_RETRIES - 1) {
          const delay = this.calculateDelay(attempt);
          this.logger.log(`Retrying in ${delay}ms...`);
          await this.sleep(delay);
        }
      } finally {
        clearTimeout(timeoutId);
      }
    }

    throw new Error(
      `All ${this.MAX_RETRIES} attempts to ${url} failed. Last error: ${lastError?.message}`,
    );
  }

  /**
   * Calcula el delay con Exponential Backoff + Jitter.
   * Base: 500ms * 2^attempt + jitter aleatorio (0-250ms).
   */
  private calculateDelay(attempt: number): number {
    const baseDelay = this.INITIAL_DELAY_MS * Math.pow(2, attempt);
    const jitter = Math.random() * 250;
    return Math.floor(baseDelay + jitter);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
