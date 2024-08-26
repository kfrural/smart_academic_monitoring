import React, { useState } from 'react';
import axios from '../api/axios';

function TaskForm() {
  const [task, setTask] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/tasks', { name: task });
      setTask('');
      // Recarregar a lista de tarefas ou atualizar o estado conforme necessário
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Nova Tarefa:
        <input 
          type="text" 
          value={task} 
          onChange={(e) => setTask(e.target.value)} 
        />
      </label>
      <button type="submit">Adicionar</button>
    </form>
  );
}

export default TaskForm;
