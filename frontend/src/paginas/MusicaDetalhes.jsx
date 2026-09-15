import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { buscarMusicaPorId, excluirMusica, obterUsuario } from '../servicos/api';

export default function MusicaDetalhes() {
  const { id } = useParams();
  const [musica, setMusica] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [removendo, setRemovendo] = useState(false);

  const usuario = obterUsuario();
  const navegar = useNavigate();

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await buscarMusicaPorId(id);
        setMusica(dados);
      } catch (err) {
        setErro('Música não encontrada ou erro ao carregar.');
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [id]);

  async function aoExcluir() {
    const confirmou = window.confirm(`Tem certeza que deseja excluir a música "${musica.titulo}"?`);
    if (!confirmou) return;

    setRemovendo(true);
    try {
      await excluirMusica(id);
      alert('Música excluída com sucesso!');
      navegar('/musicas');
    } catch (err) {
      alert(err.message || 'Erro ao excluir música.');
      setRemovendo(false);
    }
  }

  if (carregando) {
    return <div className="pagina-detalhes"><p>Carregando detalhes...</p></div>;
  }

  if (erro || !musica) {
    return (
      <div className="pagina-detalhes">
        <Link to="/musicas" className="link-voltar">← Voltar para a Lista</Link>
        <div className="mensagem-erro">{erro || 'Música não encontrada.'}</div>
      </div>
    );
  }

  return (
    <div className="pagina-detalhes">
      <Link to="/musicas" className="link-voltar">← Voltar para a Lista</Link>

      <div className="detalhes-grid">
        {/* Capa da Musica */}
        <img
          src={musica.capa_url || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop'}
          alt={musica.titulo}
          className="capa-detalhe-grande"
        />

        {/* Quadro rosa com os dados conforme Figma */}
        <div className="box-dados-rosa">
          <div className="linha-dado">
            <strong>TÍTULO:</strong> {musica.titulo}
          </div>
          <div className="linha-dado">
            <strong>ARTISTA:</strong> {musica.artista}
          </div>
          <div className="linha-dado">
            <strong>ÁLBUM:</strong> {musica.album || 'Single'}
          </div>
          <div className="linha-dado">
            <strong>GÊNERO:</strong> {musica.genero}
          </div>
          <div className="linha-dado">
            <strong>DATA DE LANÇAMENTO:</strong> {musica.datalancamento_formatada || musica.datalancamento || 'Não informada'}
          </div>
        </div>
      </div>

      {/* Secao de Descricao */}
      <div className="secao-descricao">
        <h3 className="secao-descricao-titulo">Descrição</h3>
        <p style={{ lineHeight: '1.6', color: '#444' }}>
          {musica.descricao || 'Nenhuma descrição cadastrada para esta música.'}
        </p>
      </div>

      {/* Botoes de Acao (Editar / Excluir) */}
      {usuario && (
        <div className="botoes-acoes">
          <Link to={`/musicas/${musica.id}/editar`} className="botao botao-rosa">
            Editar ✎
          </Link>

          <button 
            type="button" 
            className="botao botao-perigo" 
            onClick={aoExcluir}
            disabled={removendo}
          >
            {removendo ? 'Excluindo...' : 'Remover 🗑'}
          </button>
        </div>
      )}
    </div>
  );
}
