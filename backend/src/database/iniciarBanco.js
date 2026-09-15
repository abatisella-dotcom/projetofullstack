const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const configPadrao = {
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'senai',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
};

const nomeBanco = process.env.DB_NAME || 'MakalMusic';

async function inicializar() {
  console.log('Verificando criacao do banco de dados...');

  // 1. Conecta no banco padrao "postgres" para verificar/criar o MakalMusic
  const clienteAdmin = new Client({
    ...configPadrao,
    database: 'postgres'
  });

  try {
    await clienteAdmin.connect();
    
    // Verifica se o banco ja existe
    const consulta = await clienteAdmin.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [nomeBanco]
    );

    if (consulta.rowCount === 0) {
      console.log(`Criando banco de dados "${nomeBanco}"...`);
      await clienteAdmin.query(`CREATE DATABASE "${nomeBanco}"`);
      console.log(`Banco de dados "${nomeBanco}" criado com sucesso!`);
    } else {
      console.log(`O banco de dados "${nomeBanco}" ja existe.`);
    }
  } catch (erro) {
    console.error('Erro ao conectar ao postgres padrao:', erro.message);
  } finally {
    await clienteAdmin.end();
  }

  // 2. Conecta no banco "MakalMusic" para executar os scripts SQL
  const clienteMakal = new Client({
    ...configPadrao,
    database: nomeBanco
  });

  try {
    await clienteMakal.connect();
    console.log(`Conectado ao banco "${nomeBanco}". Executando scripts...`);

    const caminhoTabelas = path.join(__dirname, '../../../database/criar_tabelas.sql');
    const sqlTabelas = fs.readFileSync(caminhoTabelas, 'utf-8');
    await clienteMakal.query(sqlTabelas);
    console.log('Tabelas criadas com sucesso!');

    const caminhoDados = path.join(__dirname, '../../../database/dados_iniciais.sql');
    const sqlDados = fs.readFileSync(caminhoDados, 'utf-8');
    await clienteMakal.query(sqlDados);
    console.log('Dados iniciais inseridos com sucesso!');

    console.log('Inicializacao do banco finalizada com exito!');
  } catch (erro) {
    console.error('Erro ao executar scripts no MakalMusic:', erro.message);
  } finally {
    await clienteMakal.end();
  }
}

inicializar();
