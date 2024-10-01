import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Footer: React.FC = () => {
    return (
        <View style={styles.footer}>
            <Text style={styles.text}>© 2024 Monitoramento Acadêmico</Text>
            <Text style={styles.text}>Desenvolvido por Karla Ferreira</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    footer: {
        padding: 10,
        backgroundColor: '#4CAF50',
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    text: {
        color: '#fff',
        textAlign: 'center',
    },
});

export default Footer;
