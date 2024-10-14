import React, { useEffect, useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Dashboard.css';

Chart.register(...registerables);

interface Grade {
  examName: string;
  score: number;
  maxScore: number;
}

interface EstudoData {
  nome: string;
  grades?: Grade[];
}

const Dashboard: React.FC = () => {
  const [dados, setDados] = useState<EstudoData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const estudoSnapshot = await getDocs(collection(db, "disciplinas"));
      const estudoList = estudoSnapshot.docs.map(doc => doc.data()) as EstudoData[];
      setDados(estudoList);
    };
    fetchData();
  }, []);

  const labels = dados.map(item => item.nome);

  const notas = dados.map(item => {
    const grades = item.grades || [];
    const somaDasNotas = grades.reduce((acc, grade) => acc + grade.score, 0);
    return somaDasNotas;
  });

  const data = {
    labels: labels.length ? labels : ['Carregando...'],
    datasets: [{
      label: 'Notas por Disciplina',
      data: notas.length ? notas : [0, 0, 0],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF9F40', '#4BC0C0', '#9966FF'],
    }]
  };

  return (
    <>
      <Header />
      <div className="dashboard-container">
        <h1>Painel de Desempenho</h1>
        <Bar data={data} />

        <h2>Notas por Disciplina</h2>
        <table>
          <thead>
            <tr>
              <th>Disciplina</th>
              <th>Soma das Notas</th>
            </tr>
          </thead>
          <tbody>
            {dados.map((item, index) => {
              const grades = item.grades || [];
              const somaDasNotas = grades.reduce((acc, grade) => acc + grade.score, 0);
              return (
                <tr key={index}>
                  <td>{item.nome}</td>
                  <td>
                    {grades.length > 0 ? somaDasNotas : 'Sem notas disponíveis'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
