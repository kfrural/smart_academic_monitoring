import React, { useState, useContext } from 'react';
import { DisciplineContext } from '../../context/DisciplineContext';

const AddDisciplineForm = () => {
  const { addDiscipline } = useContext(DisciplineContext);
  const [disciplineName, setDisciplineName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (disciplineName.trim()) {
      addDiscipline({ id: Date.now(), name: disciplineName });
      setDisciplineName('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={disciplineName}
        onChange={(e) => setDisciplineName(e.target.value)}
        placeholder="Nome da Disciplina"
        required
      />
      <button type="submit">Adicionar Disciplina</button>
    </form>
  );
};

export default AddDisciplineForm;
