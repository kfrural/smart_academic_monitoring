import React from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

const Login = () => {
    return (
        <View style={styles.container}>
            <TextInput placeholder="Email" style={styles.input} />
            <TextInput placeholder="Senha" secureTextEntry style={styles.input} />
            <Button title="Entrar" onPress={() => {}} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 50,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        paddingHorizontal: 10,
        marginBottom: 10,
    },
});

export default Login;
