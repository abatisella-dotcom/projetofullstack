import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { entrar, salvarSessao } from '../servicos/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const navegar = useNavigate();

  async function aoEnviar(evento) {
    evento.preventDefault();
    setErro('');

    if (!email || !senha) {
      setErro('Preencha seu email e senha.');
      return;
    }

    setCarregando(true);

    try {
      const resposta = await entrar(email, senha);
      salvarSessao(resposta.token, resposta.usuario);
      navegar('/dashboard');
    } catch (err) {
      setErro(err.message || 'Falha ao autenticar.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="fundo-autenticacao fundo-login">
      {/* Bolinhas decorativas de fundo do Figma */}
      <div className="bolinha bolinha-1"></div>
      <div className="bolinha bolinha-2"></div>
      <div className="bolinha bolinha-3"></div>
      <div className="bolinha bolinha-4"></div>
      <div className="bolinha bolinha-5"></div>
      <div className="bolinha bolinha-6"></div>

      <div className="cartao-autenticacao cartao-branco">
        <h1 className="titulo-autenticacao">MakalMusic</h1>
        <p className="subtitulo-autenticacao">Login do usuário</p>

        {erro && <div className="mensagem-erro">{erro}</div>}

        <form className="formulario" onSubmit={aoEnviar}>
          <div className="grupo-campo">
            <input
              type="email"
              className="campo-input"
              placeholder="Escreva seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="grupo-campo">
            <input
              type="password"
              className="campo-input"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="botao botao-rosa" 
            disabled={carregando}
            style={{ width: '100%', marginTop: '10px' }}
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>

          <Link 
            to="/cadastro" 
            className="botao botao-outline" 
            style={{ width: '100%' }}
          >
            Cadastrar
          </Link>
        </form>
      </div>
    </div>
  );
}
