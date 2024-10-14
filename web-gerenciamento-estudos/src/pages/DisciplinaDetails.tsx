import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import Header from "../components/Header";
import Footer from "../components/Footer";
import useDisciplineDetails from "../hooks/useDisciplineDetails";
import "../styles/DisciplinaDetails.css";
import { Grade } from "../models/Grade";

const DisciplineDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    discipline,
    loading,
    error,
    handleAddGrade,
    handleAddSchedule,
    handleAddExam,
    calculateWeightedAverage,
    calculatePassingRate,
  } = useDisciplineDetails(id);

  const [newGrade, setNewGrade] = useState<Grade>({ score: 0, maxScore: 0, examName: "" });
  const [newSchedule, setNewSchedule] = useState<{ day: string; time: string }>({ day: "", time: "" });
  const [newExam, setNewExam] = useState<{ name: string; type: string; date: string }>({ name: "", type: "Prova", date: "" });

  const totalScore = discipline?.grades?.reduce((acc, grade) => acc + grade.maxScore, 0) || 1;
  const totalObtained = discipline?.grades?.reduce((acc, grade) => acc + grade.score, 0) || 0;

  const pieData = {
    labels: ["Nota Obtida", "Nota Faltante"],
    datasets: [
      {
        data: [totalObtained, totalScore - totalObtained],
        backgroundColor: ["rgba(75,192,192,0.6)", "rgba(255,99,132,0.3)"],
        borderColor: ["rgba(75,192,192,1)", "rgba(255,99,132,1)"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  const availableTimes = ["Primeiro (7:00 - 8:40)", "Segundo (9:10 - 11:00)", "Terceiro (13:00 - 14:40)", "Quarto (15:10 - 17:00)", "Quinto (18:30 - 20:10)", "Sexto (20:40 - 22:00)"];

  return (
    <div className="discipline-details">
      <Header />
      <div className="content-wrapper">
        {loading && <p>Carregando disciplina...</p>}
        {error && <p>{error}</p>}
        {discipline && (
          <>
            <div className="details">
              <h1>Disciplina: {discipline.nome}</h1>

              <h2>Horários de Aula</h2>
              <ul>
                {discipline.schedules?.map((schedule, index) => (
                  <li key={index}>
                    {schedule.day} - {schedule.time}
                  </li>
                ))}
              </ul>
              <h3>Adicionar Horário</h3>
              <select
                value={newSchedule.day}
                onChange={(e) => setNewSchedule({ ...newSchedule, day: e.target.value })}
              >
                <option value="">Selecione um dia</option>
                {["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"].map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
              <select
                value={newSchedule.time}
                onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
              >
                <option value="">Selecione um horário</option>
                {availableTimes.map((time, index) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
              <button onClick={() => handleAddSchedule(newSchedule)}>Adicionar Horário</button>

              <h2>Datas de Provas e Trabalhos</h2>
              <ul>
                {discipline.exams?.map((exam, index) => (
                  <li key={index}>
                    {exam.name} ({exam.type}) - {exam.date}
                  </li>
                ))}
              </ul>
              <h3>Adicionar Prova</h3>
              <input
                type="text"
                placeholder="Nome da Prova"
                value={newExam.name}
                onChange={(e) => setNewExam({ ...newExam, name: e.target.value })}
              />
              <select
                value={newExam.type}
                onChange={(e) => setNewExam({ ...newExam, type: e.target.value })}
              >
                <option value="Prova">Prova</option>
                <option value="Trabalho">Trabalho</option>
              </select>
              <input
                type="date"
                value={newExam.date}
                onChange={(e) => setNewExam({ ...newExam, date: e.target.value })}
              />
              <button onClick={() => handleAddExam(newExam)}>Adicionar Prova</button>

              <h2>Notas</h2>
              <ul>
                {discipline.grades?.map((grade, index) => (
                  <li key={index}>
                    {grade.examName}: {grade.score}/{grade.maxScore}
                  </li>
                ))}
              </ul>
              <h3>Adicionar Nota</h3>
              <input
                type="text"
                placeholder="Nome da Prova"
                value={newGrade.examName}
                onChange={(e) => setNewGrade({ ...newGrade, examName: e.target.value })}
              />
              <input
                type="number"
                placeholder="Nota"
                value={newGrade.score}
                onChange={(e) => setNewGrade({ ...newGrade, score: Number(e.target.value) })}
              />
              <input
                type="number"
                placeholder="Nota Máxima"
                value={newGrade.maxScore}
                onChange={(e) => setNewGrade({ ...newGrade, maxScore: Number(e.target.value) })}
              />
              <button onClick={() => handleAddGrade(newGrade)}>Adicionar Nota</button>
            </div>

            <div className="chart-container">
              <div className="statistics">
                <h2>Média Ponderada: {calculateWeightedAverage()}%</h2>
                <h2>Taxa de Aprovação: {calculatePassingRate()}%</h2>
              </div>
              <div className="pie-chart">
                <Pie data={pieData} options={options} />
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default DisciplineDetails;
