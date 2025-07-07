import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import { Discipline } from "../models/Discipline";
import { Grade } from "../models/Grade";

const useDisciplineDetails = (id: string | undefined) => {
  const [discipline, setDiscipline] = useState<Discipline | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchDiscipline = async () => {
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
        setError("Erro ao carregar disciplina");
      } finally {
        setLoading(false);
      }
    };

    fetchDiscipline();
  }, [id]);

  const handleAddGrade = async (newGrade: Grade) => {
    if (!discipline || !newGrade.examName) return;

    try {
      const docRef = doc(db, "disciplinas", discipline.id);
      await updateDoc(docRef, {
        grades: arrayUnion(newGrade),
      });
      setDiscipline((prev) => ({
        ...prev!,
        grades: [...(prev?.grades || []), newGrade],
      }));
    } catch (error) {
      console.error("Erro ao adicionar nota:", error);
    }
  };

  const handleAddSchedule = async (newSchedule: { day: string; time: string }) => {
    if (!discipline) return;

    try {
      const docRef = doc(db, "disciplinas", discipline.id);
      await updateDoc(docRef, {
        schedules: arrayUnion(newSchedule),
      });
      setDiscipline((prev) => ({
        ...prev!,
        schedules: [...(prev?.eventos || []), newSchedule],
      }));
    } catch (error) {
      console.error("Erro ao adicionar horário:", error);
    }
  };

  const handleAddExam = async (newExam: { name: string; type: string; date: string }) => {
    if (!discipline || !newExam.name || !newExam.date) return;

    try {
      const docRef = doc(db, "disciplinas", discipline.id);
      await updateDoc(docRef, {
        exams: arrayUnion(newExam),
      });
      setDiscipline((prev) => ({
        ...prev!,
        exams: [...(prev?.exams || []), newExam],
      }));
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

  return {
    discipline,
    loading,
    error,
    handleAddGrade,
    handleAddSchedule,
    handleAddExam,
    calculateWeightedAverage,
    calculatePassingRate,
  };
};

export default useDisciplineDetails;
