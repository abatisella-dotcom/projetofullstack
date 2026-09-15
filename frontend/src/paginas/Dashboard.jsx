import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { obterEstatisticas, obterUsuario } from '../servicos/api';

export default function Dashboard() {
  const [dados, setDados] = useState({
    totalMusicas: 0,
    totalArtistas: 0,
    totalAlbuns: 0,
    generos: [],
    ultimasMusicas: []
  });
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const usuario = obterUsuario();

  useEffect(() => {
    async function carregar() {
      try {
        const resposta = await obterEstatisticas();
        setDados(resposta);
      } catch (err) {
        setErro('Erro ao carregar estatísticas do dashboard.');
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  if (carregando) {
    return <div className="painel-dashboard"><p>Carregando painel...</p></div>;
  }

  return (
    <div className="painel-dashboard">
      <div className="dashboard-cabecalho">
        <h1 className="dashboard-titulo">DASHBOARD</h1>
        <p className="dashboard-saudacao">
          Bem Vindo, {usuario?.nome || 'Usuário'}
        </p>
      </div>

      {erro && <div className="mensagem-erro">{erro}</div>}

      {/* Cartoes de estatisticas */}
      <div className="estatisticas-grid">
        <div className="cartao-estatistica">
          <div className="numero-estatistica">{dados.totalMusicas}</div>
          <div className="legenda-estatistica">Total de Músicas</div>
        </div>

        <div className="cartao-estatistica">
          <div className="numero-estatistica">{dados.totalArtistas}</div>
          <div className="legenda-estatistica">Total de Artistas</div>
        </div>

        <div className="cartao-estatistica">
          <div className="numero-estatistica">{dados.totalAlbuns}</div>
          <div className="legenda-estatistica">Total de Álbuns</div>
        </div>
      </div>

      {/* Grafico de Generos e Ultimas Cadastradas */}
      <div className="dashboard-secoes-grid">
        {/* Distribuicao por genero */}
        <div className="painel-box">
          <h2 className="painel-box-titulo">Músicas por Gênero</h2>
          {dados.generos && dados.generos.length > 0 ? (
            dados.generos.map((item, index) => {
              const porcentagem = Math.round((parseInt(item.total) / (dados.totalMusicas || 1)) * 100);
              return (
                <div key={index} className="barra-genero-item">
                  <div className="barra-genero-info">
                    <span>{item.genero}</span>
                    <span>{item.total} ({porcentagem}%)</span>
                  </div>
                  <div className="barra-fundo">
                    <div 
                      className="barra-progresso" 
                      style={{ width: `${porcentagem}%` }}
                    ></div>
                  </div>
                </div>
              );
            })
          ) : (
            <p>Nenhum gênero cadastrado.</p>
          )}

          <div style={{ marginTop: '25px' }}>
            <Link to="/musicas/nova" className="botao botao-rosa" style={{ width: '100%' }}>
              Adicionar Novo +
            </Link>
          </div>
        </div>

        {/* Tabela de ultimas musicas */}
        <div className="painel-box">
          <h2 className="painel-box-titulo">Últimas Músicas Cadastradas</h2>
          {dados.ultimasMusicas && dados.ultimasMusicas.length > 0 ? (
            <table className="tabela-simples">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Artista</th>
                  <th>Gênero</th>
                </tr>
              </thead>
              <tbody>
                {dados.ultimasMusicas.map((m) => (
                  <tr key={m.id}>
                    <td>
                      <Link to={`/musicas/${m.id}`} style={{ color: 'var(--cor-vinho)', fontWeight: '600' }}>
                        {m.titulo}
                      </Link>
                    </td>
                    <td>{m.artista}</td>
                    <td><span className="tag-genero">{m.genero}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Nenhuma música cadastrada ainda.</p>
          )}
        </div>
      </div>
    </div>
  );
}
