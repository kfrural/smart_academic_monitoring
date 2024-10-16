// src/pages/Register.js
import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import {db} from '../../services/firebase';
import './style.css'; // Importando o arquivo de estilo

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth(db);
      await createUserWithEmailAndPassword(auth, email, password);
      alert('Registro realizado com sucesso!');
      setEmail('');
      setPassword('');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="register">
      <h2>Registrar</h2>
      <form onSubmit={handleRegister} className="register-form">
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
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default Register;
