const conexao = require('../database/conexao');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Cadastro de novo usuario
async function cadastrar(req, res) {
  const { nome, email, senha, tipo } = req.body;

  // Validacao basica de campos obrigatorios
  if (!nome || !email || !senha) {
    return res.status(400).json({ mensagem: 'Por favor, preencha nome, email e senha.' });
  }

  try {
    // Verifica se o email ja esta em uso
    const consultaExistente = await conexao.query(
      'SELECT id FROM usuarios WHERE email = $1',
      [email]
    );

    if (consultaExistente.rowCount > 0) {
      return res.status(400).json({ mensagem: 'Este email ja esta cadastrado.' });
    }

    // Criptografa a senha antes de salvar
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const tipoUsuario = tipo === 'administrador' ? 'administrador' : 'usuario';

    const novoUsuario = await conexao.query(
      'INSERT INTO usuarios (nome, email, senha, tipo) VALUES ($1, $2, $3, $4) RETURNING id, nome, email, tipo',
      [nome, email, senhaCriptografada, tipoUsuario]
    );

    return res.status(201).json({
      mensagem: 'Usuario cadastrado com sucesso!',
      usuario: novoUsuario.rows[0]
    });
  } catch (erro) {
    console.error('Erro ao cadastrar usuario:', erro);
    return res.status(500).json({ mensagem: 'Erro interno ao realizar cadastro.' });
  }
}

// Login do usuario
async function login(req, res) {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ mensagem: 'Email e senha sao obrigatorios.' });
  }

  try {
    // Busca o usuario pelo email
    const resultado = await conexao.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    );

    if (resultado.rowCount === 0) {
      return res.status(401).json({ mensagem: 'Email ou senha invalidos.' });
    }

    const usuario = resultado.rows[0];

    // Compara a senha informada com a senha salva no banco
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ mensagem: 'Email ou senha invalidos.' });
    }

    // Cria o token JWT valido por 8 horas
    const segredo = process.env.JWT_SECRET || 'makalmusic_segredo_super_simples_2026';
    const token = jwt.sign(
      {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo
      },
      segredo,
      { expiresIn: '8h' }
    );

    return res.status(200).json({
      mensagem: 'Login realizado com sucesso!',
      token: token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo
      }
    });
  } catch (erro) {
    console.error('Erro no login:', erro);
    return res.status(500).json({ mensagem: 'Erro interno ao realizar login.' });
  }
}

// Perfil do usuario conectado
async function obterPerfil(req, res) {
  try {
    const resultado = await conexao.query(
      'SELECT id, nome, email, tipo FROM usuarios WHERE id = $1',
      [req.usuario.id]
    );

    if (resultado.rowCount === 0) {
      return res.status(404).json({ mensagem: 'Usuario nao encontrado.' });
    }

    return res.status(200).json(resultado.rows[0]);
  } catch (erro) {
    console.error('Erro ao buscar perfil:', erro);
    return res.status(500).json({ mensagem: 'Erro ao buscar perfil do usuario.' });
  }
}

module.exports = {
  cadastrar,
  login,
  obterPerfil
};
