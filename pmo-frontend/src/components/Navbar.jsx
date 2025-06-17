// src/components/Navbar.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Importamos o nosso hook de autenticação

function Navbar() {
  // Usamos o contexto para saber se há um usuário logado e para aceder à função de logout
  const { authToken, logout } = useAuth();

  return (
    // Usando classes do Bootstrap para uma estilização rápida e bonita
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Meus PMOs
        </Link>

        <div className="d-flex">
          {authToken ? (
            // Se o usuário estiver logado, mostra o botão de Logout
            <button onClick={logout} className="btn btn-outline-secondary">
              Logout
            </button>
          ) : (
            // Se não estiver logado, mostra o botão de Login
            <Link to="/login" className="btn btn-outline-primary">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;