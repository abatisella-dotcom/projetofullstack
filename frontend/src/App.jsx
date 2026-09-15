import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Cabecalho from './componentes/Cabecalho';
import Rodape from './componentes/Rodape';
import RotaProtegida from './componentes/RotaProtegida';

import Inicio from './paginas/Inicio';
import Login from './paginas/Login';
import Cadastro from './paginas/Cadastro';
import Dashboard from './paginas/Dashboard';
import MusicasLista from './paginas/MusicaLista';
import MusicaDetalhes from './paginas/MusicaDetalhes';
import NovaMusica from './paginas/NovaMusica';
import EditarMusica from './paginas/EditarMusica';

export default function App() {
  return (
    <BrowserRouter>
      <Cabecalho />
      <main className="conteudo-principal">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          
          <Route path="/musicas" element={<MusicasLista />} />
          <Route path="/musicas/:id" element={<MusicaDetalhes />} />

          {/* Rotas que exigem login */}
          <Route 
            path="/dashboard" 
            element={
              <RotaProtegida>
                <Dashboard />
              </RotaProtegida>
            } 
          />
          <Route 
            path="/musicas/nova" 
            element={
              <RotaProtegida>
                <NovaMusica />
              </RotaProtegida>
            } 
          />
          <Route 
            path="/musicas/:id/editar" 
            element={
              <RotaProtegida>
                <EditarMusica />
              </RotaProtegida>
            } 
          />
        </Routes>
      </main>
      <Rodape />
    </BrowserRouter>
  );
}
