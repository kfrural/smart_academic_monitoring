import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

interface Subject {
    id: number;
    name: string;
    hoursStudied: number;
}

const SubjectList: React.FC<{ subjects: Subject[] }> = ({ subjects }) => {
    return (
        <FlatList
            data={subjects}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <View style={styles.item}>
                    <Text>{item.name}</Text>
                    <Text>{item.hoursStudied} horas estudadas</Text>
                </View>
            )}
        />
    );
};

const styles = StyleSheet.create({
    item: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});

export default SubjectList;
