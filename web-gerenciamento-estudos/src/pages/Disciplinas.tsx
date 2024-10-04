import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Disciplinas.css";

const Disciplinas: React.FC = () => {
  const [disciplinas, setDisciplinas] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [newDisciplina, setNewDisciplina] = useState("");
  const [selectedDisciplina, setSelectedDisciplina] = useState<any>(null); // Para armazenar a disciplina selecionada

  useEffect(() => {
    const fetchDisciplinas = async () => {
      const disciplinasSnapshot = await getDocs(collection(db, "disciplinas"));
      const disciplinasList = disciplinasSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setDisciplinas(disciplinasList);
    };

    const fetchEvents = async () => {
      const eventsSnapshot = await getDocs(collection(db, "eventos"));
      const eventsList = eventsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setEvents(eventsList);
    };

    fetchDisciplinas();
    fetchEvents();
  }, []);

  const handleAddDisciplina = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newDisciplina) {
      await addDoc(collection(db, "disciplinas"), { nome: newDisciplina });
      setNewDisciplina("");
      const disciplinasSnapshot = await getDocs(collection(db, "disciplinas"));
      const disciplinasList = disciplinasSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setDisciplinas(disciplinasList);
    }
  };

  const handleEditDisciplina = async (id: string) => {
    const newName = prompt("Digite o novo nome da disciplina:");
    if (newName) {
      const disciplinaRef = doc(db, "disciplinas", id);
      await updateDoc(disciplinaRef, { nome: newName });
      const disciplinasSnapshot = await getDocs(collection(db, "disciplinas"));
      const disciplinasList = disciplinasSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setDisciplinas(disciplinasList);
    }
  };

  const handleSelectDisciplina = (disciplina: any) => {
    setSelectedDisciplina(disciplina);
  };

  // Filtra os eventos pela disciplina selecionada
  const filteredEvents = events.filter((event) => event.discipline === selectedDisciplina?.nome);

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
            <div key={disciplina.id} className="disciplina-card" onClick={() => handleSelectDisciplina(disciplina)}>
              <h3>{disciplina.nome}</h3>
              <div className="disciplina-actions">
                <button onClick={() => handleEditDisciplina(disciplina.id)} className="edit-button">Editar</button>
                <a href={`/dashboard/${disciplina.id}`} className="dashboard-link">Dashboard</a>
              </div>
            </div>
          ))}
        </div>

        {/* Mostrar os eventos relacionados à disciplina selecionada */}
        {selectedDisciplina && (
          <div className="eventos-relacionados">
            <h2>Eventos relacionados à {selectedDisciplina.nome}</h2>
            {filteredEvents.length > 0 ? (
              <ul>
                {filteredEvents.map((event) => (
                  <li key={event.id}>
                    <strong>{event.event}</strong> - {event.type} ({event.discipline}) - {event.day} / {event.month}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nenhum evento encontrado para esta disciplina.</p>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Disciplinas;
