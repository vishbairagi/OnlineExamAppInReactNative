import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './src/Screens/SplashScreen';
import HomeScreen from './src/Screens/HomeScreen';
import QuestionScreen from './src/Screens/QuestionScreen';
// Importing LoginScreen to use in the navigation stack
import LoginScreen from './src/Screens/LoginScreen';
import ExamInstructionScreen from './src/Screens/ExamInstructionScreen';
import RegisterExam from './src/Screens/RegisterExam';
import { AuthProvider } from './src/Screens/AuthContext';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
          <Stack.Screen
          name="Question"
          component={QuestionScreen}
          options={{ headerShown: false }}
        />
        
          <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
          <Stack.Screen
            name="ExamInstruction"
            component={ExamInstructionScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="RegisterExam"
            component={RegisterExam}
            options={{ headerShown: false }}
          />

        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
