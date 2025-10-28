import { AppStackParamList } from './AppNavigator';

// Centralized screen names
export const screenName: { [K in keyof AppStackParamList]: K } = {
  RegionList: 'RegionList',
  ZoneList: 'ZoneList',
  DashboardHome: 'DashboardHome',
  CEO_GM_Dashboard: 'CEO_GM_Dashboard',
  AGM_Dashboard: 'AGM_Dashboard',
  RM_ZM_Dashboard: 'RM_ZM_Dashboard',
  ZM_BR_Dashboard: 'ZM_BR_Dashboard',
  BR_AVO_Dashboard: 'BR_AVO_Dashboard',
  AVO_AllCustomers: 'AVO_AllCustomers',
  BranchList: 'BranchList',
  AGMList: 'AGMList',
  BranchPerformance: 'BranchPerformance',
  CustomerList: 'CustomerList',
  CustomerDetail: 'CustomerDetail',
  CustomerTransactions: 'CustomerTransactions',
  InvoiceList: 'InvoiceList',
  InvoiceDetail: 'InvoiceDetail',
  BranchDetail: 'BranchDetail',
  AVOsList: 'AVOsList',
};
