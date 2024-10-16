import React, { createContext, useState } from 'react';

// Criando o contexto de autenticação
export const AuthContext = createContext();

// Provedor de contexto de autenticação
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = ({ email, password }) => {
    // Aqui você pode adicionar lógica para autenticação, como chamada a API
    // Para fins de demonstração, definimos um usuário fictício
    if (email === 'user@example.com' && password === 'password') {
      setUser({ email });
      alert('Login bem-sucedido!'); // Você pode substituir isso por uma lógica de redirecionamento
    } else {
      alert('Email ou senha incorretos.');
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
