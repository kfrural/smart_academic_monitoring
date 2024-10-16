// src/pages/StudyAnalysis.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import './style.css'; // Importando o arquivo de estilo

const StudyAnalysis = ({ tasks }) => {
  // Preparando os dados para o gráfico
  const data = {
    labels: tasks.map(task => task.name),
    datasets: [
      {
        label: 'Desempenho Acadêmico',
        data: tasks.map(task => task.scoreAchieved), // Supondo que você tenha esse campo
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="study-analysis">
      <h1>Análise de Estudo</h1>
      <p>Aqui você pode visualizar como suas horas de estudo impactam seu desempenho acadêmico.</p>
      <Bar data={data} options={{ responsive: true, maintainAspectRatio: false }} />
    </div>
  );
};

export default StudyAnalysis;
