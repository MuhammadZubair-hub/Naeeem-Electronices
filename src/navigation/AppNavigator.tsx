import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { screenName } from './ScreenName';
import { RoleGuard } from './RoleGuard';
import { Role } from '../types';

// Screens
import { DashboardHome } from '../screens/Dashboard/DashboardHome';
import { CEO_GM_Dashboard } from '../screens/Dashboard/CEO_GM_Dashboard';
import { RM_ZM_Dashboard } from '../screens/Dashboard/RM_ZM_Dashboard';
import { ZM_BR_Dashboard } from '../screens/Dashboard/ZM_BR_Dashboard';
import BR_AVO_Dashboard from '../screens/Dashboard/BR_AVO_Dashboard';
import { AVO_AllCustomers } from '../screens/Dashboard/AVO_AllCustomers';
import { BranchList } from '../screens/Branch/BranchList';
import { BranchDetail } from '../screens/Branch/BranchDetail';
import { BranchPerformance } from '../screens/Branch/BranchPerformance';
import { CustomerList } from '../screens/Customers/CustomerList';
import { CustomerDetail } from '../screens/Customers/CustomerDetail';
import { CustomerTransactions } from '../screens/Customers/CustomerTransactions';
import { InvoiceList } from '../screens/Sales/InvoiceList';
import { InvoiceDetail } from '../screens/Sales/InvoiceDetail';
import { NewSale } from '../screens/Sales/NewSale';
import { BranchComparison } from '../screens/Reports/BranchComparison';
import { StaffPerformance } from '../screens/Reports/StaffPerformance';
import { RevenueTrends } from '../screens/Reports/RevenueTrends';
import { RecoveryReport } from '../screens/Reports/RecoveryReport';
import { ZoneList } from '../screens/Zones/ZoneList';
import { AVOsList } from '../screens/AVOs/AVOsList';
import { RegionList } from '../screens/Regions/RegionList';
import DrawerContent from '.././components/common/DrawerContent';

