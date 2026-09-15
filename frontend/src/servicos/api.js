const URL_BASE = 'http://localhost:3001/api';

// Funcoes auxiliares para gerenciar a sessao no localStorage
export function salvarSessao(token, usuario) {
  localStorage.setItem('makal_token', token);
  localStorage.setItem('makal_usuario', JSON.stringify(usuario));
}

export function obterToken() {
  return localStorage.getItem('makal_token');
}

export function obterUsuario() {
  const usuarioSalvo = localStorage.getItem('makal_usuario');
  return usuarioSalvo ? JSON.parse(usuarioSalvo) : null;
}

export function limparSessao() {
  localStorage.removeItem('makal_token');
  localStorage.removeItem('makal_usuario');
}

// Funcao basica para requisicoes com fetch
async function requisicao(endpoint, opcoes = {}) {
  const token = obterToken();
  const cabecalhos = {
    'Content-Type': 'application/json',
    ...(opcoes.headers || {})
  };

  if (token) {
    cabecalhos['Authorization'] = `Bearer ${token}`;
  }

  const resposta = await fetch(`${URL_BASE}${endpoint}`, {
    ...opcoes,
    headers: cabecalhos
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(dados.mensagem || 'Ocorreu um erro na comunicacao.');
  }

  return dados;
}

// Servicos de autenticacao
export async function entrar(email, senha) {
  return requisicao('/login', {
    method: 'POST',
    body: JSON.stringify({ email, senha })
  });
}

export async function cadastrar(nome, email, senha) {
  return requisicao('/cadastro', {
    method: 'POST',
    body: JSON.stringify({ nome, email, senha })
  });
}

// Servicos de musicas
export async function listarMusicas(busca = '', genero = '') {
  const parametros = new URLSearchParams();
  if (busca) parametros.append('busca', busca);
  if (genero && genero !== 'Todos') parametros.append('genero', genero);

  const query = parametros.toString() ? `?${parametros.toString()}` : '';
  return requisicao(`/musicas${query}`);
}

export async function buscarMusicaPorId(id) {
  return requisicao(`/musicas/${id}`);
}

export async function criarMusica(dados) {
  return requisicao('/musicas', {
    method: 'POST',
    body: JSON.stringify(dados)
  });
}

export async function atualizarMusica(id, dados) {
  return requisicao(`/musicas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dados)
  });
}

export async function excluirMusica(id) {
  return requisicao(`/musicas/${id}`, {
    method: 'DELETE'
  });
}

export async function obterEstatisticas() {
  return requisicao('/musicas/estatisticas');
}

export async function listarGeneros() {
  return requisicao('/musicas/generos');
}
