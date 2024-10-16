import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from '../services/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

const Home: React.FC = () => {
    const [userId, setUserId] = useState<string | null>(null);
    const [events, setEvents] = useState<any[]>([]);
    const navigate = useNavigate();
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
                fetchEvents();
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
            const todayString = today.toISOString().split('T')[0];
            const eventsRef = collection(db, 'eventos');
            const q = query(eventsRef, where('date', '==', todayString));
            const querySnapshot = await getDocs(q);

            const fetchedEvents: any[] = [];
            querySnapshot.forEach((doc) => {
                fetchedEvents.push({ id: doc.id, ...doc.data() });
            });
            setEvents(fetchedEvents);
        } catch (error) {
            console.error("Erro ao buscar eventos:", error);
        }
    };

    if (!userId) {
        return <div>Você precisa estar logado para acessar esta página.</div>;
    }

    return (
        <div className="home-container">
            <Header />
            
            <header className="home-header">
                <h1>Bem-vindo(a)!</h1>
                <p>Estamos felizes em tê-lo(a) aqui. Confira seus compromissos do dia:</p>
            </header>
            
            <div className="home-events">
                <h2>Compromissos do Dia</h2>
                {events.length > 0 ? (
                    <ul>
                        {events.map((event) => (
                            <li key={event.id}>{event.title} - {event.time}</li>
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
