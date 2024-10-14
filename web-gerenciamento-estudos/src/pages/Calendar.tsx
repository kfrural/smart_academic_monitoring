import React, { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db, auth } from "../services/firebaseConfig"; 
import "../styles/Calendar.css";
import Header from "../components/Header"; 
import Footer from "../components/Footer"; 

interface Event {
  day: number;
  month: number;
  year: number;
  event: string;
  type: string;
}

interface Discipline {
  id: string;
  nome: string;
  eventos?: Event[];
}

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [eventName, setEventName] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState("");
  const [selectedType, setSelectedType] = useState("prova");
  const [eventsForSelectedDay, setEventsForSelectedDay] = useState<Event[]>([]);

  const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const today = new Date();

  const changeMonth = (direction: string) => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else if (direction === "next") {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  useEffect(() => {
    const fetchDisciplines = async () => {
      const disciplinesSnapshot = await getDocs(collection(db, "disciplinas"));
      const disciplinesList = disciplinesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Discipline[];
      setDisciplines(disciplinesList);
    };
    fetchDisciplines();
  }, []);

  const renderCalendarDays = () => {
    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<td key={`empty-${i}`} className="empty"></td>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        day === today.getDate() &&
        currentDate.getMonth() === today.getMonth() &&
        currentDate.getFullYear() === today.getFullYear();

      const eventsForDay = disciplines
        .flatMap((discipline) => discipline.eventos || [])
        .filter(
          (event) =>
            event.day === day &&
            event.month === currentDate.getMonth() &&
            event.year === currentDate.getFullYear()
        );

      days.push(
        <td
          key={day}
          className={isToday ? "today" : ""}
          onClick={() => handleOpenModal(day)}
        >
          {day}
          {eventsForDay.length > 0 && (
            <div className="events">
              {eventsForDay.map((event, index) => (
                <div key={index} className={`event ${event.type}`}>
                  {event.event} - {event.type}
                </div>
              ))}
            </div>
          )}
        </td>
      );
    }

    const totalCells = days.length;
    const remainingCells = 42 - totalCells;
    for (let i = 0; i < remainingCells; i++) {
      days.push(<td key={`post-empty-${i}`} className="empty"></td>);
    }

    const rows = [];
    for (let i = 0; i < days.length; i += 7) {
      rows.push(<tr key={`row-${i}`}>{days.slice(i, i + 7)}</tr>);
    }

    return rows;
  };

  const handleOpenModal = (day: number) => {
    setSelectedDay(day);
    const dayEvents = disciplines
      .flatMap((discipline) => discipline.eventos || [])
      .filter(
        (event) =>
          event.day === day &&
          event.month === currentDate.getMonth() &&
          event.year === currentDate.getFullYear()
      );

    setEventsForSelectedDay(dayEvents);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEventName("");
    setSelectedDiscipline("");
    setSelectedType("prova");
  };

  const handleSaveEvent = async () => {
    const user = auth.currentUser;
    if (eventName && selectedDiscipline && user && selectedDay !== null) {
      const newEvent: Event = {
        day: selectedDay,
        month: currentDate.getMonth(),
        year: currentDate.getFullYear(),
        event: eventName,
        type: selectedType,
      };

      try {
        const updatedDiscipline = disciplines.find(d => d.id === selectedDiscipline);
        const updatedEvents = [...(updatedDiscipline?.eventos || []), newEvent];

        await updateDoc(doc(db, "disciplinas", selectedDiscipline), { eventos: updatedEvents });

        setDisciplines(disciplines.map(d =>
          d.id === selectedDiscipline ? { ...d, eventos: updatedEvents } : d
        ));
        
        handleCloseModal();
      } catch (error) {
        console.error("Erro ao salvar o evento: ", error);
      }
    } else {
      alert("Por favor, preencha todos os campos.");
    }
  };

  return (
    <>
      <Header />
      <main className="calendar-container">
        <div className="calendar-header">
          <button onClick={() => changeMonth("prev")} className="month-nav">
            Anterior
          </button>
          <h2>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button onClick={() => changeMonth("next")} className="month-nav">
            Próximo
          </button>
        </div>

        <table className="calendar-table">
          <thead>
            <tr>
              {daysOfWeek.map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>{renderCalendarDays()}</tbody>
        </table>

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>Eventos para o dia {selectedDay}</h3>
              <div className="event-list">
                {eventsForSelectedDay.length > 0 ? (
                  eventsForSelectedDay.map((event, index) => (
                    <div key={index}>
                      <p>{event.event} - {event.type}</p>
                    </div>
                  ))
                ) : (
                  <p>Nenhum evento encontrado.</p>
                )}
              </div>
              <h3>Adicionar Evento</h3>
              <input
                type="text"
                placeholder="Nome do evento"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
              />
              <select
                value={selectedDiscipline}
                onChange={(e) => setSelectedDiscipline(e.target.value)}
              >
                <option value="">Selecione a disciplina</option>
                {disciplines.map((discipline) => (
                  <option key={discipline.id} value={discipline.id}>
                    {discipline.nome}
                  </option>
                ))}
              </select>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="prova">Prova</option>
                <option value="trabalho">Trabalho</option>
              </select>
              <button onClick={handleSaveEvent}>Salvar Evento</button>
              <button onClick={handleCloseModal}>Fechar</button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default Calendar;
