/**
 * Database Connection Helper
 * PostgreSQL client for Vercel Postgres
 */

import pg from 'pg';

const { Pool } = pg;

/**
 * Create a connection pool for database queries
 * Uses Vercel Postgres environment variables
 *
 * @returns {Pool} PostgreSQL connection pool
 */
export function createPool() {
  const connectionString = process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING;

  if (!connectionString) {
    throw new Error('Missing POSTGRES_URL environment variable');
  }

  return new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    },
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 2000, // Timeout after 2 seconds
  });
}

/**
 * Execute a single query
 *
 * @param {string} text - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<Object>} Query result
 */
export async function query(text, params) {
  const pool = createPool();

  try {
    const start = Date.now();
    const result = await pool.query(text, params);
    const duration = Date.now() - start;

    // Log slow queries (> 1 second)
    if (duration > 1000) {
      console.warn('Slow query detected:', { text, duration, rows: result.rowCount });
    }

    return result;
  } catch (error) {
    console.error('Database query error:', {
      message: error.message,
      query: text,
      params
    });
    throw error;
  } finally {
    await pool.end();
  }
}

/**
 * Execute a query and return the first row
 *
 * @param {string} text - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<Object|null>} First row or null
 */
export async function queryOne(text, params) {
  const result = await query(text, params);
  return result.rows[0] || null;
}

/**
 * Execute a query and return all rows
 *
 * @param {string} text - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<Array>} All rows
 */
export async function queryAll(text, params) {
  const result = await query(text, params);
  return result.rows;
}

/**
 * Check if database connection is working
 *
 * @returns {Promise<boolean>} True if connection works
 */
export async function checkConnection() {
  try {
    await query('SELECT 1');
    return true;
  } catch (error) {
    console.error('Database connection check failed:', error.message);
    return false;
  }
}

/**
 * Get database version and stats
 *
 * @returns {Promise<Object>} Database info
 */
export async function getDatabaseInfo() {
  try {
    const versionResult = await queryOne('SELECT version()');
    const sizeResult = await queryOne(`
      SELECT pg_size_pretty(pg_database_size(current_database())) as size
    `);
    const tablesResult = await queryAll(`
      SELECT
        schemaname,
        tablename,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
        pg_total_relation_size(schemaname||'.'||tablename) AS size_bytes
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY size_bytes DESC
    `);

    return {
      version: versionResult?.version,
      database_size: sizeResult?.size,
      tables: tablesResult
    };
  } catch (error) {
    console.error('Failed to get database info:', error.message);
    return null;
  }
}

export default {
  createPool,
  query,
  queryOne,
  queryAll,
  checkConnection,
  getDatabaseInfo
};
