import React, { useEffect, useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Dashboard.css';

// Registre todos os componentes do Chart.js, incluindo escalas
Chart.register(...registerables);

interface EstudoData {
  disciplina: string;
  horasEstudadas: number;
  notas: number[]; // Adicionando um campo para notas
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
    <>
      <Header />
      <div className="dashboard-container">
        <h1>Painel de Desempenho</h1>
        <Bar data={data} />
        
        {/* Exibindo as notas das disciplinas */}
        <h2>Notas por Disciplina</h2>
        <table>
          <thead>
            <tr>
              <th>Disciplina</th>
              <th>Notas</th>
            </tr>
          </thead>
          <tbody>
            {dados.map((item, index) => (
              <tr key={index}>
                <td>{item.disciplina}</td>
                <td>{item.notas.join(', ')}</td> {/* Exibindo as notas como uma lista separada por vírgulas */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
