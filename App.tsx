import { View, Text } from 'react-native'
import React from 'react';
import DashboardScreen from './src/screens/Parent/DashboardScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/Parent/LoginScreen';

const Stack = createNativeStackNavigator();

const App = () => {

  return (
      <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
   
  )
}

export default App