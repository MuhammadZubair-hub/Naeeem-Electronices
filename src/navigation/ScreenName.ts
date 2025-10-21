// ScreenNames.ts
// import { AppStackParamList } from './AppNavigator';

// Centralized screen names
export const screenName: { [K in keyof AppStackParamList]: K } = {
  RegionList: 'RegionList',
  ZoneList: 'ZoneList',
  // BranchList: 'BranchList', // removed duplicate
  DashboardHome: 'DashboardHome',
  CEO_GM_Dashboard: 'CEO_GM_Dashboard',
  RM_ZM_Dashboard: 'RM_ZM_Dashboard',
  ZM_BR_Dashboard: 'ZM_BR_Dashboard',
  BR_AVO_Dashboard: 'BR_AVO_Dashboard',
  AVO_AllCustomers: 'AVO_AllCustomers',
  BranchList: 'BranchList',
  // BranchDetail: 'BranchDetail',
  BranchPerformance: 'BranchPerformance',
  CustomerList: 'CustomerList',
  CustomerDetail: 'CustomerDetail',
  CustomerTransactions: 'CustomerTransactions',
  InvoiceList: 'InvoiceList',
  InvoiceDetail: 'InvoiceDetail',
  NewSale: 'NewSale',
  BranchComparison: 'BranchComparison',
  StaffPerformance: 'StaffPerformance',
  RevenueTrends: 'RevenueTrends',
  RecoveryReport: 'RecoveryReport',
  AVOsList: 'AVOsList',
};
