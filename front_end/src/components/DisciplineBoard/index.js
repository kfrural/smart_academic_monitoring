import React, { useContext } from 'react';
import { DisciplineContext } from '../../context/DisciplineContext'; // Verifique se o caminho está correto

const DisciplineBoard = () => {
  const { disciplines } = useContext(DisciplineContext);

  return (
    <div>
      <h2>Suas Disciplinas</h2>
      <ul>
        {disciplines.length > 0 ? (
          disciplines.map((discipline) => (
            <li key={discipline.id}>{discipline.name}</li>
          ))
        ) : (
          <p>Nenhuma disciplina cadastrada.</p>
        )}
      </ul>
    </div>
  );
};

export default DisciplineBoard;
