import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc, updateDoc, doc, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../services/firebaseConfig";
import { auth } from "../services/firebaseConfig"; // Firebase Auth para obter o usuário logado
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Disciplinas.css";

const Disciplinas: React.FC = () => {
  const [disciplinas, setDisciplinas] = useState<any[]>([]);
  const [newDisciplina, setNewDisciplina] = useState("");
  const [userId, setUserId] = useState<string | null>(null); // Para armazenar o ID do usuário logado
  const navigate = useNavigate();

  useEffect(() => {
    // Obtendo o usuário atual do Firebase Authentication
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserId(currentUser.uid);
      fetchDisciplinas(currentUser.uid); // Buscando disciplinas relacionadas ao usuário
    }
  }, []);

  // Função para buscar disciplinas do usuário logado
  const fetchDisciplinas = async (uid: string) => {
    const disciplinasQuery = query(collection(db, "disciplinas"), where("userId", "==", uid));
    const disciplinasSnapshot = await getDocs(disciplinasQuery);
    const disciplinasList = disciplinasSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setDisciplinas(disciplinasList);
  };

  const handleAddDisciplina = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newDisciplina && userId) {
      await addDoc(collection(db, "disciplinas"), {
        nome: newDisciplina,
        userId: userId // Associando a disciplina ao ID do usuário logado
      });
      setNewDisciplina("");
      fetchDisciplinas(userId); // Atualizando a lista de disciplinas
    }
  };

  const handleEditDisciplina = async (id: string) => {
    const newName = prompt("Digite o novo nome da disciplina:");
    if (newName) {
      const disciplinaRef = doc(db, "disciplinas", id);
      await updateDoc(disciplinaRef, { nome: newName });
      if (userId) fetchDisciplinas(userId); // Atualizando as disciplinas
    }
  };

  const handleSelectDisciplina = (disciplinaId: string) => {
    navigate(`/disciplina/${disciplinaId}`);
  };

  return (
    <div>
      <Header />
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
          {disciplinas.map((disciplina) => (
            <div key={disciplina.id} className="disciplina-card" onClick={() => handleSelectDisciplina(disciplina.id)}>
              <h3>{disciplina.nome}</h3>
              <div className="disciplina-actions">
                <button onClick={() => handleEditDisciplina(disciplina.id)} className="edit-button">Editar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Disciplinas;
