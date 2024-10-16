// Database.ts

// Importando SQLite e criando uma instância do banco de dados.
import SQLite from 'react-native-sqlite-storage';

// Abrindo ou criando um banco de dados chamado "academic_performance.db".
const db = SQLite.openDatabase(
     { name:'academic_performance.db', location:'default' },
     () => {},
     error => console.error('Error opening database:', error)
);

// Função que cria a tabela "subjects".
export const createTables = () => {
     db.transaction(tx => {
         tx.executeSql(
             `CREATE TABLE IF NOT EXISTS subjects (
                 id INTEGER PRIMARY KEY AUTOINCREMENT,
                 name TEXT NOT NULL,
                 hoursStudied INTEGER NOT NULL DEFAULT(0),
                 grade INTEGER DEFAULT(0)
             );`
         );
     });
};

// Função que adiciona uma nova matéria ao banco de dados.
export const addSubject = (name:string,hoursStudied:number) => {
     db.transaction(tx => {
         tx.executeSql(
             `INSERT INTO subjects (name,hoursStudied) VALUES (?, ?)`,
             [name,hoursStudied],
             (_, result) => console.log('Matéria adicionada:', result),
             (_, error) => console.error('Error adding subject:', error)
         );
     });
};

export const getSubjects = (callback: (subjects: any[]) => void) => {
    db.transaction(tx => {
        tx.executeSql(
            'SELECT * FROM subjects',
            [],
            (_, result) => {
                const subjects: any[] = [];
                for (let i = 0; i < result.rows.length; i++) {
                    subjects.push(result.rows.item(i));
                }
                callback(subjects);
            },
            (_, error) => {
                console.error('Error fetching subjects:', error);
                callback([]); // Retorna um array vazio em caso de erro
            }
        );
    });
};
