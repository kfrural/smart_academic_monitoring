import React from 'react';
import { View, Text, Button } from 'react-native';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import styles from './style'; // Importando os estilos

const Home = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Header />
            <Text style={styles.welcomeText}>Bem-vindo ao Monitoramento de Desempenho Acadêmico!</Text>
            <Button title="Login" onPress={() => navigation.navigate('Login')} />
            <Footer />
        </View>
    );
};

export default Home;
