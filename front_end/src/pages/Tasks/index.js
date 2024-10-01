// src/pages/Tasks/index.js
import React, { useEffect, useState } from 'react';
import TaskForm from '../../components/TaskForm';
import TaskList from '../../components/TaskList';
import { db } from '../../services/firebase'; // Importando o db corretamente
import { collection, getDocs, orderBy, query } from 'firebase/firestore'; // Importando as funções necessárias

const Tasks = () => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const tasksCollection = collection(db, 'tasks'); // Usando a nova forma de acessar coleções
    const q = query(tasksCollection, orderBy('createdAt', 'desc')); // Consulta para ordenar os documentos
    const tasksSnapshot = await getDocs(q); // Obtendo os documentos

    // Mapeando os documentos para o estado
    setTasks(tasksSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt ? new Date(doc.data().createdAt.seconds * 1000) : null, // Converter se necessário
    })));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      <h2>Gerenciamento de Provas e Horas Estudadas</h2>
      <TaskForm refreshTasks={fetchTasks} />
      <TaskList tasks={tasks} />
    </div>
  );
};

export default Tasks;
