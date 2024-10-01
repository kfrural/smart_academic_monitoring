// src/pages/Calendar.tsx
import React from "react";
import "../styles/Calendar.css";

const Calendar: React.FC = () => {
  return (
    <div className="calendar-container">
      <h1>Calendário Acadêmico</h1>
      <table>
        <thead>
          <tr>
            <th>Dom</th>
            <th>Seg</th>
            <th>Ter</th>
            <th>Qua</th>
            <th>Qui</th>
            <th>Sex</th>
            <th>Sáb</th>
          </tr>
        </thead>
        <tbody>
          {/* Aqui você preencheria o calendário */}
        </tbody>
      </table>
    </div>
  );
};

export default Calendar;
