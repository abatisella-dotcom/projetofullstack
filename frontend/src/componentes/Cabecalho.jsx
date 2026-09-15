import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { obterUsuario, limparSessao } from '../servicos/api';

export default function Cabecalho() {
  const [menuAberto, setMenuAberto] = useState(false);
  const usuario = obterUsuario();
  const navegar = useNavigate();
  const localizacao = useLocation();

  function fazerLogout() {
    limparSessao();
    navegar('/login');
  }

  return (
    <header className="cabecalho">
      <Link to="/" className="cabecalho-logo">
        MakalMusic
      </Link>

      <button 
        className="menu-hamburguer" 
        onClick={() => setMenuAberto(!menuAberto)}
        aria-label="Abrir menu"
      >
        ☰
      </button>

      <nav className={`cabecalho-menu ${menuAberto ? 'aberto' : ''}`}>
        <Link 
          to="/" 
          className={`cabecalho-link ${localizacao.pathname === '/' ? 'ativo' : ''}`}
          onClick={() => setMenuAberto(false)}
        >
          Início
        </Link>
        <Link 
          to="/musicas" 
          className={`cabecalho-link ${localizacao.pathname === '/musicas' ? 'ativo' : ''}`}
          onClick={() => setMenuAberto(false)}
        >
          Listagem
        </Link>

        {usuario && (
          <>
            <Link 
              to="/musicas/nova" 
              className={`cabecalho-link ${localizacao.pathname === '/musicas/nova' ? 'ativo' : ''}`}
              onClick={() => setMenuAberto(false)}
            >
              Cadastro Música
            </Link>
            <Link 
              to="/dashboard" 
              className={`cabecalho-link ${localizacao.pathname === '/dashboard' ? 'ativo' : ''}`}
              onClick={() => setMenuAberto(false)}
            >
              Dashboard
            </Link>
          </>
        )}

        {usuario ? (
          <button className="cabecalho-botao-sair" onClick={fazerLogout}>
            Sair
          </button>
        ) : (
          <Link 
            to="/login" 
            className="cabecalho-botao-sair"
            onClick={() => setMenuAberto(false)}
          >
            Entrar
          </Link>
        )}
      </nav>
    </header>
  );
}