export type AppStackParamList = {
  RegionList: undefined;
  ZoneList: { regionId: string };
  BranchList: { zoneId: string };
  DashboardHome: undefined;
  CEO_GM_Dashboard: undefined;
  RM_ZM_Dashboard: undefined;
  ZM_BR_Dashboard: undefined;
  BR_AVO_Dashboard: undefined;
  AVO_AllCustomers: undefined;
  // BranchList: undefined; // removed duplicate
  BranchDetail: { branchId: string };
  BranchPerformance: { branchId: string };
  CustomerList: { branchId?: string } | undefined;
  CustomerDetail: { customerId: string };
  CustomerTransactions: { customerId: string };
  InvoiceList: { branchId?: string; customerId?: string } | undefined;
  InvoiceDetail: { invoiceId: string };
  NewSale: undefined;
  BranchComparison: undefined;
  StaffPerformance: undefined;
  RevenueTrends: undefined;
  RecoveryReport: undefined;
  AVOsList: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();
const Drawer = createDrawerNavigator();

const DashboardStack = () => (
  <Stack.Navigator
    // initialRouteName={screenName.DashboardHome}
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name={screenName.DashboardHome} component={DashboardHome} />
    <Stack.Screen
      name="RegionList"
      component={RoleGuard(RegionList, [Role.CEO, Role.GM, Role.RM, Role.ZM])}
    />

    <Stack.Screen
      name="ZoneList"
      component={RoleGuard(ZoneList, [Role.CEO, Role.GM, Role.RM, Role.ZM])}
    />
    <Stack.Screen
      name={screenName.CEO_GM_Dashboard}
      component={RoleGuard(CEO_GM_Dashboard, [Role.CEO, Role.GM])}
    />
    <Stack.Screen
      name={screenName.AVOsList}
      component={RoleGuard(AVOsList, [Role.BR])}
    />
    <Stack.Screen
      name={screenName.RM_ZM_Dashboard}
      component={RoleGuard(RM_ZM_Dashboard, [Role.RM, Role.ZM])}
    />
    <Stack.Screen
      name={screenName.ZM_BR_Dashboard}
      component={RoleGuard(ZM_BR_Dashboard, [Role.ZM, Role.BR])}
    />
    <Stack.Screen
      name={screenName.BR_AVO_Dashboard}
      component={RoleGuard(BR_AVO_Dashboard, [Role.BR, Role.AVO])}
    />
    <Stack.Screen
      name={screenName.AVO_AllCustomers}
      component={RoleGuard(AVO_AllCustomers, [Role.AVO])}
    />
    <Stack.Screen
      name={screenName.BranchList}
      component={RoleGuard(BranchList, [
        Role.CEO,
        Role.GM,
        Role.RM,
        Role.ZM,
        Role.BR,
      ])}
    />
    <Stack.Screen
      name={screenName.BranchDetail}
      component={RoleGuard(BranchDetail, [
        Role.CEO,
        Role.GM,
        Role.RM,
        Role.ZM,
        Role.BR,
      ])}
    />
    <Stack.Screen
      name={screenName.BranchPerformance}
      component={RoleGuard(BranchPerformance, [
        Role.CEO,
        Role.GM,
        Role.RM,
        Role.ZM,
        Role.BR,
      ])}
    />
    <Stack.Screen
      name={screenName.CustomerList}
      component={RoleGuard(CustomerList, [
        Role.CEO,
        Role.GM,
        Role.RM,
        Role.ZM,
        Role.BR,
        Role.AVO,
      ])}
    />
    <Stack.Screen
      name={screenName.CustomerDetail}
      component={RoleGuard(CustomerDetail, [
        Role.CEO,
        Role.GM,
        Role.RM,
        Role.ZM,
        Role.BR,
        Role.AVO,
      ])}
    />
    <Stack.Screen
      name={screenName.CustomerTransactions}
      component={RoleGuard(CustomerTransactions, [
        Role.CEO,
        Role.GM,
        Role.RM,
        Role.ZM,
        Role.BR,
        Role.AVO,
      ])}
    />
    <Stack.Screen
      name={screenName.InvoiceList}
      component={RoleGuard(InvoiceList, [
        Role.CEO,
        Role.GM,
        Role.RM,
        Role.ZM,
        Role.BR,
        Role.AVO,
      ])}
    />
    <Stack.Screen
      name={screenName.InvoiceDetail}
      component={RoleGuard(InvoiceDetail, [
        Role.CEO,
        Role.GM,
        Role.RM,
        Role.ZM,
        Role.BR,
        Role.AVO,
      ])}
    />
    <Stack.Screen
      name={screenName.NewSale}
      component={RoleGuard(NewSale, [Role.BR, Role.AVO])}
    />
    <Stack.Screen
      name={screenName.BranchComparison}
      component={RoleGuard(BranchComparison, [
        Role.CEO,
        Role.GM,
        Role.RM,
        Role.ZM,
      ])}
    />
    <Stack.Screen
      name={screenName.StaffPerformance}
      component={RoleGuard(StaffPerformance, [
        Role.CEO,
        Role.GM,
        Role.RM,
        Role.ZM,
        Role.BR,
      ])}
    />
    <Stack.Screen
      name={screenName.RevenueTrends}
      component={RoleGuard(RevenueTrends, [
        Role.CEO,
        Role.GM,
        Role.RM,
        Role.ZM,
        Role.BR,
      ])}
    />
    <Stack.Screen
      name={screenName.RecoveryReport}
      component={RoleGuard(RecoveryReport, [
        Role.CEO,
        Role.GM,
        Role.RM,
        Role.ZM,
        Role.BR,
      ])}
    />
  </Stack.Navigator>
);

export const AppNavigator: React.FC = () => (
  // <Drawer.Navigator
  //   screenOptions={{
  //     headerShown: false,
  //     drawerStyle: { backgroundColor: 'transparent', width: '65%' },
  //   }}
  //   drawerContent={props => <DrawerContent {...props} />}
  // >
  //   <Drawer.Screen name="Main" component={DashboardStack} />
  // </Drawer.Navigator>

  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Main" component={DashboardStack} />
  </Stack.Navigator>
);
