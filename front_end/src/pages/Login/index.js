import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './style.css'; // Importando estilos

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  if (!authContext) {
    console.error("AuthContext não está disponível.");
    return <div>Erro: Contexto de autenticação não encontrado.</div>;
  }

  const { login } = authContext;

  const handleLogin = () => {
    if (email && password) {
      login({ email, password });
      navigate('/main');
    } else {
      alert('Por favor, insira um email e senha válidos.');
    }
  };

  return (
    <div className="container">
      <h1>Login</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Entrar</button>
    </div>
  );
};

export default LoginPage;
