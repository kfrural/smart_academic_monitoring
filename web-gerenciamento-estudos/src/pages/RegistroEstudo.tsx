import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import "../styles/RegistroEstudo.css";

const RegistroEstudo: React.FC = () => {
  const [materiaId, setMateriaId] = useState("");
  const [horas, setHoras] = useState(0);
  const [tipo, setTipo] = useState("Video aula");
  const [materias, setMaterias] = useState<any[]>([]);

  useEffect(() => {
    const fetchMaterias = async () => {
      const materiasSnapshot = await getDocs(collection(db, "materias"));
      const materiasList = materiasSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMaterias(materiasList);
    };
    fetchMaterias();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "estudo"), {
        materiaId,
        horas,
        tipo,
        dataEstudo: new Date().toISOString().slice(0, 10),
      });
      alert("Estudo registrado com sucesso!");
      setHoras(0);
      setTipo("Video aula");
    } catch (error) {
      console.error("Erro ao registrar estudo: ", error);
    }
  };

  return (
    <div className="registro-estudo-container">
      <h1>Registrar Horas de Estudo</h1>
      <form onSubmit={handleSubmit}>
        <select value={materiaId} onChange={(e) => setMateriaId(e.target.value)}>
          <option value="">Selecione uma Matéria</option>
          {materias.map((materia) => (
            <option key={materia.id} value={materia.id}>
              {materia.nome}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={horas}
          onChange={(e) => setHoras(Number(e.target.value))}
          placeholder="Horas estudadas"
          required
        />
        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="Video aula">Video aula</option>
          <option value="Exercícios">Exercícios</option>
          <option value="Teoria">Teoria</option>
        </select>
        <button type="submit">Registrar Estudo</button>
      </form>
    </div>
  );
};

export default RegistroEstudo;
