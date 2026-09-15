import React from 'react';
import { Link } from 'react-router-dom';

export default function Inicio() {
  const equipe = [
    { nome: 'Ana Beatriz', foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop' },
    { nome: 'Ana Koso', foto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop' },
    { nome: 'Maria Manso', foto: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop' },
    { nome: 'Maria Dias', foto: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200&auto=format&fit=crop' }
  ];

  return (
    <div className="conteudo-principal">
      {/* Secao de destaque (Hero) */}
      <section className="home-hero">
        <div className="home-hero-texto">
          <h1 className="home-hero-titulo">
            Suas músicas organizadas em um só local.
          </h1>
          <p className="home-hero-subtitulo">
            Explore grandes sucessos do Pop, Rock, R&B, Jazz e MPB. Cadastre, organize e consulte suas músicas favoritas.
          </p>
          <Link to="/musicas" className="botao botao-rosa">
            Comece agora
          </Link>
        </div>

        <div className="home-disco-vinil">
          <div className="disco-centro">
            Makal
          </div>
        </div>
      </section>

      {/* Secao de recursos */}
      <section className="home-secao">
        <h2 className="home-secao-titulo">O que você encontra aqui</h2>
        
        <div className="home-recursos-grid">
          <div className="home-cartao-recurso">
            <div className="home-icone-recurso">🎤</div>
            <h3>Artistas</h3>
            <p>Conheça os cantores e bandas lendárias de cada movimento musical.</p>
          </div>

          <div className="home-cartao-recurso">
            <div className="home-icone-recurso">💿</div>
            <h3>Álbuns</h3>
            <p>Descubra os álbuns históricos que marcaram épocas e gerações.</p>
          </div>

          <div className="home-cartao-recurso">
            <div className="home-icone-recurso">🎵</div>
            <h3>Músicas</h3>
            <p>Gerencie títulos, datas de lançamento e descrições completas.</p>
          </div>
        </div>

        {/* Equipe do Projeto */}
        <h2 className="home-secao-titulo" style={{ marginTop: '50px' }}>Nossa Equipe</h2>
        <div className="home-equipe-grid">
          {equipe.map((membro, indice) => (
            <div key={indice} className="membro-equipe">
              <img src={membro.foto} alt={membro.nome} className="foto-membro" />
              <span className="nome-membro">{membro.nome}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
