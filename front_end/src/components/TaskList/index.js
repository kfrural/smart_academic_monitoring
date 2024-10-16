// src/components/TaskList.js
import React, { useEffect, useState } from 'react';
import { db } from '../../services/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import './style.css'; // Importando o arquivo de estilo

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "tasks"), (snapshot) => {
      const tasksData = [];
      snapshot.forEach((doc) => {
        const data = { ...doc.data(), id: doc.id };
        console.log(data); // Debugging: verificar dados recebidos
        tasksData.push(data);
      });
      setTasks(tasksData);
    });

    return () => unsubscribe(); // Limpa o listener quando o componente desmonta
  }, []);

  return (
    <div className="task-list">
      <h2>Lista de Tarefas</h2>
      <ul>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <li key={task.id}>
              <strong>{task.name}</strong> - {task.studyHours} horas - 
              {task.examDate ? new Date(task.examDate.seconds * 1000).toLocaleDateString() : 'Data não disponível'}
            </li>
          ))
        ) : (
          <li>Nenhuma tarefa encontrada.</li>
        )}
      </ul>
    </div>
  );
};

export default TaskList;
