import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface NotificationProps {
    message?: string; // Mensagem opcional para a notificação.
}

const Notification: React.FC<NotificationProps> = ({ message }) => {
    if (!message) return null; // Não renderiza se não houver mensagem.

    return (
        <View style={styles.notification}>
            <Text style={styles.text}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    notification: {
        padding: 15,
        backgroundColor: '#ffcc00',
        borderRadius: 5,
        marginVertical: 10,
    },
    text: {
        color: '#000',
    },
});

export default Notification;
