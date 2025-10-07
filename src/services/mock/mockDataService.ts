// import branchesData from '../../data/seed/branches.json';
// import customersData from '../../data/seed/customers.json';
// import salesData from '../../data/seed/sales.json';

// export interface Branch {
//   id: string;
//   name: string;
//   address: string;
//   regionId: string;
//   zoneId: string;
//   managerId: string;
//   managerName: string;
//   totalRevenue: number;
//   totalCustomers: number;
//   totalStaff: number;
//   isActive: boolean;
//   createdAt: string;
//   phone: string;
//   email: string;
//   openingHours: string;
//   services: string[];
//   location: {
//     latitude: number;
//     longitude: number;
//   };
// }

// export interface Customer {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   address: string;
//   branchId: string;
//   regionId: string;
//   zoneId: string;
//   assignedTo: string;
//   totalPurchases: number;
//   totalDue: number;
//   lastPurchaseDate: string;
//   isActive: boolean;
//   customerType: 'individual' | 'business';
//   creditLimit: number;
//   registrationDate: string;
//   taxNumber?: string;
//   businessType?: string;
//   preferredPaymentMethod: string;
//   notes: string;
// }

// export interface Sale {
//   id: string;
//   customerId: string;
//   customerName: string;
//   branchId: string;
//   salesPersonId: string;
//   salesPersonName: string;
//   totalAmount: number;
//   discount: number;
//   tax: number;
//   finalAmount: number;
//   paymentStatus: 'paid' | 'partial' | 'unpaid';
//   paymentMethod: string;
//   saleDate: string;
//   dueDate?: string;
//   invoiceNumber: string;
//   items: Array<{
//     id: string;
//     name: string;
//     quantity: number;
//     unitPrice: number;
//     totalPrice: number;
//   }>;
//   notes: string;
// }

// export interface StaffMember {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   role: string;
//   branchId: string;
//   regionId: string;
//   zoneId: string;
//   managerId?: string;
//   joinDate: string;
//   salary: number;
//   performance: number;
//   isActive: boolean;
//   address: string;
//   emergencyContact: string;
// }

// export interface Payment {
//   id: string;
//   saleId: string;
//   customerId: string;
//   amount: number;
//   paymentMethod: string;
//   paymentDate: string;
//   status: 'completed' | 'pending' | 'failed';
//   referenceNumber: string;
//   notes: string;
// }

// // Mock staff data
// const staffData: StaffMember[] = [
//   {
//     id: 'staff-1',
//     name: 'Omar Sheikh',
//     email: 'omar@naeemelectronics.com',
//     phone: '+92-300-1111111',
//     role: 'Branch Manager',
//     branchId: 'branch-1',
//     regionId: 'region-1',
//     zoneId: 'zone-1',
//     joinDate: '2023-01-15T00:00:00Z',
//     salary: 80000,
//     performance: 95,
//     isActive: true,
//     address: 'House 45, Gulshan-e-Iqbal, Karachi',
//     emergencyContact: '+92-300-1111112',
//   },
//   {
//     id: 'staff-2',
//     name: 'Ahmed Ali',
//     email: 'ahmed@naeemelectronics.com',
//     phone: '+92-300-2222222',
//     role: 'Sales Officer',
//     branchId: 'branch-1',
//     regionId: 'region-1',
//     zoneId: 'zone-1',
//     managerId: 'staff-1',
//     joinDate: '2023-02-01T00:00:00Z',
//     salary: 45000,
//     performance: 88,
//     isActive: true,
//     address: 'Apartment 12, Block B, Gulshan-e-Iqbal, Karachi',
//     emergencyContact: '+92-300-2222223',
//   },
//   {
//     id: 'staff-3',
//     name: 'Fatima Khan',
//     email: 'fatima@naeemelectronics.com',
//     phone: '+92-300-3333333',
//     role: 'Service Technician',
//     branchId: 'branch-1',
//     regionId: 'region-1',
//     zoneId: 'zone-1',
//     managerId: 'staff-1',
//     joinDate: '2023-03-15T00:00:00Z',
//     salary: 40000,
//     performance: 92,
//     isActive: true,
//     address: 'House 78, Block C, Gulshan-e-Iqbal, Karachi',
//     emergencyContact: '+92-300-3333334',
//   },
//   {
//     id: 'staff-4',
//     name: 'Hassan Raza',
//     email: 'hassan@naeemelectronics.com',
//     phone: '+92-300-4444444',
//     role: 'Cashier',
//     branchId: 'branch-1',
//     regionId: 'region-1',
//     zoneId: 'zone-1',
//     managerId: 'staff-1',
//     joinDate: '2023-04-01T00:00:00Z',
//     salary: 35000,
//     performance: 85,
//     isActive: true,
//     address: 'House 23, Block D, Gulshan-e-Iqbal, Karachi',
//     emergencyContact: '+92-300-4444445',
//   },
//   {
//     id: 'staff-5',
//     name: 'Aisha Malik',
//     email: 'aisha@naeemelectronics.com',
//     phone: '+92-300-5555555',
//     role: 'Branch Manager',
//     branchId: 'branch-2',
//     regionId: 'region-1',
//     zoneId: 'zone-2',
//     joinDate: '2023-02-20T00:00:00Z',
//     salary: 80000,
//     performance: 90,
//     isActive: true,
//     address: 'House 67, Gulberg, Lahore',
//     emergencyContact: '+92-300-5555556',
//   },
//   {
//     id: 'staff-6',
//     name: 'Hassan Ali',
//     email: 'hassan.ali@naeemelectronics.com',
//     phone: '+92-300-6666666',
//     role: 'Branch Manager',
//     branchId: 'branch-3',
//     regionId: 'region-2',
//     zoneId: 'zone-3',
//     joinDate: '2023-03-10T00:00:00Z',
//     salary: 80000,
//     performance: 87,
//     isActive: true,
//     address: 'Apartment 34, Blue Area, Islamabad',
//     emergencyContact: '+92-300-6666667',
//   },
// ];

