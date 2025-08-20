import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Login from './screen/Login/Login'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native'
import Userdashboard from './screen/Dashboard/UserDashboard/Userdashboar'
import Zonalmanger from './screen/Dashboard/UserDashboard/Zonalmanger'
import Area from './screen/Dashboard/UserDashboard/Area'
import AreaOfficer from './screen/Dashboard/UserDashboard/AreaOfficer'
import DynamicScreen from './screen/Dashboard/DynamicScreen'

const App = () => {
  return (
    <SafeAreaProvider>
      <MainNaviagtion></MainNaviagtion>
    </SafeAreaProvider>
  )
}

export default App

const MainNaviagtion = ()=>{

  const Stack = createNativeStackNavigator();

  return(
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown:false}}>
      <Stack.Screen name='Login' component={Login}/>
      <Stack.Screen name='UserDashboard' component={Userdashboard} />
      <Stack.Screen name='Zonal' component={Zonalmanger} />
      <Stack.Screen name='Area' component={Area} />
      <Stack.Screen name='AreaOfficer' component={AreaOfficer} />
      <Stack.Screen name='DynamicScreen' component={DynamicScreen} />
    </Stack.Navigator>
    </NavigationContainer>
  )
}