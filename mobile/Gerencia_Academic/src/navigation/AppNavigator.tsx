import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import AddSubject from '../pages/AddSubject';
import Settings from '../pages/Settings';
import Report from '../pages/Report';

const Stack = createStackNavigator();

const AppNavigator = () => {
   return (
       <NavigationContainer>
           <Stack.Navigator initialRouteName="Home">
               <Stack.Screen name="Home" component={Home} />
               <Stack.Screen name="Login" component={Login} />
               <Stack.Screen name="Register" component={Register} />
               <Stack.Screen name="Dashboard" component={Dashboard} />
               <Stack.Screen name="AddSubject" component={AddSubject} />
               <Stack.Screen name="Settings" component={Settings} />
               <Stack.Screen name="Report" component={Report} />
           </Stack.Navigator>
       </NavigationContainer>
   );
};

export default AppNavigator;