// // Mock payment data
// const paymentsData: Payment[] = [
//   {
//     id: 'payment-1',
//     saleId: 'sale-1',
//     customerId: 'customer-1',
//     amount: 10000,
//     paymentMethod: 'card',
//     paymentDate: '2024-01-20T00:00:00Z',
//     status: 'completed',
//     referenceNumber: 'TXN-001',
//     notes: 'Partial payment for invoice INV-001',
//   },
//   {
//     id: 'payment-2',
//     saleId: 'sale-2',
//     customerId: 'customer-2',
//     amount: 51000,
//     paymentMethod: 'bank_transfer',
//     paymentDate: '2024-01-10T00:00:00Z',
//     status: 'completed',
//     referenceNumber: 'TXN-002',
//     notes: 'Full payment for invoice INV-002',
//   },
//   {
//     id: 'payment-3',
//     saleId: 'sale-4',
//     customerId: 'customer-4',
//     amount: 18000,
//     paymentMethod: 'card',
//     paymentDate: '2024-01-05T00:00:00Z',
//     status: 'completed',
//     referenceNumber: 'TXN-003',
//     notes: 'Full payment for invoice INV-004',
//   },
//   {
//     id: 'payment-4',
//     saleId: 'sale-6',
//     customerId: 'customer-6',
//     amount: 12500,
//     paymentMethod: 'cash',
//     paymentDate: '2024-01-20T00:00:00Z',
//     status: 'completed',
//     referenceNumber: 'TXN-004',
//     notes: 'Full payment for invoice INV-006',
//   },
//   {
//     id: 'payment-5',
//     saleId: 'sale-7',
//     customerId: 'customer-7',
//     amount: 18000,
//     paymentMethod: 'bank_transfer',
//     paymentDate: '2024-01-12T00:00:00Z',
//     status: 'completed',
//     referenceNumber: 'TXN-005',
//     notes: 'Partial payment for invoice INV-007',
//   },
// ];

// class MockDataService {
//   // Region methods
//   getRegions(): { id: string; name: string; managerName: string }[] {
//     // Derive unique regions from branches
//     const regionMap: {
//       [id: string]: { id: string; name: string; managerName: string };
//     } = {};
//     this.branches.forEach(branch => {
//       if (!regionMap[branch.regionId]) {
//         // Find regional manager (first branch manager in region)
//         const manager = this.staff.find(
//           s =>
//             s.regionId === branch.regionId &&
//             s.role.toLowerCase().includes('regional'),
//         );
//         regionMap[branch.regionId] = {
//           id: branch.regionId,
//           name: branch.regionId,
//           managerName: manager ? manager.name : branch.managerName || 'N/A',
//         };
//       }
//     });
//     return Object.values(regionMap);
//   }

