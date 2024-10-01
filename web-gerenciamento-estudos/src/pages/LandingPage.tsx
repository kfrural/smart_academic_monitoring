// src/pages/LandingPage.tsx
import React from "react";
import { Link } from "react-router-dom";
import "../styles/LandingPage.css";

const LandingPage: React.FC = () => {
  return (
    <div className="landing-container">
      <h1>Bem-vindo ao Gerenciador Acadêmico</h1>
      <Link to="/login">Login</Link> | <Link to="/register">Registrar</Link>
    </div>
  );
};

export default LandingPage;
