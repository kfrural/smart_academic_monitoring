import React, { useState } from "react";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.login(email, password);
      navigate("/disciplinas");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      
      if (error instanceof Error && error.message.includes('invalid email')) {
        setError("Email inválido");
      } else if (error instanceof Error && error.message.includes('invalid password')) {
        setError("Senha incorreta");
      } else if (error instanceof Error && error.message.includes('user does not exist')) {
        setError("Usuário não encontrado");
      } else {
        setError("Erro de autenticação");
      }
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
};

export default Login;
