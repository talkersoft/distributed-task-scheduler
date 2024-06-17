import { Client } from 'pg';

// Example connection to the database
async function testConnection() {
  const client = new Client({
    user: 'user',
    host: 'localhost',
    database: 'task_scheduler',
    password: 'password',
    port: 5432,
  });

  try {
    await client.connect();
    console.log('Connected to the database');
  } catch (err) {
    console.error('Error connecting to the database', err);
  } finally {
    await client.end();
  }
}

testConnection();
