import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { criarMusica } from '../servicos/api';

export default function NovaMusica() {
  const [titulo, setTitulo] = useState('');
  const [artista, setArtista] = useState('');
  const [album, setAlbum] = useState('');
  const [genero, setGenero] = useState('Pop');
  const [datalancamento, setDatalancamento] = useState('');
  const [capaUrl, setCapaUrl] = useState('');
  const [descricao, setDescricao] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const navegar = useNavigate();

  async function aoSalvar(evento) {
    evento.preventDefault();
    setErro('');

    if (!titulo || !artista) {
      setErro('Título e Artista são campos obrigatórios.');
      return;
    }

    setCarregando(true);

    try {
      const nova = await criarMusica({
        titulo,
        artista,
        album,
        genero,
        datalancamento: datalancamento || null,
        capa_url: capaUrl || null,
        descricao
      });

      alert('Música cadastrada com sucesso!');
      navegar(`/musicas/${nova.id}`);
    } catch (err) {
      setErro(err.message || 'Erro ao cadastrar música.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="pagina-detalhes">
      <Link to="/musicas" className="link-voltar">← Voltar para a Lista</Link>
      <h1 className="titulo-listagem" style={{ textAlign: 'left', marginBottom: '20px' }}>
        Cadastrar Nova Música
      </h1>

      {erro && <div className="mensagem-erro">{erro}</div>}

      <form className="formulario" onSubmit={aoSalvar} style={{ backgroundColor: 'white', padding: '30px', borderRadius: '14px', border: '1px solid var(--cor-borda)' }}>
        <div className="grupo-campo">
          <label className="rotulo-campo">Título da Música *</label>
          <input
            type="text"
            className="campo-input"
            placeholder="Ex: Billie Jean"
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
            placeholder="Ex: Michael Jackson"
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
            placeholder="Ex: Thriller"
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
          <label className="rotulo-campo">Link da Imagem da Capa (URL)</label>
          <input
            type="url"
            className="campo-input"
            placeholder="https://..."
            value={capaUrl}
            onChange={(e) => setCapaUrl(e.target.value)}
          />
        </div>

        <div className="grupo-campo">
          <label className="rotulo-campo">Descrição</label>
          <textarea
            className="campo-textarea"
            placeholder="Conte um pouco sobre essa música..."
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          ></textarea>
        </div>

        <div className="botoes-acoes" style={{ marginTop: '10px' }}>
          <button type="submit" className="botao botao-rosa" disabled={carregando}>
            {carregando ? 'Salvando...' : 'Salvar Música'}
          </button>
          <Link to="/musicas" className="botao botao-outline">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
