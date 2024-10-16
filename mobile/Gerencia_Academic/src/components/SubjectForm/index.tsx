import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

const SubjectForm: React.FC<{ onAddSubject: (name: string, hoursStudied: number) => void }> = ({ onAddSubject }) => {
    const [name, setName] = useState('');
    const [hoursStudied, setHoursStudied] = useState('');

    const handleSubmit = () => {
        if (name && hoursStudied) {
            onAddSubject(name, parseInt(hoursStudied));
            setName('');
            setHoursStudied('');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput placeholder="Nome da Matéria" value={name} onChangeText={setName} style={styles.input} />
            <TextInput placeholder="Horas Estudadas" value={hoursStudied} onChangeText={setHoursStudied} keyboardType="numeric" style={styles.input} />
            <Button title="Adicionar Matéria" onPress={handleSubmit} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
    },
});

export default SubjectForm;
