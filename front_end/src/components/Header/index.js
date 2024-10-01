// Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import './style.css'; // Importando estilos

const Header = () => (
  <header>
    <h1>Academic Performance Monitoring</h1>
    <nav>
      <Link to="/">Home</Link>
      <Link to="/tasks">Tasks</Link>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
    </nav>
  </header>
);

export default Header;
