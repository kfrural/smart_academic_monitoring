import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="header">
      <div className="hamburger" onClick={toggleMenu}>
        <div className={isOpen ? "line line1 open" : "line line1"}></div>
        <div className={isOpen ? "line line2 open" : "line line2"}></div>
        <div className={isOpen ? "line line3 open" : "line line3"}></div>
      </div>
      <nav className={`nav ${isOpen ? "open" : ""}`}>
        <ul>
          <li><Link to="/home">Home</Link></li>
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
