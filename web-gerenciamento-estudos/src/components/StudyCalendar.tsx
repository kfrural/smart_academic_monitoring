import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

type Value = Date | [Date, Date] | null;

const StudyCalendar = () => {
  const [value, setValue] = useState<Value>(null);

  // Hook para lidar com cliques na data
  useEffect(() => {
    const calendarElement = document.querySelector('.react-calendar');
    if (calendarElement) {
      calendarElement.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;

        // Verifique se o elemento clicado é uma data
        if (target.classList.contains('react-calendar__month-view__days__day')) {
          const dateString = target.getAttribute('aria-label'); // Pega a data
          if (dateString) {
            const selectedDate = new Date(dateString);
            setValue(selectedDate); // Atualiza o valor
          }
        }
      });
    }

    // Cleanup do evento ao desmontar
    return () => {
      if (calendarElement) {
        calendarElement.removeEventListener('click', () => {});
      }
    };
  }, []);

  // Função para formatar a data selecionada
  const formatDate = (value: Value) => {
    if (Array.isArray(value)) {
      return `${value[0].toISOString().split('T')[0]} a ${value[1].toISOString().split('T')[0]}`;
    } else if (value instanceof Date) {
      return value.toISOString().split('T')[0];
    }
    return 'Nenhuma data selecionada';
  };

  return (
    <div>
      <h3>Calendário de Estudo</h3>
      <Calendar value={value} />
      <p>Data selecionada: {formatDate(value)}</p>
    </div>
  );
};

export default StudyCalendar;
