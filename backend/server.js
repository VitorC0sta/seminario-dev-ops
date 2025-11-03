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


app.get('/', (req, res) => {
  res.send('Meu Backend está VIVO! (v1.4)');
});

app.get('/test-db', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    res.json({
      message: 'Conexão com RDS foi um SUCESSO!',
      db_time: result.rows[0].now
    });
    client.release();
  } catch (err) {
    res.status(500).json({
      message: 'ERRO ao conectar no RDS!',
      error: err.message
    });
  }
});

app.get('/api/tecnologias', (req, res) => {
  const tecnologias = [
    { id: 1, nome: "React (Vite)" },
    { id: 2, nome: "Node.js (Express)" },
    { id: 3, nome: "Docker" },
    { id: 4, nome: "GitHub Actions (CI/CD)" },
    { id: 5, nome: "Amazon RDS (PostgreSQL)" },
    { id: 6, nome: "Amazon ECS + Fargate" },
    { id: 7, nome: "Amazon ECR" },
    { id: 8, nome: "Amazon ALB" }
  ];
  
  setTimeout(() => {
    res.json(tecnologias);
  }, 500);
});


app.listen(PORT, () => {
  console.log(`Servidor v1.3 rodando na porta ${PORT}`);
});