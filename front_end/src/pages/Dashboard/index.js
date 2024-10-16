// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import { db } from '../../services/firebase';
import ChartComponent from '../../components/ChartComponents';
import './style.css'; // Importando o arquivo de estilo

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [totalHours, setTotalHours] = useState(0);
  const [averageHours, setAverageHours] = useState(0);

  const fetchTasks = async () => {
    const tasksSnapshot = await db.collection('tasks').get();
    const tasksData = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setTasks(tasksData);

    const total = tasksData.reduce((acc, task) => acc + task.studyHours, 0);
    setTotalHours(total);
    setAverageHours(tasksData.length > 0 ? total / tasksData.length : 0);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="stats">
        <p>Total de Horas Estudadas: <strong>{totalHours}</strong></p>
        <p>Média de Horas por Prova: <strong>{averageHours.toFixed(2)}</strong></p>
      </div>
      <ChartComponent tasks={tasks} />
    </div>
  );
};

export default Dashboard;
