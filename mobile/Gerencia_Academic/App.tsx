import React, {useEffect} from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { createTables } from './src/utils/Database';

const App = () => {
   useEffect(() => {
       createTables(); // Cria tabelas no banco de dados ao iniciar o aplicativo
   }, []);

   return (
       <>
           <AppNavigator />
       </>
   );
};

export default App;
