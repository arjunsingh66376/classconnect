import { View, Text } from 'react-native'
import React from 'react';
import DashboardScreen from './src/screens/Parent/DashboardScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/Parent/LoginScreen';
import StudentLoginScreen from './src/screens/Student/StudentLoginscreen';
import ReportScreen from './src/screens/Parent/ReportScreen';
import AdminLoginScreen from './src/screens/Admin/AdminLoginScreen'
import AdminRegistrationScreen from './src/screens/Admin/AdminRegistrationScreen'

import TeacherDashboard from './src/screens/Admin/TeacherDashboard'
const Stack = createNativeStackNavigator();

const App = () => {

  return (
      <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName='Login'>
        <Stack.Screen name="Login" component={LoginScreen}  />
        <Stack.Screen name="StudentLogin" component={StudentLoginScreen} />
        <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
        <Stack.Screen name="AdminRegistration" component={AdminRegistrationScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Teacherdashboard" component={TeacherDashboard} />
        <Stack.Screen name="Report" component={ReportScreen} />
      </Stack.Navigator>
    </NavigationContainer>
   
  )
}

export default App