const jwt = require('jsonwebtoken');

// Middleware para verificar se o usuario esta logado
function verificarToken(req, res, next) {
  const cabecalhoAuth = req.headers['authorization'];
  
  if (!cabecalhoAuth) {
    return res.status(401).json({ mensagem: 'Acesso negado. Token nao informado.' });
  }

  // O cabecalho vem no formato: Bearer <token>
  const partes = cabecalhoAuth.split(' ');
  if (partes.length !== 2 || partes[0] !== 'Bearer') {
    return res.status(401).json({ mensagem: 'Formato do token invalido.' });
  }

  const token = partes[1];

  try {
    const usuarioDecodificado = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = usuarioDecodificado;
    next();
  } catch (erro) {
    return res.status(403).json({ mensagem: 'Token invalido ou expirado.' });
  }
}

//Middleware para verificar se o usuario e administror 
function verificarAdmin(req, res, next) {
  if (req.usuario && req.usuario.tipo === 'administrador') {
    return next();
  }
  return res.status(403).json({ mensagem: 'Acesso restrito para administradores.' });
}

module.exports = {
    verificarToken,
    verificarAdmin
};