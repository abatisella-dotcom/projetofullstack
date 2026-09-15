import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { buscarMusicaPorId, atualizarMusica } from '../servicos/api';

export default function EditarMusica() {
  const { id } = useParams();
  const [titulo, setTitulo] = useState('');
  const [artista, setArtista] = useState('');
  const [album, setAlbum] = useState('');
  const [genero, setGenero] = useState('Pop');
  const [datalancamento, setDatalancamento] = useState('');
  const [capaUrl, setCapaUrl] = useState('');
  const [descricao, setDescricao] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  const navegar = useNavigate();

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await buscarMusicaPorId(id);
        setTitulo(dados.titulo || '');
        setArtista(dados.artista || '');
        setAlbum(dados.album || '');
        setGenero(dados.genero || 'Pop');
        setDatalancamento(dados.datalancamento || '');
        setCapaUrl(dados.capa_url || '');
        setDescricao(dados.descricao || '');
      } catch (err) {
        setErro('Erro ao carregar dados para edição.');
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [id]);

  async function aoSalvar(evento) {
    evento.preventDefault();
    setErro('');

    if (!titulo || !artista) {
      setErro('Título e Artista são obrigatórios.');
      return;
    }

    setSalvando(true);

    try {
      await atualizarMusica(id, {
        titulo,
        artista,
        album,
        genero,
        datalancamento: datalancamento || null,
        capa_url: capaUrl || null,
        descricao
      });

      alert('Música atualizada com sucesso!');
      navegar(`/musicas/${id}`);
    } catch (err) {
      setErro(err.message || 'Erro ao atualizar música.');
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return <div className="pagina-detalhes"><p>Carregando dados da música...</p></div>;
  }

  return (
    <div className="pagina-detalhes">
      <Link to={`/musicas/${id}`} className="link-voltar">← Voltar para Detalhes</Link>
      <h1 className="titulo-listagem" style={{ textAlign: 'left', marginBottom: '20px' }}>
        Editar Música
      </h1>

      {erro && <div className="mensagem-erro">{erro}</div>}

      <form className="formulario" onSubmit={aoSalvar} style={{ backgroundColor: 'white', padding: '30px', borderRadius: '14px', border: '1px solid var(--cor-borda)' }}>
        <div className="grupo-campo">
          <label className="rotulo-campo">Título da Música *</label>
          <input
            type="text"
            className="campo-input"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>

        <div className="grupo-campo">
          <label className="rotulo-campo">Artista / Banda *</label>
          <input
            type="text"
            className="campo-input"
            value={artista}
            onChange={(e) => setArtista(e.target.value)}
            required
          />
        </div>

        <div className="grupo-campo">
          <label className="rotulo-campo">Álbum</label>
          <input
            type="text"
            className="campo-input"
            value={album}
            onChange={(e) => setAlbum(e.target.value)}
          />
        </div>

        <div className="grupo-campo">
          <label className="rotulo-campo">Gênero Musical</label>
          <select
            className="campo-select"
            value={genero}
            onChange={(e) => setGenero(e.target.value)}
          >
            <option value="Pop">Pop</option>
            <option value="Rock">Rock</option>
            <option value="R&B">R&B</option>
            <option value="Jazz">Jazz</option>
            <option value="MPB">MPB</option>
          </select>
        </div>

        <div className="grupo-campo">
          <label className="rotulo-campo">Data de Lançamento</label>
          <input
            type="date"
            className="campo-input"
            value={datalancamento}
            onChange={(e) => setDatalancamento(e.target.value)}
          />
        </div>

        <div className="grupo-campo">
          <label className="rotulo-campo">Link da Capa (URL)</label>
          <input
            type="url"
            className="campo-input"
            value={capaUrl}
            onChange={(e) => setCapaUrl(e.target.value)}
          />
        </div>

        <div className="grupo-campo">
          <label className="rotulo-campo">Descrição</label>
          <textarea
            className="campo-textarea"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          ></textarea>
        </div>

        <div className="botoes-acoes" style={{ marginTop: '10px' }}>
          <button type="submit" className="botao botao-rosa" disabled={salvando}>
            {salvando ? 'Atualizando...' : 'Salvar Alterações'}
          </button>
          <Link to={`/musicas/${id}`} className="botao botao-outline">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
