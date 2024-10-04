import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import "../styles/Calendar.css";
import Header from "../components/Header"; // Importando o Header
import Footer from "../components/Footer"; // Importando o Footer

interface Event {
  id?: string;
  day: number;
  month: number;
  year: number;
  event: string;
  type: string;
  discipline: string;
}

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [disciplines, setDisciplines] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
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
      }));
      setDisciplines(disciplinesList);
    };
    fetchDisciplines();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      const eventsSnapshot = await getDocs(collection(db, "eventos"));
      const eventsList = eventsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEvents(eventsList as Event[]);
    };
    fetchEvents();
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

      const eventsForDay = events.filter(
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
              {eventsForDay.map((event) => (
                <div key={event.id} className={`event ${event.type}`}>
                  {event.event} - {event.type} ({event.discipline})
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
    setSelectedMonth(currentDate.getMonth());
    setSelectedYear(currentDate.getFullYear());

    const dayEvents = events.filter(
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
    if (eventName && selectedDiscipline) {
      const newEvent: Event = {
        day: selectedDay!,
        month: selectedMonth!,
        year: selectedYear!,
        event: eventName,
        type: selectedType,
        discipline: selectedDiscipline,
      };

      try {
        await addDoc(collection(db, "eventos"), newEvent);
        setEvents([...events, newEvent]);
        handleCloseModal();
      } catch (error) {
        console.error("Erro ao salvar o evento: ", error);
      }
    } else {
      alert("Por favor, preencha todos os campos.");
    }
  };

  const handleEditEvent = async (event: Event) => {
    const updatedEvent = { ...event, event: eventName, type: selectedType, discipline: selectedDiscipline };
    try {
      const eventDoc = doc(db, "eventos", event.id!);
      await updateDoc(eventDoc, updatedEvent);
      setEvents(events.map((e) => (e.id === event.id ? updatedEvent : e)));
      handleCloseModal();
    } catch (error) {
      console.error("Erro ao editar o evento: ", error);
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

      {/* Modal para adicionar/editar eventos */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Eventos para o dia {selectedDay}</h3>
            <div className="event-list">
              {eventsForSelectedDay.length > 0 ? (
                eventsForSelectedDay.map((event) => (
                  <div key={event.id} className={`event ${event.type}`}>
                    {event.event} - {event.type} ({event.discipline})
                  </div>
                ))
              ) : (
                <p>Nenhum evento para este dia.</p>
              )}
            </div>
            <h4>Cadastrar Novo Evento</h4>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleSaveEvent();
            }}>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Nome do Evento"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <select
                  value={selectedDiscipline}
                  onChange={(e) => setSelectedDiscipline(e.target.value)}
                  required
                >
                  <option value="">Selecione uma disciplina</option>
                  {disciplines.map((discipline) => (
                    <option key={discipline.id} value={discipline.name || discipline.nome}>
                      {discipline.name || discipline.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  required
                >
                  <option value="prova">Prova</option>
                  <option value="trabalho">Trabalho</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
              <div className="button-group">
                <button type="submit" className="save-button">Salvar Evento</button>
                <button onClick={handleCloseModal} className="close-button">Fechar</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
    <Footer />
  </>
  );
};

export default Calendar;
