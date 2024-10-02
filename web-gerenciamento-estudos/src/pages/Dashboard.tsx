import React, { useEffect, useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

// Registre todos os componentes do Chart.js, incluindo escalas
Chart.register(...registerables);

interface EstudoData {
  disciplina: string;
  horasEstudadas: number;
}

const Dashboard: React.FC = () => {
  const [dados, setDados] = useState<EstudoData[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      const estudoSnapshot = await getDocs(collection(db, "estudo"));
      const estudoList = estudoSnapshot.docs.map(doc => doc.data()) as EstudoData[];
      setDados(estudoList);
    };
    fetchData();
  }, []);

  const labels = dados.map(item => item.disciplina); // Extraindo as disciplinas dos dados
  const horasEstudadas = dados.map(item => item.horasEstudadas); // Extraindo as horas estudadas

  const data = {
    labels: labels.length ? labels : ['Carregando...'], // Adicionando uma mensagem enquanto os dados são carregados
    datasets: [{
      label: 'Horas Estudadas',
      data: horasEstudadas.length ? horasEstudadas : [0, 0, 0], // Usando 0 caso não haja dados
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
    }]
  };

  return (
    <div className="dashboard-container">
      <h1>Painel de Desempenho</h1>
      <Bar data={data} />
    </div>
  );
};

export default Dashboard;
