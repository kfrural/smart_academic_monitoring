// Header.tsx
import React from 'react';
import { Link } from 'react-router-dom'; // Usando Link para navegação entre páginas

const Header: React.FC = () => {
  return (
    <header className="header">
      <nav className="nav">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/disciplinas">Disciplinas</Link></li>
          <li><Link to="/calendar">Calendário</Link></li>
          <li><Link to="/Dashboard">Dashboard</Link></li>
          <li><Link to="/profile">Perfil</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
