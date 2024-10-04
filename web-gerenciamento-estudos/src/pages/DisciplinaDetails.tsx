import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Line } from "react-chartjs-2";
import "../styles/DisciplinaDetails.css";

interface Grade {
  score: number;
  maxScore: number;
  examName: string;
}

const DisciplineDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [discipline, setDiscipline] = useState<any>(null);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [newExamName, setNewExamName] = useState("");
  const [newScore, setNewScore] = useState<number>(0);
  const [maxScore, setMaxScore] = useState<number>(10); // Nota máxima padrão

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
        const disciplineData = { id: docSnap.id, ...docSnap.data() };
        setDiscipline(disciplineData);
      } else {
        throw new Error("Documento não encontrado!");
      }
    } catch (error) {
      console.error("Erro ao carregar disciplina:", error);
    }
  };

  const handleAddGrade = () => {
    if (newScore < 0 || newScore > maxScore) {
      alert(`Insira uma nota entre 0 e ${maxScore}.`);
      return;
    }

    const newGrade: Grade = {
      score: newScore,
      maxScore: maxScore,
      examName: newExamName,
    };

    setGrades([...grades, newGrade]);
    setNewExamName("");
    setNewScore(0);
    setMaxScore(10); // Resetar a nota máxima para o valor padrão
  };

  // Função para calcular a média ponderada com base no valor máximo de cada prova
  const calculateWeightedAverage = () => {
    if (grades.length === 0) return 0;

    const totalWeight = grades.reduce((acc, grade) => acc + grade.maxScore, 0); // Soma das notas máximas (pesos)
    const weightedSum = grades.reduce((acc, grade) => acc + (grade.score / grade.maxScore) * grade.maxScore, 0); // Soma ponderada das notas obtidas

    return (weightedSum / totalWeight).toFixed(2); // Média ponderada
  };

  const calculatePassingRate = () => {
    if (grades.length === 0) return 0;
    const totalNeeded = grades.reduce((acc, grade) => acc + grade.maxScore, 0);
    const totalObtained = grades.reduce((acc, grade) => acc + grade.score, 0);
    return ((totalObtained / totalNeeded) * 100).toFixed(2);
  };

  const chartData = {
    labels: grades.map((grade, index) => grade.examName || `Prova ${index + 1}`),
    datasets: [
      {
        label: "Notas Obtidas",
        data: grades.map(grade => grade.score),
        fill: false,
        backgroundColor: "rgba(75,192,192,1)",
        borderColor: "rgba(75,192,192,1)",
      },
      {
        label: "Nota Máxima",
        data: grades.map(grade => grade.maxScore),
        fill: false,
        backgroundColor: "rgba(255,99,132,1)",
        borderColor: "rgba(255,99,132,1)",
      },
    ],
  };

  return (
    <div className="discipline-details">
      <Header />
      <div className="content-wrapper">
        {discipline ? (
          <>
            <h1>Disciplina: {discipline.nome}</h1>
            <h2>Dashboard de Desempenho</h2>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              handleAddGrade();
            }}>
              <input
                type="text"
                placeholder="Nome da Prova"
                value={newExamName}
                onChange={(e) => setNewExamName(e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Insira sua nota"
                value={newScore}
                onChange={(e) => setNewScore(Number(e.target.value))}
                required
              />
              <input
                type="number"
                placeholder="Nota Máxima"
                value={maxScore}
                onChange={(e) => setMaxScore(Number(e.target.value))}
                required
              />
              <button type="submit">Adicionar Nota</button>
            </form>

            <h4>Média Ponderada: {calculateWeightedAverage()}</h4>
            <h4>Porcentagem de Aprovação: {calculatePassingRate()}%</h4>

            <h3>Notas Adicionadas:</h3>
            <ul>
              {grades.map((grade, index) => (
                <li key={index}>
                  Prova: {grade.examName} - Nota: {grade.score}/{grade.maxScore}
                </li>
              ))}
            </ul>
            
            {grades.length === 0 ? (
              <p>Insira suas notas para ver o desempenho.</p>
            ) : (
              <Line data={chartData} options={{ responsive: true }} />
            )}
          </>
        ) : (
          <h1>Carregando detalhes da disciplina...</h1>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default DisciplineDetails;
