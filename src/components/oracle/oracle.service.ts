import { Injectable, Inject, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class OracleService {
  private readonly logger = new Logger(OracleService.name);

  constructor(
    @Inject('ORACLE_DATA_SOURCE')
    private dataSource: DataSource,
  ) {}

  /**
   * Execute a raw SELECT query
   * @param query SQL query string
   * @param parameters Query parameters (optional)
   * @returns Array of results
   */
  async executeQuery<T = any>(
    query: string,
    parameters: any[] = [],
  ): Promise<T[]> {
    try {
      const result = await this.dataSource.query(query, parameters);
      return result;
    } catch (error) {
      this.logger.error(`Query execution failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Execute a raw INSERT/UPDATE/DELETE query
   * @param query SQL query string
   * @param parameters Query parameters (optional)
   * @returns Affected rows count or result
   */
  async executeNonQuery(query: string, parameters: any[] = []): Promise<any> {
    try {
      const result = await this.dataSource.query(query, parameters);
      return result;
    } catch (error) {
      this.logger.error(`Non-query execution failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Execute a stored procedure
   * @param procedureName Name of the stored procedure
   * @param parameters Parameters for the procedure
   * @returns Result from the procedure
   */
  async executeProcedure(
    procedureName: string,
    parameters: any[] = [],
  ): Promise<any> {
    try {
      const placeholders = parameters.map((_, i) => `:${i + 1}`).join(', ');
      const query = `BEGIN ${procedureName}(${placeholders}); END;`;

      const result = await this.dataSource.query(query, parameters);
      return result;
    } catch (error) {
      this.logger.error(`Procedure execution failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Execute query with transaction
   * @param callback Function containing queries to execute in transaction
   * @returns Result from callback
   */
  async executeTransaction<T>(
    callback: (queryRunner: any) => Promise<T>,
  ): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await callback(queryRunner);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Transaction failed: ${error.message}`);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Get a single row result
   * @param query SQL query string
   * @param parameters Query parameters (optional)
   * @returns Single row or null
   */
  async getOne<T = any>(
    query: string,
    parameters: any[] = [],
  ): Promise<T | null> {
    const results = await this.executeQuery<T>(query, parameters);
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Check if connection is alive
   * @returns boolean
   */
  async isConnected(): Promise<boolean> {
    try {
      await this.dataSource.query('SELECT 1 FROM DUAL');
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get connection info
   * @returns Connection information
   */
  getConnectionInfo() {
    return {
      isConnected: this.dataSource.isInitialized,
      driver: this.dataSource.driver.options.type,
      host: this.dataSource.driver.options['host'],
      serviceName: this.dataSource.driver.options['serviceName'],
    };
  }

  // ========== CONVENIENCE METHODS ==========

  /**
   * Get all tables in the current schema
   */
  async getTables(): Promise<any[]> {
    const query = `
      SELECT table_name, tablespace_name, num_rows
      FROM user_tables
      ORDER BY table_name
    `;
    return this.executeQuery(query);
  }

  /**
   * Get table columns
   * @param tableName Name of the table
   */
  async getTableColumns(tableName: string): Promise<any[]> {
    const query = `
      SELECT column_name, data_type, data_length, nullable
      FROM user_tab_columns
      WHERE table_name = :1
      ORDER BY column_id
    `;
    return this.executeQuery(query, [tableName.toUpperCase()]);
  }

  /**
   * Get table row count
   * @param tableName Name of the table
   */
  async getTableCount(tableName: string): Promise<number> {
    const query = `SELECT COUNT(*) as count FROM ${tableName}`;
    const result = await this.getOne<{ COUNT: number }>(query);
    return result ? result.COUNT : 0;
  }

  /**
   * Paginated query
   * @param query Base SQL query
   * @param page Page number (1-based)
   * @param pageSize Number of rows per page
   * @param parameters Query parameters
   */
  async getPaginated<T = any>(
    query: string,
    page: number = 1,
    pageSize: number = 10,
    parameters: any[] = [],
  ): Promise<{ data: T[]; page: number; pageSize: number; total: number }> {
    const offset = (page - 1) * pageSize;

    // Get total count
    const countQuery = `SELECT COUNT(*) as count FROM (${query})`;
    const countResult = await this.getOne<{ COUNT: number }>(
      countQuery,
      parameters,
    );
    const total = countResult ? countResult.COUNT : 0;

    // Get paginated data
    const paginatedQuery = `
      SELECT * FROM (
        SELECT a.*, ROWNUM rnum FROM (
          ${query}
        ) a WHERE ROWNUM <= :limit
      ) WHERE rnum > :offset
    `;

    const data = await this.executeQuery<T>(paginatedQuery, [
      ...parameters,
      offset + pageSize,
      offset,
    ]);

    return {
      data,
      page,
      pageSize,
      total,
    };
  }
}
