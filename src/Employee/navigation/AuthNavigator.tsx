import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { Login } from '../screens/Auth/Login';

import LoginScreen from '../screens/Auth/LoginScreen';
import UpdatePassword from '../screens/Auth/UpdatePassword';
import CoustomerLoginScreen from '../../Customer/Auth/CoustomerLoginScreen';
import MainAuth from '../../MainAuth';
import CoustomerSignUpScreen from '../../Customer/Auth/SignUp';
import ForgetPassword from '../../Customer/Auth/ForgetPassword'; 
import OtpScreen from '../screens/Auth/OtpScreen';

export type AuthStackParamList = {
  Login: undefined;
  CoustLogin: undefined;
  MainAuth: undefined;
  SignUp: undefined;
  ForgetPassword: undefined;
  UpdatePassword: { otpVerified?: boolean; userID?: string } | undefined;
  otp: { res?: any; flow?: 'login' | 'updatePassword'; userID?: string } | undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainAuth" component={MainAuth} />
      <Stack.Screen name="CoustLogin" component={CoustomerLoginScreen} />
      <Stack.Screen name="SignUp" component={CoustomerSignUpScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="UpdatePassword" component={UpdatePassword} />
      <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
      <Stack.Screen name="otp" component={OtpScreen} />
    </Stack.Navigator>
  );
};
