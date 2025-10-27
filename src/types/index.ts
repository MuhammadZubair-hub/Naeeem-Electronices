// Role hierarchy: CEO > GM > RM > ZM > BR > AVO
export enum Role {
  CEO = 'CEO',
  GM = 'GM', // General Manager
  AGM = 'AGM', // Assistant General Manager
  RM = 'RM', // Regional Manager
  ZM = 'ZM', // Zone Manager
  BR = 'BR', // Branch Manager
  AVO = 'AVO',
  AVM = 'AVM' // Area Sales Officer
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  branchId?: string;
  regionId?: string;
  zoneId?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  regionId: string;
  zoneId: string;
  managerId: string;
  isActive: boolean;
  createdAt: string;
}

export interface Region {
  id: string;
  name: string;
  code: string;
  managerId: string;
  isActive: boolean;
  createdAt: string;
}

export interface Zone {
  id: string;
  name: string;
  code: string;
  regionId: string;
  managerId: string;
  isActive: boolean;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address: string;
  branchId: string;
  regionId: string;
  zoneId: string;
  totalPurchases: number;
  totalDue: number;
  lastPurchaseDate?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Sale {
  id: string;
  customerId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  saleDate: string;
  branchId: string;
  regionId: string;
  zoneId: string;
  salesOfficerId: string;
  paymentStatus: 'paid' | 'partial' | 'due';
  createdAt: string;
}

// Dashboard Data Types
export interface KPIData {
  id: string;
  title: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  format: 'currency' | 'number' | 'percentage';
  icon: string;
  color: string;
}

export interface ChartDataPoint {
  x: string | number;
  y: number;
  label?: string;
}

export interface LineChartData {
  id: string;
  name: string;
  data: ChartDataPoint[];
  color: string;
}

export interface BarChartData {
  x: string;
  y: number;
  label?: string;
  color?: string;
}

export interface DonutChartData {
  x: string;
  y: number;
  color: string;
}

export interface DashboardData {
  kpis: KPIData[];
  totalCountTrend: LineChartData[];
  totalPaidByBranch: BarChartData[];
  totalDueDonut: DonutChartData[];
  recentSales: Sale[];
  topCustomers: Customer[];
  topProducts: Product[];
  summary: {
    totalRevenue: number;
    totalCustomers: number;
    totalBranches: number;
    totalRegions: number;
    totalZones: number;
    totalProducts: number;
    totalSales: number;
    totalDue: number;
    totalPaid: number;
  };
}

// Navigation Types
export type RootStackParamList = {
  Auth: undefined;
  Dashboard: undefined;
  Profile: undefined;
  Settings: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
};

export type DashboardStackParamList = {
  DashboardHome: undefined;
  CEO_GM_Dashboard: undefined;
  RM_ZM_Dashboard: undefined;
  ZM_BR_Dashboard: undefined;
  BR_AVO_Dashboard: undefined;
  AVO_AllCustomers: undefined;
  CustomerDetails: { customerId: string };
  // BranchDetails: { branchId: string };
  RegionDetails: { regionId: string };
  ZoneDetails: { zoneId: string };
  SalesReport: undefined;
  ProductCatalog: undefined;
};

// Redux State Types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ThemeState {
  isDarkMode: boolean;
}

export interface DashboardState {
  data: DashboardData | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

export interface RootState {
  auth: AuthState;
  theme: ThemeState;
  dashboard: DashboardState;
}

// Permission Types
export interface Permission {
  resource: string;
  action: string;
  conditions?: Record<string, any>;
}

export type PermissionCheck = (user: User, resource: string, action: string) => boolean;

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface CustomerForm {
  name: string;
  email?: string;
  phone: string;
  address: string;
  branchId: string;
  regionId: string;
  zoneId: string;
}

export interface SaleForm {
  customerId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  paidAmount: number;
  saleDate: string;
}

// Utility Types
export type Status = 'idle' | 'loading' | 'succeeded' | 'failed';

export type SortOrder = 'asc' | 'desc';

export interface SortConfig {
  key: string;
  order: SortOrder;
}

export interface FilterConfig {
  key: string;
  value: any;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains' | 'in';
}
