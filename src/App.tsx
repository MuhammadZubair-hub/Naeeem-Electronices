import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer';
import Userdashboard from './screen/Dashboard/UserDashboard/Userdashboar'
import Zonalmanger from './screen/Dashboard/UserDashboard/Zonalmanger'
import Area from './screen/Dashboard/UserDashboard/Area'
import AreaOfficer from './screen/Dashboard/UserDashboard/AreaOfficer'
import DynamicScreen from './screen/Dashboard/DynamicScreen'
import { Provider, useSelector } from 'react-redux'
import { persistor, store } from './utils/Shared/Store'
import { PersistGate } from 'redux-persist/integration/react'
import { getUserToken } from './utils/Shared/UserSlice'

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LoginScreen } from './screen/Login/LoginScreen'
import CustomDrawer from './Resuseable/CoutomDrawer';
import ProfileScreen from './screen/Profile/ProfileScreen';


const App = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <GestureHandlerRootView>
          <SafeAreaProvider>
            <MainNaviagtion></MainNaviagtion>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  )
}

export default App

const MainNaviagtion = () => {

  const Stack = createNativeStackNavigator();
  const Token = useSelector(getUserToken);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!Token ? (
          <>
            <Stack.Screen name='Login' component={LoginScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name='Main' component={DrawerNaviagtion} />
            <Stack.Screen name='Zonal' component={Zonalmanger} />
            <Stack.Screen name='Area' component={Area} />
            <Stack.Screen name='AreaOfficer' component={AreaOfficer} />
            <Stack.Screen name='DynamicScreen' component={DynamicScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
};

const DrawerNaviagtion = () => {

  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: { width: '70%', backgroundColor: 'transparent' }
      }}
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen name='UserDahsboard' component={Userdashboard} />
      <Drawer.Screen name='ProfileScreen' component={ProfileScreen}/>

    </Drawer.Navigator>
  )

}



