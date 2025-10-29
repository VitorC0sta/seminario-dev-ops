// server.js

require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');


const app = express();
app.use(cors()); 
app.use(express.json()); 

const PORT = process.env.PORT || 8080;

// 4. Configuração do Banco (futuro RDS)
// O 'dotenv' vai carregar o DATABASE_URL do seu .env local
// O pipeline do ECS vai injetar essa variável em produção
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.get('/', (req, res) => {
  res.send('Meu Backend está VIVO!');
});

// Rota 2: "Teste de DB" (para provar que conectou no RDS)
app.get('/test-db', async (req, res) => {
  try {
    const client = await pool.connect();
    // Tenta pegar a hora atual do banco de dados
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

// 6. Iniciar Servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
