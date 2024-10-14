import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { Discipline } from '../models/Discipline';

const useFetchDisciplines = () => {
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);

  useEffect(() => {
    const fetchDisciplines = async () => {
      const disciplinesSnapshot = await getDocs(collection(db, 'disciplinas'));
      const disciplinesList = disciplinesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Discipline[];
      setDisciplines(disciplinesList);
    };

    fetchDisciplines();
  }, []);

  return disciplines;
};

export default useFetchDisciplines;