//   getZonesByRegion(
//     regionId: string,
//   ): { id: string; name: string; managerName: string }[] {
//     // Derive unique zones from branches in region
//     const zoneMap: {
//       [id: string]: { id: string; name: string; managerName: string };
//     } = {};
//     this.branches
//       .filter(b => b.regionId === regionId)
//       .forEach(branch => {
//         if (!zoneMap[branch.zoneId]) {
//           // Find zonal manager (first staff with zoneId and 'zonal' in role)
//           const manager = this.staff.find(
//             s =>
//               s.zoneId === branch.zoneId &&
//               s.role.toLowerCase().includes('zonal'),
//           );
//           zoneMap[branch.zoneId] = {
//             id: branch.zoneId,
//             name: branch.zoneId,
//             managerName: manager ? manager.name : branch.managerName || 'N/A',
//           };
//         }
//       });
//     return Object.values(zoneMap);
//   }

//   getAVOsByBranch(
//     branchId: string,
//   ): { id: string; name: string; managerName: string }[] {
//     // Derive unique AVOs from branches
//     const avoMap: {
//       [id: string]: { id: string; name: string; managerName: string };
//     } = {};
//     this.staff
//       .filter(b => b.id === branchId)
//       .forEach(branch => {
//         if (!avoMap[branch.id]) {
//           // Find AVO manager (first staff with branchId and 'avo' in role)
//           const manager = this.staff.find(
//             s =>
//               s.branchId === branch.id && s.role.toLowerCase().includes('avo'),
//           );
//           avoMap[branch.id] = {
//             id: branch.zoneId,
//             name: branch.zoneId,
//             managerName: manager
//               ? manager.name
//               : this.staff.find(s => s.id === branch.id)?.name || 'N/A',
//           };
//         }
//       });
//     return Object.values(avoMap);
//   }

//   private branches: Branch[] = branchesData as Branch[];
//   private customers: Customer[] = customersData as Customer[];
//   private sales: Sale[] = salesData as Sale[];
//   private staff: StaffMember[] = staffData;
//   private payments: Payment[] = paymentsData;
//   private AVoStaff: StaffMember[] = staffData;

//   getAVOStaff(): StaffMember[] {
//     return this.AVoStaff;
//   }
//   // Branch methods
//   getBranches(): Branch[] {
//     return this.branches;
//   }

//   getBranchById(id: string): Branch | undefined {
//     return this.branches.find(branch => branch.id === id);
//   }

//   getBranchesByRegion(regionId: string): Branch[] {
//     return this.branches.filter(branch => branch.regionId === regionId);
//   }

//   getBranchesByZone(zoneId: string): Branch[] {
//     return this.branches.filter(branch => branch.zoneId === zoneId);
//   }

//   // Customer methods
//   getCustomers(): Customer[] {
//     return this.customers;
//   }

//   getCustomerById(id: string): Customer | undefined {
//     return this.customers.find(customer => customer.id === id);
//   }

//   getCustomersByBranch(branchId: string): Customer[] {
//     return this.customers.filter(customer => customer.branchId === branchId);
//   }

//   getCustomersByRegion(regionId: string): Customer[] {
//     return this.customers.filter(customer => customer.regionId === regionId);
//   }

//   getCustomersByZone(zoneId: string): Customer[] {
//     return this.customers.filter(customer => customer.zoneId === zoneId);
//   }

//   getCustomersByAssignedTo(assignedTo: string): Customer[] {
//     return this.customers.filter(
//       customer => customer.assignedTo === assignedTo,
//     );
//   }

//   // Sales methods
//   getSales(): Sale[] {
//     return this.sales;
//   }

//   getSaleById(id: string): Sale | undefined {
//     return this.sales.find(sale => sale.id === id);
//   }

//   getSalesByBranch(branchId: string): Sale[] {
//     return this.sales.filter(sale => sale.branchId === branchId);
//   }

//   getSalesByCustomer(customerId: string): Sale[] {
//     return this.sales.filter(sale => sale.customerId === customerId);
//   }

