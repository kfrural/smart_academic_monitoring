// src/pages/Login.tsx
import React, { useState } from "react";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.login(email, password);
      navigate("/disciplinas");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
