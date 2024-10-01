// src/components/Calendar.js
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Importa estilos padrão
import './styles.css'; // Importando estilos

function StudyCalendar({ tasks }) {
  const [value, setValue] = useState(new Date());

  return (
    <div className="study-calendar">
      <h2>Calendário de Estudos</h2>
      <Calendar onChange={setValue} value={value} />
      
      {/* Exibe as tarefas na data selecionada */}
      <div className="tasks">
        <h3>Tarefas para {value.toLocaleDateString()}:</h3>
        {tasks.filter(task => new Date(task.examDate).toLocaleDateString() === value.toLocaleDateString()).map(task => (
          <div key={task.id} className="task">
            <p>Matéria: {task.subject}, Nota Obtida: {task.scoreAchieved}</p>
            {/* Adicione mais informações conforme necessário */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudyCalendar;
