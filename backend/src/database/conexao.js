const { Pool } = require('pg');
require('dotenv').config();

// Configuracao da conexao com o PostgreSQL
const conexao = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME
});

conexao.on('connect', () => {
  console.log('Conectado ao banco de dados PostgreSQL com sucesso!');
});

module.exports = conexao;
