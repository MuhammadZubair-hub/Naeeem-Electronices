import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { Login } from '../screens/Auth/Login';

import LoginScreen from '../screens/Auth/LoginScreen'
import CoustomerLoginScreen from '../../Customer/Auth/CoustomerLoginScreen';
import MainAuth from '../../MainAuth';
import CoustomerSignUpScreen from '../../Customer/Auth/SignUp';

export type AuthStackParamList = {
  Login: undefined;
  CoustLogin: undefined;
  MainAuth :undefined;
  SignUp :undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >

      <Stack.Screen name='MainAuth' component ={MainAuth} />
      <Stack.Screen name="CoustLogin" component={CoustomerLoginScreen} />
      <Stack.Screen name="SignUp" component={CoustomerSignUpScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
};
