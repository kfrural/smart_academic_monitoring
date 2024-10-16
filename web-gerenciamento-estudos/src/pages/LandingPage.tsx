import React from "react";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import "../styles/LandingPage.css";

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">

      <main className="page-content">
        <section className="hero-section">
          <h1>Bem-vindo ao Gerenciador Acadêmico</h1>
          <p>O melhor gerenciador acadêmico para estudantes e educadores brasileiros.</p>
          <div className="cta-buttons">
            <Link to="/login" className="cta-button">Login</Link>
            <Link to="/register" className="cta-button">Registrar</Link>
          </div>
        </section>

        <section className="benefits-section">
          <h2>Vantagens do Gerenciador Acadêmico</h2>
          <div className="benefit-grid">
            <div className="benefit-item">
              <span className="icon"><i className="fas fa-calendar-alt"></i></span>
              <h3>Agendamento automático</h3>
              <p>O Gerenciador Acadêmico automatiza o agendamento de tarefas e reuniões, economizando tempo e reduzindo a confusão.</p>
            </div>
            <div className="benefit-item">
              <span className="icon"><i className="fas fa-book-open"></i></span>
              <h3>Análise de progresso</h3>
              <p>Monitorize seu progresso acadêmico e defina metas realistas com ferramentas personalizáveis.</p>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
