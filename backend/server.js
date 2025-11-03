require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const initDb = async () => {
  try {
    const client = await pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS guestbook (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    client.release();
    console.log("Tabela 'guestbook' verificada/criada com sucesso.");
  } catch (err) {
    console.error("Erro ao inicializar o banco de dados:", err.message);
  }
};

app.get('/', (req, res) => {
  res.send('Meu Backend está VIVO!');
});

app.get('/api/system-status', async (req, res) => {
  let dbStatus = 'operational';
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
  } catch (err) {
    dbStatus = 'outage';
  }
  
  res.json({
    version: "v1.5",
    backendStatus: "operational",
    databaseStatus: dbStatus,
    lastChecked: new Date().toISOString()
  });
});

app.get('/api/guestbook', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM guestbook ORDER BY created_at DESC');
    client.release();
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/guestbook', async (req, res) => {
  const { name, message } = req.body;
  if (!name || !message) {
    return res.status(400).json({ error: 'Nome e mensagem são obrigatórios.' });
  }
  
  try {
    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO guestbook (name, message) VALUES ($1, $2) RETURNING *',
      [name, message]
    );
    client.release();
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/guestbook/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const client = await pool.connect();
    const result = await client.query('DELETE FROM guestbook WHERE id = $1', [id]);
    client.release();
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Recado não encontrado.' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor v1.5 (com Delete e RDS) rodando na porta ${PORT}`);
  initDb();
});