//   getSalesByRegion(regionId: string): Sale[] {
//     const branchesInRegion = this.getBranchesByRegion(regionId);
//     const branchIds = branchesInRegion.map(branch => branch.id);
//     return this.sales.filter(sale => branchIds.includes(sale.branchId));
//   }

//   getSalesByZone(zoneId: string): Sale[] {
//     const branchesInZone = this.getBranchesByZone(zoneId);
//     const branchIds = branchesInZone.map(branch => branch.id);
//     return this.sales.filter(sale => branchIds.includes(sale.branchId));
//   }

//   // Staff methods
//   getStaff(): StaffMember[] {
//     return this.staff;
//   }

//   getStaffById(id: string): StaffMember | undefined {
//     return this.staff.find(member => member.id === id);
//   }

//   getStaffByBranch(branchId: string): StaffMember[] {
//     return this.staff.filter(member => member.branchId === branchId);
//   }

//   getStaffByRegion(regionId: string): StaffMember[] {
//     return this.staff.filter(member => member.regionId === regionId);
//   }

//   getStaffByZone(zoneId: string): StaffMember[] {
//     return this.staff.filter(member => member.zoneId === zoneId);
//   }

//   // Payment methods
//   getPayments(): Payment[] {
//     return this.payments;
//   }

//   getPaymentById(id: string): Payment | undefined {
//     return this.payments.find(payment => payment.id === id);
//   }

//   getPaymentsBySale(saleId: string): Payment[] {
//     return this.payments.filter(payment => payment.saleId === saleId);
//   }

//   getPaymentsByCustomer(customerId: string): Payment[] {
//     return this.payments.filter(payment => payment.customerId === customerId);
//   }

//   // Analytics methods
//   getTotalRevenue(): number {
//     return this.sales.reduce((total, sale) => total + sale.finalAmount, 0);
//   }

//   getTotalRevenueByBranch(branchId: string): number {
//     return this.getSalesByBranch(branchId).reduce(
//       (total, sale) => total + sale.finalAmount,
//       0,
//     );
//   }

//   getTotalRevenueByRegion(regionId: string): number {
//     return this.getSalesByRegion(regionId).reduce(
//       (total, sale) => total + sale.finalAmount,
//       0,
//     );
//   }

//   getTotalRevenueByZone(zoneId: string): number {
//     return this.getSalesByZone(zoneId).reduce(
//       (total, sale) => total + sale.finalAmount,
//       0,
//     );
//   }

//   getTotalCustomers(): number {
//     return this.customers.length;
//   }

//   getActiveCustomers(): number {
//     return this.customers.filter(customer => customer.isActive).length;
//   }

//   getTotalBranches(): number {
//     return this.branches.length;
//   }

//   getActiveBranches(): number {
//     return this.branches.filter(branch => branch.isActive).length;
//   }

//   getTotalStaff(): number {
//     return this.staff.length;
//   }

//   getActiveStaff(): number {
//     return this.staff.filter(member => member.isActive).length;
//   }

//   // Search methods
//   searchCustomers(query: string): Customer[] {
//     const lowercaseQuery = query.toLowerCase();
//     return this.customers.filter(
//       customer =>
//         customer.name.toLowerCase().includes(lowercaseQuery) ||
//         customer.email.toLowerCase().includes(lowercaseQuery) ||
//         customer.phone.includes(query) ||
//         customer.address.toLowerCase().includes(lowercaseQuery),
//     );
//   }

//   searchBranches(query: string): Branch[] {
//     const lowercaseQuery = query.toLowerCase();
//     return this.branches.filter(
//       branch =>
//         branch.name.toLowerCase().includes(lowercaseQuery) ||
//         branch.address.toLowerCase().includes(lowercaseQuery) ||
//         branch.managerName.toLowerCase().includes(lowercaseQuery),
//     );
//   }

//   searchSales(query: string): Sale[] {
//     const lowercaseQuery = query.toLowerCase();
//     return this.sales.filter(
//       sale =>
//         sale.customerName.toLowerCase().includes(lowercaseQuery) ||
//         sale.invoiceNumber.toLowerCase().includes(lowercaseQuery) ||
//         sale.id.toLowerCase().includes(lowercaseQuery),
//     );
//   }
// }

// export const mockDataService = new MockDataService();
