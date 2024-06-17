import { Client } from 'pg';
import { readFileSync } from 'fs';
import { join } from 'path';

const RETRY_INTERVAL = 2000;
const MAX_RETRIES = 10;

async function initializeDatabase(retries = 0) {
  const client = new Client({
    user: 'user',
    host: 'postgres',
    database: 'task_scheduler',
    password: 'password',
    port: 5432,
  });

  try {
    await client.connect();
    const initSqlPath = join(__dirname, 'init.sql'); // Updated path
    const initSql = readFileSync(initSqlPath).toString();
    await client.query(initSql);
    console.log('Tables created successfully');
  } catch (err) {
    if (retries < MAX_RETRIES) {
      console.log(`Error creating tables, retrying in ${RETRY_INTERVAL / 1000} seconds... (${retries + 1}/${MAX_RETRIES})`);
      setTimeout(() => initializeDatabase(retries + 1), RETRY_INTERVAL);
    } else {
      console.error('Error creating tables after maximum retries', err);
    }
  } finally {
    await client.end();
  }
}

initializeDatabase();
