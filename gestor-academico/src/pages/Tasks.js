import React from 'react';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';

function Tasks() {
  return (
    <div>
      <h1>Gerenciamento de Tarefas</h1>
      <TaskForm />
      <TaskList />
    </div>
  );
}

export default Tasks;
