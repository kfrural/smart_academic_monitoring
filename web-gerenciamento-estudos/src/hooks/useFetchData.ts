import { useEffect, useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import { EstudoData } from '../models/EstudoData';

const useFetchData = () => {
  const [dados, setDados] = useState<EstudoData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const estudoSnapshot = await getDocs(collection(db, "disciplinas"));
        const estudoList = estudoSnapshot.docs.map(doc => doc.data()) as EstudoData[];
        setDados(estudoList);
      } catch (err) {
        setError('Erro ao buscar dados');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return { dados, loading, error };
};

export default useFetchData;
