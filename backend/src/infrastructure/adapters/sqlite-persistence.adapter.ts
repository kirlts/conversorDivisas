import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import Database from 'better-sqlite3';
import * as path from 'path';
import { ExchangeRate } from '../../domain/entities/exchange-rate';
import { PersistencePort } from '../../domain/ports/persistence.port';

/**
 * Adaptador de persistencia usando SQLite.
 * Almacena el ultimo valor conocido de cada par de divisas como fallback
 * ante caida simultanea de API y cache.
 */
@Injectable()
export class SqlitePersistenceAdapter implements PersistencePort, OnModuleInit {
  private readonly logger = new Logger(SqlitePersistenceAdapter.name);
  private db!: Database.Database;
  private readonly DB_PATH = path.join(
    process.cwd(),
    'data',
    'exchange_rates.db',
  );

  onModuleInit() {
    this.initializeDatabase();
  }

  private initializeDatabase(): void {
    try {
      this.db = new Database(this.DB_PATH);
      // Habilitar WAL para mejor concurrencia
      this.db.pragma('journal_mode = WAL');

      this.db.exec(`
        CREATE TABLE IF NOT EXISTS exchange_rates (
          base_currency TEXT NOT NULL,
          target_currency TEXT NOT NULL,
          rate REAL NOT NULL,
          date TEXT NOT NULL,
          source TEXT NOT NULL,
          fetched_at TEXT NOT NULL,
          PRIMARY KEY (base_currency, target_currency, date)
        )
      `);

      this.logger.log(`SQLite database initialized at ${this.DB_PATH}`);
    } catch (error) {
      this.logger.error(`Failed to initialize SQLite: ${error}`);
      throw error;
    }
  }

  async save(rate: ExchangeRate): Promise<void> {
    try {
      const stmt = this.db.prepare(`
        INSERT OR REPLACE INTO exchange_rates 
          (base_currency, target_currency, rate, date, source, fetched_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        rate.baseCurrency,
        rate.targetCurrency,
        rate.rate,
        rate.date,
        rate.source,
        new Date().toISOString(),
      );

      this.logger.log(
        `Persisted ${rate.baseCurrency}/${rate.targetCurrency} = ${rate.rate} (${rate.date})`,
      );
    } catch (error) {
      this.logger.error(`Failed to persist rate: ${error}`);
    }
  }

  async getLatest(
    baseCurrency: string,
    targetCurrency: string,
  ): Promise<ExchangeRate | null> {
    try {
      const stmt = this.db.prepare(`
        SELECT base_currency, target_currency, rate, date, source
        FROM exchange_rates
        WHERE base_currency = ? AND target_currency = ?
        ORDER BY fetched_at DESC
        LIMIT 1
      `);

      const row = stmt.get(baseCurrency, targetCurrency) as
        | {
            base_currency: string;
            target_currency: string;
            rate: number;
            date: string;
            source: string;
          }
        | undefined;

      if (!row) {
        return null;
      }

      return new ExchangeRate(
        row.base_currency,
        row.target_currency,
        row.rate,
        row.date,
        'fallback',
      );
    } catch (error) {
      this.logger.error(`Failed to get latest rate: ${error}`);
      return null;
    }
  }

  /**
   * Probe de salud: lanza excepcion si la DB no responde.
   * Usado por el HealthController.
   */
  probe(): void {
    this.db.prepare('SELECT 1').get();
  }

  /**
   * Alias publico de getLatest, para uso del HealthController.
   */
  async getLatestRate(
    baseCurrency: string,
    targetCurrency: string,
  ): Promise<ExchangeRate | null> {
    return this.getLatest(baseCurrency, targetCurrency);
  }
}
