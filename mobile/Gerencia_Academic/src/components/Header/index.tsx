import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Header: React.FC = () => {
    return (
        <View style={styles.header}>
            <Text style={styles.title}>Monitoramento Acadêmico</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        padding: 20,
        backgroundColor: '#4CAF50',
    },
    title: {
        color: '#fff',
        fontSize: 20,
        textAlign: 'center',
    },
});

export default Header;
