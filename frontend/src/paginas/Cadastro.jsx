import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cadastrar } from '../servicos/api';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [carregando, setCarregando] = useState(false);

  const navegar = useNavigate();

  async function aoEnviar(evento) {
    evento.preventDefault();
    setErro('');
    setSucesso('');

    if (!nome || !email || !senha) {
      setErro('Por favor, preencha todos os campos.');
      return;
    }

    setCarregando(true);

    try {
      await cadastrar(nome, email, senha);
      setSucesso('Cadastro realizado com sucesso! Redirecionando para login...');
      setTimeout(() => {
        navegar('/login');
      }, 1500);
    } catch (err) {
      setErro(err.message || 'Erro ao realizar cadastro.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="fundo-autenticacao fundo-cadastro">
      {/* Bolinhas decorativas de fundo do Figma */}
      <div className="bolinha bolinha-1" style={{ backgroundColor: 'var(--cor-rosa)' }}></div>
      <div className="bolinha bolinha-2" style={{ backgroundColor: 'var(--cor-vinho)' }}></div>
      <div className="bolinha bolinha-3" style={{ backgroundColor: 'var(--cor-rosa)' }}></div>
      <div className="bolinha bolinha-4" style={{ backgroundColor: 'var(--cor-vinho)' }}></div>
      <div className="bolinha bolinha-5" style={{ backgroundColor: 'var(--cor-vinho-escuro)' }}></div>

      <div className="cartao-autenticacao cartao-vinho">
        <h1 className="titulo-autenticacao" style={{ color: 'white' }}>MakalMusic</h1>
        <p className="subtitulo-autenticacao" style={{ color: '#F8D8DE' }}>Cadastro do usuário</p>

        {erro && <div className="mensagem-erro">{erro}</div>}
        {sucesso && <div className="mensagem-sucesso">{sucesso}</div>}

        <form className="formulario" onSubmit={aoEnviar}>
          <div className="grupo-campo">
            <input
              type="text"
              className="campo-input"
              placeholder="Escreva seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

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
            {carregando ? 'Cadastrando...' : 'Cadastrar'}
          </button>

          <Link 
            to="/login" 
            className="botao" 
            style={{ width: '100%', backgroundColor: 'transparent', border: '1px solid white', color: 'white' }}
          >
            Login
          </Link>
        </form>
      </div>
    </div>
  );
}
