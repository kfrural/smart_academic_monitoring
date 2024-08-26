import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

function TaskList() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await axios.get('/tasks');
        setTasks(response.data);
      } catch (error) {
        console.error('Erro ao buscar tarefas:', error);
      }
    }

    fetchTasks();
  }, []);

  return (
    <div>
      <h2>Lista de Tarefas</h2>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>{task.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
