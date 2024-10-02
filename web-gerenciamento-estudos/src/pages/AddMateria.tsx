import React, { useState } from 'react';
import { db } from '../services/firebaseConfig'; // Supondo que o Firebase esteja configurado
import { collection, addDoc } from "firebase/firestore"; 
import "../styles/AddMateria.css";

const AddMateria: React.FC = () => {
  const [nome, setNome] = useState("");
  const [professor, setProfessor] = useState("");
  const [cargaHoraria, setCargaHoraria] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "materias"), {
        nome,
        professor,
        cargaHoraria,
      });
      alert("Matéria cadastrada com sucesso!");
      setNome("");
      setProfessor("");
      setCargaHoraria(0);
    } catch (error) {
      console.error("Erro ao cadastrar matéria: ", error);
    }
  };

  return (
    <div className="add-materia-container">
      <h1>Adicionar Nova Matéria</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome da Matéria"
          required
        />
        <input
          type="text"
          value={professor}
          onChange={(e) => setProfessor(e.target.value)}
          placeholder="Professor"
          required
        />
        <input
          type="number"
          value={cargaHoraria}
          onChange={(e) => setCargaHoraria(Number(e.target.value))}
          placeholder="Carga Horária"
          required
        />
        <button type="submit">Cadastrar Matéria</button>
      </form>
    </div>
  );
};

export default AddMateria;
