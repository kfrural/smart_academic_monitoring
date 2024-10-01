// src/components/TaskForm.js
import React, { useState } from 'react';
import { db } from '../../services/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import './style.css'; // Importando o arquivo de estilo

const TaskForm = ({ disciplines, refreshTasks }) => {
  const [taskType, setTaskType] = useState('exam'); // Estado para tipo de tarefa
  const [selectedDiscipline, setSelectedDiscipline] = useState(''); // Disciplina selecionada
  const [subject, setSubject] = useState(''); // Para provas
  const [examDate, setExamDate] = useState(''); // Para provas
  const [studyHours, setStudyHours] = useState(0); // Para horas de estudo
  const [studyMethod, setStudyMethod] = useState(''); // Para horas de estudo
  const [grade, setGrade] = useState(''); // Nota da prova

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      createdAt: Timestamp.now(),
      discipline: selectedDiscipline, // Armazena a disciplina selecionada
    };

    if (taskType === 'exam') {
      data.subject = subject;
      data.examDate = Timestamp.fromDate(new Date(examDate));
      data.grade = grade || null; // Armazena a nota se disponível
    } else {
      data.studyHours = studyHours;
      data.studyMethod = studyMethod;
    }

    try {
      await addDoc(collection(db, 'tasks'), data);
      resetForm();
      refreshTasks();
    } catch (error) {
      console.error("Erro ao adicionar tarefa: ", error);
    }
  };

  const resetForm = () => {
    setTaskType('exam');
    setSelectedDiscipline('');
    setSubject('');
    setExamDate('');
    setStudyHours(0);
    setStudyMethod('');
    setGrade('');
  };

  return (
    <div>
      <h2>Adicionar Tarefa</h2>
      <div>
        <label>
          <input
            type="radio"
            value="exam"
            checked={taskType === 'exam'}
            onChange={() => setTaskType('exam')}
          />
          Prova
        </label>
        <label>
          <input
            type="radio"
            value="study"
            checked={taskType === 'study'}
            onChange={() => setTaskType('study')}
          />
          Horas de Estudo
        </label>
      </div>

      <form onSubmit={handleSubmit}>
        <select
          value={selectedDiscipline}
          onChange={(e) => setSelectedDiscipline(e.target.value)}
          required
        >
          <option value="">Selecione uma Disciplina</option>
          {disciplines.map((discipline) => (
            <option key={discipline.id} value={discipline.id}>
              {discipline.name}
            </option>
          ))}
        </select>

        {taskType === 'exam' ? (
          <>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Matéria"
              required
            />
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              required
            />
            <input
              type="number"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              placeholder="Nota (opcional)"
            />
          </>
        ) : (
          <>
            <input
              type="number"
              value={studyHours}
              onChange={(e) => setStudyHours(Number(e.target.value))}
              placeholder="Horas Estudadas"
              required
            />
            <select
              value={studyMethod}
              onChange={(e) => setStudyMethod(e.target.value)}
              required
            >
              <option value="">Método de Estudo</option>
              <option value="resolucao_de_exercicios">Resolução de Exercícios</option>
              <option value="videoaula">Videoaula</option>
              <option value="teoria">Teoria</option>
              <option value="estudo_em_grupo">Estudo em Grupo</option>
            </select>
          </>
        )}
        <button type="submit">Adicionar</button>
      </form>
    </div>
  );
};

export default TaskForm;
