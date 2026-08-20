const express = require('express');
const { Pool } = require('pg');
const { createClient } = require('redis');

const app = express();
const PORT = 3000;

const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.POSTGRES_DB || 'stackdb',
  user: process.env.POSTGRES_USER || 'stackuser',
  password: process.env.POSTGRES_PASSWORD || 'stackpass',
});

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'cache',
    port: Number(process.env.REDIS_PORT || 6379),
  },
});
redisClient.on('error', (err) => console.error('[cache] Redis error:', err.message));
redisClient.connect().then(() => console.log('[cache] Redis connected'));

app.get('/', (req, res) => {
  res.send('Hello from the API!\n');
});

app.get('/db-check', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ database: 'connected', time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ database: 'unreachable', error: err.message });
  }
});

app.get('/cache-check', async (req, res) => {
  try {
    await redisClient.set('last-check', new Date().toISOString());
    const value = await redisClient.get('last-check');
    res.json({ cache: 'connected', value });
  } catch (err) {
    res.status(500).json({ cache: 'unreachable', error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});