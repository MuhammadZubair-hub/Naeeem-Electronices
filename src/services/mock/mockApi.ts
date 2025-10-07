// import { DashboardData } from '../../types';
// import { dashboardData } from './dashboardData';

// export class MockApi {
//   private delay(ms: number = 1000): Promise<void> {
//     return new Promise(resolve => setTimeout(resolve, ms));
//   }

//   async getDashboardData(): Promise<DashboardData> {
//     await this.delay(800);
//     return dashboardData;
//   }

//   async getKPIs(): Promise<DashboardData['kpis']> {
//     await this.delay(500);
//     return dashboardData.kpis;
//   }

//   async getTotalCountTrend(): Promise<DashboardData['totalCountTrend']> {
//     await this.delay(600);
//     return dashboardData.totalCountTrend;
//   }

//   async getTotalPaidByBranch(): Promise<DashboardData['totalPaidByBranch']> {
//     await this.delay(500);
//     return dashboardData.totalPaidByBranch;
//   }

//   async getTotalDueDonut(): Promise<DashboardData['totalDueDonut']> {
//     await this.delay(400);
//     return dashboardData.totalDueDonut;
//   }

//   async getRecentSales(): Promise<DashboardData['recentSales']> {
//     await this.delay(700);
//     return dashboardData.recentSales;
//   }

//   async getTopCustomers(): Promise<DashboardData['topCustomers']> {
//     await this.delay(600);
//     return dashboardData.topCustomers;
//   }

//   async getTopProducts(): Promise<DashboardData['topProducts']> {
//     await this.delay(500);
//     return dashboardData.topProducts;
//   }

//   async getSummary(): Promise<DashboardData['summary']> {
//     await this.delay(400);
//     return dashboardData.summary;
//   }
// }

// export const mockApi = new MockApi();
