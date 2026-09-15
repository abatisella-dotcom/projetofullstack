const express = require('express');
const rotas = express.Router();
const controller = require('../controllers/autenticacaoController');
const { verificarToken } = require('../middlewares/autenticacao');

// Rotas publicas
rotas.post('/cadastro', controller.cadastrar);
rotas.post('/login', controller.login);

// Rota protegida para consultar usuario logado
rotas.get('/perfil', verificarToken, controller.obterPerfil);

module.exports = rotas;
