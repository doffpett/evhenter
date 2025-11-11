/**
 * Database Setup Script
 * Runs the schema.sql file against Vercel Postgres
 *
 * Usage:
 *   npm run db:setup
 *
 * Environment variables required:
 *   POSTGRES_URL or POSTGRES_URL_NON_POOLING
 */

import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pg from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { Client } = pg;

async function setupDatabase() {
  console.log('🔧 Setting up evHenter database...\n');

  // Check for database URL
  const databaseUrl = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;

  if (!databaseUrl) {
    console.error('❌ Error: Missing database connection URL');
    console.error('Please set POSTGRES_URL or POSTGRES_URL_NON_POOLING environment variable');
    console.error('\nYou can find this in:');
    console.error('  - Vercel Dashboard → Storage → Your Postgres → .env.local tab');
    console.error('  - Or copy from .env.local file\n');
    process.exit(1);
  }

  console.log('📊 Connecting to database...');

  const client = new Client({
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    // Connect to database
    await client.connect();
    console.log('✅ Connected to database\n');

    // Read schema file
    console.log('📖 Reading schema.sql...');
    const schemaPath = join(__dirname, 'schema.sql');
    const schema = await readFile(schemaPath, 'utf-8');
    console.log('✅ Schema file loaded\n');

    // Execute schema
    console.log('⚙️  Executing schema...');
    await client.query(schema);
    console.log('✅ Schema executed successfully\n');

    // Verify tables were created
    console.log('🔍 Verifying tables...');
    const result = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    console.log('✅ Tables created:');
    result.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });
    console.log('');

    // Count initial data
    console.log('📊 Checking initial data...');
    const eventTypesCount = await client.query('SELECT COUNT(*) FROM event_types');
    const locationsCount = await client.query('SELECT COUNT(*) FROM locations');

    console.log(`✅ Event types: ${eventTypesCount.rows[0].count}`);
    console.log(`✅ Locations: ${locationsCount.rows[0].count}`);
    console.log('');

    console.log('🎉 Database setup complete!\n');
    console.log('Next steps:');
    console.log('  1. Test API: npm run dev');
    console.log('  2. Visit: http://localhost:3000/api/health');
    console.log('  3. Check database: SELECT * FROM event_types;\n');

  } catch (error) {
    console.error('❌ Error setting up database:');
    console.error(error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('👋 Disconnected from database');
  }
}

// Run setup
setupDatabase();
