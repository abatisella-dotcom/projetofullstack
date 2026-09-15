import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listarMusicas } from '../servicos/api';
import { FaSearch } from "react-icons/fa";

export default function MusicasLista() {
  const [musicas, setMusicas] = useState([]);
  const [busca, setBusca] = useState('');
  const [generoSelecionado, setGeneroSelecionado] = useState('Todos');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  // Carrega as musicas do backend
  async function carregarMusicas() {
    setCarregando(true);
    setErro('');
    try {
      const dados = await listarMusicas(busca, generoSelecionado);
      setMusicas(dados);
    } catch (err) {
      setErro('Erro ao carregar a lista de músicas.');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarMusicas();
  }, [generoSelecionado]);

  function aoBuscar(evento) {
    evento.preventDefault();
    carregarMusicas();
  }

  return (
    <div className="pagina-listagem">
      <h1 className="titulo-listagem">Listagem de Músicas</h1>

      {/* Barra de pesquisa e filtros de genero */}
      <div className="barra-filtros">
        <form className="busca-container" onSubmit={aoBuscar}>
          <input
            type="text"
            className="busca-input"
            placeholder= "Pesquisar por músicas"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </form>

        
      </div>

      {erro && <div className="mensagem-erro">{erro}</div>}

      {carregando ? (
        <p style={{ textAlign: 'center', padding: '40px' }}>Carregando músicas...</p>
      ) : musicas.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '40px' }}>Nenhuma música encontrada para os critérios selecionados.</p>
      ) : (
        <div className="grid-musicas">
          {musicas.map((m) => (
            <div key={m.id} className="cartao-musica">
              <img
                src={m.capa_url || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop'}
                alt={m.titulo}
                className="capa-musica"
              />
              <div className="info-musica">
                <h3 className="titulo-musica">{m.titulo}</h3>
                <p className="artista-musica">{m.artista}</p>
                <span className="tag-genero">{m.genero || 'Geral'}</span>
                
                <Link to={`/musicas/${m.id}`} className="botao-detalhes">
                  Ver detalhes
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
