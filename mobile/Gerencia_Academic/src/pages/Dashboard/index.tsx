// Dashboard.tsx

import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import Header from '../../components/Header';
import PerformanceChart from '../../components/PerformanceChart';
import Footer from '../../components/Footer';
import { getSubjects } from '../../utils/Database';

const Dashboard = () => {
    const [subjects, setSubjects] = useState<any[]>([]); // Inicializa como array vazio

    useEffect(() => {
        getSubjects(setSubjects); // Carrega as matérias ao montar o componente.
    }, []);

    const subjectHours = subjects.map(subject => subject.hoursStudied || 0); // Extrai horas estudadas, garantindo que não seja null.

    return (
        <View>
            <Header />
            <PerformanceChart data={subjectHours} /> {/* Passa horas estudadas para o gráfico */}
            <Footer />
        </View>
    );
};

export default Dashboard;
