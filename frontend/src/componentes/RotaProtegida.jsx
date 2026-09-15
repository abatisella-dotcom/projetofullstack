import React from 'react';
import { Navigate } from 'react-router-dom';
import { obterToken } from '../servicos/api';

// Protege rotas para permitir acesso apenas com usuario autenticado
export default function RotaProtegida({ children }) {
  const token = obterToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
