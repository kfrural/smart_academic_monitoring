// src/components/ChartComponent.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import './style.css'; // Importando estilos

const ChartComponent = ({ tasks }) => {
  const data = {
    labels: tasks.map(task => task.name),
    datasets: [
      {
        label: 'Horas Estudadas',
        data: tasks.map(task => task.studyHours),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="chart-container">
      <h3>Gráfico de Horas Estudadas por Prova</h3>
      <Bar data={data} />
    </div>
  );
};

export default ChartComponent;
