const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = 3000;

const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.POSTGRES_DB || 'stackdb',
  user: process.env.POSTGRES_USER || 'stackuser',
  password: process.env.POSTGRES_PASSWORD || 'stackpass',
});

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

app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});