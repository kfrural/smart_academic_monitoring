import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Pie } from "react-chartjs-2"; // Importando o componente Pie para gráficos
import "../styles/DisciplinaDetails.css";

interface Grade {
  score: number;
  maxScore: number;
  examName: string;
}

interface Schedule {
  day: string;
  time: string;
}

interface Exam {
  name: string;
  type: string;
  date: string; // Adicionando a propriedade de data
}

interface Discipline {
  id: string;
  nome: string;
  grades?: Grade[];
  schedules?: Schedule[];
  exams?: Exam[];
}

const DisciplineDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [discipline, setDiscipline] = useState<Discipline | null>(null);
  const [newGrade, setNewGrade] = useState<Grade>({ score: 0, maxScore: 0, examName: "" });
  const [newSchedule, setNewSchedule] = useState<{ day: string; time: string }>({ day: "", time: "" });
  const [newExam, setNewExam] = useState<{ name: string; type: string; date: string }>({ name: "", type: "Prova", date: "" });

  useEffect(() => {
    fetchDiscipline();
  }, [id]);

  const fetchDiscipline = async () => {
    if (!id) {
      console.error("ID da disciplina não fornecido");
      return;
    }

    try {
      const docRef = doc(db, "disciplinas", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const disciplineData: Discipline = { id: docSnap.id, ...docSnap.data() } as Discipline;
        setDiscipline(disciplineData);
      } else {
        throw new Error("Documento não encontrado!");
      }
    } catch (error) {
      console.error("Erro ao carregar disciplina:", error);
    }
  };

  const handleAddGrade = async () => {
    if (!discipline || !newGrade.examName) return; // Verifica se o nome da prova está preenchido

    try {
      const docRef = doc(db, "disciplinas", discipline.id);
      await updateDoc(docRef, {
        grades: arrayUnion(newGrade),
      });
      setDiscipline((prev) => ({
        ...prev!,
        grades: [...(prev?.grades || []), newGrade],
      }));
      setNewGrade({ score: 0, maxScore: 0, examName: "" }); // Resetando o formulário
    } catch (error) {
      console.error("Erro ao adicionar nota:", error);
    }
  };

  const handleAddSchedule = async () => {
    if (!discipline) return;

    try {
      const docRef = doc(db, "disciplinas", discipline.id);
      await updateDoc(docRef, {
        schedules: arrayUnion(newSchedule),
      });
      setDiscipline((prev) => ({
        ...prev!,
        schedules: [...(prev?.schedules || []), newSchedule],
      }));
      setNewSchedule({ day: "", time: "" }); // Resetando o formulário
    } catch (error) {
      console.error("Erro ao adicionar horário:", error);
    }
  };

  const handleAddExam = async () => {
    if (!discipline || !newExam.name || !newExam.date) return; // Verifica se o nome da prova e a data estão preenchidos

    try {
      const docRef = doc(db, "disciplinas", discipline.id);
      await updateDoc(docRef, {
        exams: arrayUnion(newExam),
      });
      setDiscipline((prev) => ({
        ...prev!,
        exams: [...(prev?.exams || []), newExam],
      }));
      setNewExam({ name: "", type: "Prova", date: "" }); // Resetando o formulário
    } catch (error) {
      console.error("Erro ao adicionar prova:", error);
    }
  };

  const calculateWeightedAverage = () => {
    if (!discipline?.grades || discipline.grades.length === 0) return 0;

    const totalWeight = discipline.grades.reduce((acc, grade) => acc + grade.maxScore, 0);
    const weightedSum = discipline.grades.reduce((acc, grade) => acc + (grade.score / grade.maxScore) * grade.maxScore, 0);

    return (weightedSum / totalWeight).toFixed(2);
  };

  const calculatePassingRate = () => {
    if (!discipline?.grades || discipline.grades.length === 0) return 0;
    const totalNeeded = discipline.grades.reduce((acc, grade) => acc + grade.maxScore, 0);
    const totalObtained = discipline.grades.reduce((acc, grade) => acc + grade.score, 0);
    return ((totalObtained / totalNeeded) * 100).toFixed(2);
  };

  // Dados do gráfico de pizza
  const totalScore = discipline?.grades?.reduce((acc, grade) => acc + grade.maxScore, 0) || 1; // Evita divisão por zero
  const totalObtained = discipline?.grades?.reduce((acc, grade) => acc + grade.score, 0) || 0;

  const pieData = {
    labels: ["Nota Obtida", "Nota Faltante"],
    datasets: [
      {
        data: [totalObtained, totalScore - totalObtained], // Proporção de notas obtidas e faltantes
        backgroundColor: ["rgba(75,192,192,0.6)", "rgba(255,99,132,0.3)"], // Cores para o gráfico
        borderColor: ["rgba(75,192,192,1)", "rgba(255,99,132,1)"],
        borderWidth: 1,
      },
    ],
  };

  // Opções do gráfico
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Permitir tamanho personalizado
  };

  // Horários disponíveis
  const availableTimes = ["Primeiro (7:00 - 8:40)", "Segundo (9:10 - 11:00)", "Terceiro (13:00 - 14:40)", "Quarto (15:10 - 17:00)", "Quinto (18:30 - 20:10)", "Sexto (20:40 - 22:00)"];

  return (
    <div className="discipline-details">
      <Header />
      <div className="content-wrapper">
        {discipline ? (
          <>
            <div className="details">
              <h1>Disciplina: {discipline.nome}</h1>

              {/* Exibir Horários de Aula */}
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
              <button onClick={handleAddSchedule}>Adicionar Horário</button>

              {/* Exibir Datas de Provas */}
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
              <button onClick={handleAddExam}>Adicionar Prova</button>

              {/* Exibir Notas */}
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
              <button onClick={handleAddGrade}>Adicionar Nota</button>
            </div>

            {/* Gráfico de Pizza e Estatísticas */}
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
        ) : (
          <p>Carregando disciplina...</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default DisciplineDetails;