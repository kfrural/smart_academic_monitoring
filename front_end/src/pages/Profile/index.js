// src/pages/Profile.js
import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import './style.css'; // Importando o arquivo de estilo

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Simulação de recuperação de dados do usuário (substituir pela lógica real)
    const fetchUserData = async () => {
      const userSnapshot = await db.collection('users').doc('user_id').get(); // Use o ID real do usuário
      setUser(userSnapshot.data());
    };

    fetchUserData();
  }, []);

  return (
    <div className="profile">
      <h1>Perfil do Usuário</h1>
      {user ? (
        <div className="profile-details">
          <p><strong>Nome:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Horas Estudadas:</strong> {user.totalStudyHours}</p>
          <p><strong>Provas Realizadas:</strong> {user.examsCount}</p>

          <button className="edit-button">Editar Perfil</button>
        </div>
      ) : (
        <p>Carregando informações do usuário...</p>
      )}
    </div>
  );
}

export default Profile;
