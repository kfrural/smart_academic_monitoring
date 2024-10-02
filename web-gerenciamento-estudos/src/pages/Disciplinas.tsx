// Disciplinas.tsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import Header from '../components/Header'; // Importe o Header
import Footer from '../components/Footer'; // Importe o Footer
import '../styles/Disciplinas.css'; // CSS para estilos

const Disciplinas: React.FC = () => {
  const [disciplinas, setDisciplinas] = useState<any[]>([]);
  const [newDisciplina, setNewDisciplina] = useState('');

  useEffect(() => {
    const fetchDisciplinas = async () => {
      const disciplinasSnapshot = await getDocs(collection(db, "disciplinas"));
      const disciplinasList = disciplinasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDisciplinas(disciplinasList);
    };
    fetchDisciplinas();
  }, []);

  const handleAddDisciplina = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newDisciplina) {
      await addDoc(collection(db, "disciplinas"), { nome: newDisciplina });
      setNewDisciplina('');
      const disciplinasSnapshot = await getDocs(collection(db, "disciplinas"));
      const disciplinasList = disciplinasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDisciplinas(disciplinasList);
    }
  };

  const handleEditDisciplina = async (id: string) => {
    const newName = prompt("Digite o novo nome da disciplina:");
    if (newName) {
      const disciplinaRef = doc(db, "disciplinas", id);
      await updateDoc(disciplinaRef, { nome: newName });
      const disciplinasSnapshot = await getDocs(collection(db, "disciplinas"));
      const disciplinasList = disciplinasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDisciplinas(disciplinasList);
    }
  };

  return (
    <div>
      <Header /> {/* Inclua o Header */}

      <div className="disciplinas-container">
        <h1>Disciplinas</h1>
        <form onSubmit={handleAddDisciplina} className="add-disciplina-form">
          <input
            type="text"
            value={newDisciplina}
            onChange={(e) => setNewDisciplina(e.target.value)}
            placeholder="Nova Disciplina"
            required
            className="input-disciplina"
          />
          <button type="submit" className="add-button">Adicionar</button>
        </form>
        <div className="disciplinas-list">
          {disciplinas.map(disciplina => (
            <div key={disciplina.id} className="disciplina-card">
              <h3>{disciplina.nome}</h3>
              <div className="disciplina-actions">
                <button onClick={() => handleEditDisciplina(disciplina.id)} className="edit-button">Editar</button>
                <a href={`/dashboard/${disciplina.id}`} className="dashboard-link">Dashboard</a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer /> {/* Inclua o Footer */}
    </div>
  );
};

export default Disciplinas;
