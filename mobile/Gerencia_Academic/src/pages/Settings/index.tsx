import React from 'react';
import { View, Text } from 'react-native';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const Settings = () => {
     return (
         <View>
             <Header />
             {/* Configurações podem ser adicionadas aqui */}
             <Text>Ajustes e Preferências</Text>
             {/* Adicione opções de configuração aqui */}
             <Footer />
         </View>
     );
};

export default Settings;
