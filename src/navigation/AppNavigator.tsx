export type AppStackParamList = {
  RegionList: undefined;
  ZoneList: { regionId: string };
  BranchList: { zoneId: string };
  DashboardHome: undefined;
  CEO_GM_Dashboard: undefined;
  AGM_Dashboard: undefined;
  RM_ZM_Dashboard: undefined;
  ZM_BR_Dashboard: undefined;
  BR_AVO_Dashboard: undefined;
  AVO_AllCustomers: undefined;
  BranchDetail: { branchId: string };
  BranchPerformance: { branchId: string };
  CustomerList: { branchId?: string } | undefined;
  CustomerDetail: { customerId: string };
  CustomerTransactions: { customerId: string };
  InvoiceList: { branchId?: string; customerId?: string } | undefined;
  InvoiceDetail: { invoiceId: string };
  AVOsList: undefined;
  AGMList: undefined;
};

import React from 'react';
import { useSelector } from 'react-redux';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, StatusBar, View } from 'react-native';
import { RootState } from '../redux/store';
import { Role } from '../types';
import { screenName } from './ScreenName';

// Import all dashboards
import { CEO_GM_Dashboard } from '../screens/Dashboard/CEO_GM_Dashboard';
import { RM_ZM_Dashboard } from '../screens/Dashboard/RM_ZM_Dashboard';
import { ZM_BR_Dashboard } from '../screens/Dashboard/ZM_BR_Dashboard';
import { BR_AVO_Dashboard } from '../screens/Dashboard/BR_AVO_Dashboard';
import { AVO_AllCustomers } from '../screens/Dashboard/AVO_AllCustomers';

import { BranchList } from '../screens/Branch/BranchList';
import { CustomerList } from '../screens/Customers/CustomerList';
import { CustomerDetail } from '../screens/Customers/CustomerDetail';
import { ZoneList } from '../screens/Zones/ZoneList';
import { AVOsList } from '../screens/AVOs/AVOsList';
import { RegionList } from '../screens/Regions/RegionList';
import { RoleGuard } from './RoleGuard';

const Stack = createNativeStackNavigator();

const RoleBasedNavigator = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }
  const designation = user?.designation?.toUpperCase();
  const access = user?.fullAuth;

  console.log('access is : ', access);

  console.log('desgination', designation);
  let initialScreen;

  switch (designation) {
    case Role.CEO:
    case Role.GM:
      initialScreen = screenName.CEO_GM_Dashboard;
      break;
    case 'RM':
      // initialScreen = screenName.ZoneList;
      initialScreen = screenName.RM_ZM_Dashboard;
      break;
    case Role.ZM:
      initialScreen = screenName.ZM_BR_Dashboard;
      break;

    case Role.AVM:
      initialScreen = screenName.BR_AVO_Dashboard;
      break;
    case Role.AVO:
      // initialScreen = screenName.CustomerList;
      initialScreen = screenName.AVO_AllCustomers;
      break;
    default:
      initialScreen = screenName.AVO_AllCustomers;
  }

  if (access?.toUpperCase() == 'Y' || access?.toUpperCase() == 'YES') {
    initialScreen = screenName.CEO_GM_Dashboard;
  } else {
    // initialScreen = screenName.AVO_AllCustomers
    console.log('no ausdfsfddsf')
  }
  return (
    <Stack.Navigator
      initialRouteName={initialScreen}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name={screenName.CEO_GM_Dashboard}
        component={CEO_GM_Dashboard}
      />
      <Stack.Screen
        name={screenName.RM_ZM_Dashboard}
        component={RM_ZM_Dashboard}
      />
      <Stack.Screen
        name={screenName.ZM_BR_Dashboard}
        component={ZM_BR_Dashboard}
      />
      <Stack.Screen
        name={screenName.BR_AVO_Dashboard}
        component={BR_AVO_Dashboard}
      />
      <Stack.Screen
        name={screenName.AVO_AllCustomers}
        component={AVO_AllCustomers}
      />

      <Stack.Screen
        name="RegionList"
        component={RoleGuard(RegionList, [
          Role.CEO,
          Role.GM,
          Role.RM,
          Role.ZM,
          Role.AVM,
          Role.AVO,
        ])}
      />

      <Stack.Screen
        name="ZoneList"
        component={RoleGuard(ZoneList, [
          Role.RM,
          Role.ZM,
          Role.AVM,
          Role.AVO,
          Role.GM,
          Role.CEO,
        ])}
      />
      <Stack.Screen
        name="BranchList"
        component={RoleGuard(BranchList, [
          Role.CEO,
          Role.GM,

          Role.RM,
          Role.ZM,
          Role.AVM,
          Role.AVO,
        ])}
      />
      <Stack.Screen
        name="CustomerList"
        component={RoleGuard(CustomerList, [
          Role.CEO,
          Role.GM,

          Role.RM,
          Role.ZM,
          Role.AVM,
          Role.AVO,
        ])}
      />
      <Stack.Screen
        name="CustomerDetail"
        component={RoleGuard(CustomerDetail, [
          Role.CEO,
          Role.GM,

          Role.RM,
          Role.ZM,
          Role.AVM,
          Role.AVO,
        ])}
      />
      <Stack.Screen
        name="AVOsList"
        component={RoleGuard(AVOsList, [
          Role.CEO,
          Role.GM,

          Role.RM,
          Role.ZM,
          Role.AVM,
          Role.AVO,
        ])}
      />
    </Stack.Navigator>
  );
};

export const AppNavigator = () => (
  <Stack.Navigator
   screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Main" component={RoleBasedNavigator} />
  </Stack.Navigator>
);
