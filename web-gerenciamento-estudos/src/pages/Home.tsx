import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css'; // Adicione estilos personalizados aqui
import Footer from '../components/Footer'; // Importar o componente de rodapé
import Header from '../components/Header'; // Importar o componente de cabeçalho
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Importar funções do Firebase
import { db } from '../services/firebaseConfig'; // Importar a configuração do Firebase
import { collection, query, where, getDocs } from 'firebase/firestore'; // Importar funções do Firestore

const Home: React.FC = () => {
    const [userId, setUserId] = useState<string | null>(null);
    const [events, setEvents] = useState<any[]>([]); // Estado para armazenar eventos
    const navigate = useNavigate();
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
                fetchEvents(); // Busca eventos assim que o usuário está autenticado
            } else {
                setUserId(null);
                navigate("/login");
            }
        });

        return () => unsubscribe();
    }, [auth, navigate]);

    const fetchEvents = async () => {
        try {
            const today = new Date();
            const todayString = today.toISOString().split('T')[0]; // Formato YYYY-MM-DD
            const eventsRef = collection(db, 'events'); // Acesse a coleção 'events' no Firestore
            const q = query(eventsRef, where('date', '==', todayString)); // Filtra os eventos para o dia de hoje
            const querySnapshot = await getDocs(q);

            const fetchedEvents: any[] = [];
            querySnapshot.forEach((doc) => {
                fetchedEvents.push({ id: doc.id, ...doc.data() }); // Adiciona os dados dos eventos
            });
            setEvents(fetchedEvents); // Atualiza o estado com os eventos obtidos
        } catch (error) {
            console.error("Erro ao buscar eventos:", error);
        }
    };

    if (!userId) {
        return <div>Você precisa estar logado para acessar esta página.</div>;
    }

    return (
        <div className="home-container">
            <Header /> {/* Adiciona o cabeçalho */}
            
            <header className="home-header">
                <h1>Bem-vindo(a)!</h1>
                <p>Estamos felizes em tê-lo(a) aqui. Confira seus compromissos do dia:</p>
            </header>
            
            <div className="home-events">
                <h2>Compromissos do Dia</h2>
                {events.length > 0 ? (
                    <ul>
                        {events.map((event) => (
                            <li key={event.id}>{event.title} - {event.time}</li> // Exibindo título e hora do evento
                        ))}
                    </ul>
                ) : (
                    <p>Você não tem compromissos para hoje.</p>
                )}
            </div>


            <Footer />
        </div>
    );
};

export default Home;
