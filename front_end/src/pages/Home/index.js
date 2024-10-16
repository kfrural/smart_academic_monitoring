import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';

const HomePage = () => {
  return (
    <div className="container">
      <h1>Bem-vindo ao Sistema de Disciplinas</h1>
      <p>Este é um sistema para cadastro e visualização de disciplinas.</p>
      <Link to="/login">
        <button>Login</button>
      </Link>
      <Link to="/register">
        <button>Registrar</button>
      </Link>
    </div>
  );
};

export default HomePage;
