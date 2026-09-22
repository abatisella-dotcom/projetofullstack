import React from 'react';
import { Link } from 'react-router-dom';
import anaBeImg from '../img/anabe.png';
import anaKosoImg from '../img/image.png';
import mariaMansoImg from '../img/image copy.png';
import mariaDiasImg from '../img/dias.png';

export default function Inicio() {
  const equipe = [
    { nome: 'Ana Beatriz', foto: anaBeImg },
    { nome: 'Ana Koso', foto: anaKosoImg },
    { nome: 'Maria Manso', foto: mariaMansoImg },
    { nome: 'Maria Dias', foto: mariaDiasImg }
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

        </div>
      </section>

      {/* Secao de recursos */}
      <section className="home-secao">
        <h2 className="home-secao-titulo">O que você encontra aqui</h2>
        
        <div className="home-recursos-grid">
          <div className="home-cartao-recurso">
            <h3>Artistas</h3>
            <p>Conheça os cantores e bandas lendárias de cada movimento musical.</p>
          </div>

          <div className="home-cartao-recurso">
            <h3>Álbuns</h3>
            <p>Descubra os álbuns históricos que marcaram épocas e gerações.</p>
          </div>

          <div className="home-cartao-recurso">
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
