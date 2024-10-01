import React, { useState } from 'react';
import { View } from 'react-native';
import SubjectForm from '../../components/SubjectForm';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Notification from '../../components/Notification';
import { addSubject } from '../../utils/Database';

const AddSubject = () => {
     const [notificationMessage, setNotificationMessage] = useState('');

     const handleAddSubject = (name:string,hoursStudied:number) =>{
         addSubject(name,hoursStudied); // Adiciona a matéria ao banco de dados.
         setNotificationMessage(`Matéria "${name}" adicionada com sucesso!`);
     }

     return (
         <View>
             <Header />
             {/* Exibe notificação se houver mensagem */}
             {notificationMessage && 
                 <Notification message={notificationMessage} />}
             {/* Formulário para adicionar matéria */}
             <SubjectForm onAddSubject={handleAddSubject} />
             <Footer />
         </View>
     );
};

export default AddSubject;
