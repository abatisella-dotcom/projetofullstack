const express = require('express');
const cors = require('cors');
require('dotenv').config();

const autenticacaoRotas = require('./routes/autenticacaoRotas');
const musicasRotas = require('./routes/musicasRotas');

const app = express();
const porta = process.env.PORT;

// Middlewares basicos
app.use(cors());
app.use(express.json());

// Rotas da API 
app.use('/api', autenticacaoRotas);
app.use('/api/musicas', musicasRotas);

// Rota de teste
app.get('/', (req, res) => {
    res.json({ status: 'API MakalMusic funcionndo com sucesso!' });
});

// Inicializa o servidor
app.listen(porta, () => {
  console.log(`Servidor rodando na porta http://localhost:${porta}`);
});
