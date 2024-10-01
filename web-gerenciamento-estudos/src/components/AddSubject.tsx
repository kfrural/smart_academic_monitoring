// src/components/AddSubject.tsx
import React, { useState } from 'react';
import { db } from '../services/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const AddSubject = () => {
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'subjects'), {
        name,
      });
      setName(''); // Limpa o campo após o cadastro
    } catch (error) {
      console.error('Erro ao adicionar matéria: ', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Nome da Matéria</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <button type="submit">Adicionar Matéria</button>
    </form>
  );
};

export default AddSubject;
