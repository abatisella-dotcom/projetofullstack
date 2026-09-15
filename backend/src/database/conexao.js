const { Pool } = require('pg');
require('dotenv').config();

// Configuracao da conexao com o PostgreSQL
const conexao = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'senai',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'MakalMusic'
});

conexao.on('connect', () => {
  console.log('Conectado ao banco de dados PostgreSQL com sucesso!');
});

module.exports = conexao;
