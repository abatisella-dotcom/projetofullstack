const express = require('express');
const rotas = express.Router();
const controller = require('../controllers/musicasController');
const { verificarToken, verificarAdmin } = require('../middlewares/autenticacao');

// Rotas publicas 
rotas.get('/', controller.listar);
rotas.get('/estatisticas', controller.estatisticas);
rotas.get('/generos', controller.listarGeneros);
rotas.get('/:id', controller.buscarPorId);

// Rotas protegidas
rotas.post('/', verificarToken, controller.cadastrar);
rotas.put('/:id', verificarToken, controller.atualizar);
rotas.delete('/:id', verificarToken, controller.excluir);

module.exports = rotas;
