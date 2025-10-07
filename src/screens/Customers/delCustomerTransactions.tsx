// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   RefreshControl,
//   TouchableOpacity,
//   Dimensions,
//   Alert,
// } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { RootState, AppDispatch } from '../../redux/store';
// import { fetchDashboardData } from '../../redux/slices/dashboardSlice';
// import { useTheme } from '../../hooks/useTheme';
// import { usePermissions } from '../../hooks/usePermissions';
// import { Card } from '../../components/common/Card';
// import { Button } from '../../components/common/Button';
// import { InputField } from '../../components/common/InputField';
// import { formatCurrency, formatNumber, formatDate } from '../../utils/formatters';
// import { Role } from '../../types';

// const { width } = Dimensions.get('window');

// interface CustomerTransactionsProps {
//   route: {
//     params: {
//       customerId: string;
//     };
//   };
// }

// interface Transaction {
//   id: string;
//   customerId: string;
//   customerName: string;
//   amount: number;
//   type: 'purchase' | 'payment' | 'refund' | 'installment';
//   date: string;
//   description: string;
//   status: 'completed' | 'pending' | 'cancelled';
//   paymentMethod?: 'cash' | 'card' | 'bank_transfer' | 'cheque';
//   invoiceNumber?: string;
//   dueDate?: string;
// }

// export const CustomerTransactions: React.FC<CustomerTransactionsProps> = ({ route }) => {
//   const { theme } = useTheme();
//   const dispatch = useDispatch<AppDispatch>();
//   const navigation = useNavigation();
//   const permissions = usePermissions();
  
//   const { user } = useSelector((state: RootState) => state.auth);
//   const { data: dashboardData, isLoading, error } = useSelector((state: RootState) => state.dashboard);

//   const { customerId } = route.params;
//   const [transactions, setTransactions] = useState<Transaction[]>([]);
//   const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedFilter, setSelectedFilter] = useState<'all' | 'purchase' | 'payment' | 'refund' | 'installment'>('all');
//   const [selectedStatus, setSelectedStatus] = useState<'all' | 'completed' | 'pending' | 'cancelled'>('all');

//   // Mock transaction data
//   const allTransactions: Transaction[] = [
//     {
//       id: 'txn-1',
//       customerId: 'customer-1',
//       customerName: 'Ahmed Hassan',
//       amount: 25000,
//       type: 'purchase',
//       date: '2024-01-15T00:00:00Z',
//       description: 'Purchase of LED TV and Sound System',
//       status: 'completed',
//       paymentMethod: 'card',
//       invoiceNumber: 'INV-001',
//     },
//     {
//       id: 'txn-2',
//       customerId: 'customer-1',
//       customerName: 'Ahmed Hassan',
//       amount: 10000,
//       type: 'payment',
//       date: '2024-01-20T00:00:00Z',
//       description: 'Payment received for invoice INV-001',
//       status: 'completed',
//       paymentMethod: 'cash',
//     },
//     {
//       id: 'txn-3',
//       customerId: 'customer-1',
//       customerName: 'Ahmed Hassan',
//       amount: 5000,
//       type: 'installment',
//       date: '2024-01-25T00:00:00Z',
//       description: 'Monthly installment payment',
//       status: 'completed',
//       paymentMethod: 'bank_transfer',
//     },
//     {
//       id: 'txn-4',
//       customerId: 'customer-1',
//       customerName: 'Ahmed Hassan',
//       amount: 15000,
//       type: 'purchase',
//       date: '2024-02-01T00:00:00Z',
//       description: 'Purchase of Home Appliances',
//       status: 'pending',
//       paymentMethod: 'cheque',
//       invoiceNumber: 'INV-002',
//       dueDate: '2024-02-15T00:00:00Z',
//     },
//     {
//       id: 'txn-5',
//       customerId: 'customer-1',
//       customerName: 'Ahmed Hassan',
//       amount: 2000,
//       type: 'refund',
//       date: '2024-02-05T00:00:00Z',
//       description: 'Refund for defective product',
//       status: 'completed',
//       paymentMethod: 'card',
//     },
//   ];

//   useEffect(() => {
//     dispatch(fetchDashboardData());
//   }, [dispatch]);

//   useEffect(() => {
//     // Filter transactions for this customer
//     const customerTransactions = allTransactions.filter(t => t.customerId === customerId);
//     setTransactions(customerTransactions);
//   }, [customerId]);

//   useEffect(() => {
//     // Apply filters
//     let filtered = transactions;

//     // Apply type filter
//     if (selectedFilter !== 'all') {
//       filtered = filtered.filter(t => t.type === selectedFilter);
//     }

//     // Apply status filter
//     if (selectedStatus !== 'all') {
//       filtered = filtered.filter(t => t.status === selectedStatus);
//     }

//     // Apply search filter
//     if (searchQuery.trim()) {
//       filtered = filtered.filter(t =>
//         t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         t.invoiceNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         t.id.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     setFilteredTransactions(filtered);
//   }, [transactions, selectedFilter, selectedStatus, searchQuery]);

//   const onRefresh = () => {
//     dispatch(fetchDashboardData());
//   };

//   const handleTransactionPress = (transaction: Transaction) => {
//     Alert.alert(
//       'Transaction Details',
//       `Transaction ID: ${transaction.id}\nAmount: ${formatCurrency(transaction.amount)}\nType: ${transaction.type}\nStatus: ${transaction.status}`,
//       [{ text: 'OK' }]
//     );
//   };

//   const handleNewTransaction = () => {
//     Alert.alert('New Transaction', 'New transaction functionality will be implemented soon.');
//   };

//   const getTransactionIcon = (type: string) => {
//     switch (type) {
//       case 'purchase': return '🛒';
//       case 'payment': return '💰';
//       case 'refund': return '↩️';
//       case 'installment': return '📅';
//       default: return '📄';
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'completed': return theme.colors.success;
//       case 'pending': return theme.colors.warning;
//       case 'cancelled': return theme.colors.error;
//       default: return theme.colors.textSecondary;
//     }
//   };

//   const getTypeColor = (type: string) => {
//     switch (type) {
//       case 'purchase': return theme.colors.primary;
//       case 'payment': return theme.colors.success;
//       case 'refund': return theme.colors.error;
//       case 'installment': return theme.colors.warning;
//       default: return theme.colors.textSecondary;
//     }
//   };

//   const getFilterButtonStyle = (filter: string, filterType: 'type' | 'status') => {
//     const isSelected = filterType === 'type' ? selectedFilter === filter : selectedStatus === filter;
//     return {
//       backgroundColor: isSelected ? theme.colors.primary : theme.colors.surfaceVariant,
//       borderColor: isSelected ? theme.colors.primary : theme.colors.border,
//     };
//   };

//   const getFilterTextStyle = (filter: string, filterType: 'type' | 'status') => {
//     const isSelected = filterType === 'type' ? selectedFilter === filter : selectedStatus === filter;
//     return {
//       color: isSelected ? theme.colors.white : theme.colors.textPrimary,
//     };
//   };

//   const renderTransactionCard = (transaction: Transaction) => (
//     <TouchableOpacity
//       key={transaction.id}
//       onPress={() => handleTransactionPress(transaction)}
//       activeOpacity={0.7}
//     >
//       <Card style={styles.transactionCard} padding="lg">
//         <View style={styles.transactionHeader}>
//           <View style={styles.transactionInfo}>
//             <Text style={[styles.transactionId, { color: theme.colors.textPrimary }]}>
//               {transaction.id.toUpperCase()}
//             </Text>
//             <Text style={[styles.transactionDescription, { color: theme.colors.textSecondary }]}>
//               {transaction.description}
//             </Text>
//             {transaction.invoiceNumber && (
//               <Text style={[styles.invoiceNumber, { color: theme.colors.textTertiary }]}>
//                 Invoice: {transaction.invoiceNumber}
//               </Text>
//             )}
//           </View>
//           <View style={styles.transactionIcon}>
//             <Text style={styles.iconText}>
//               {getTransactionIcon(transaction.type)}
//             </Text>
//           </View>
//         </View>

//         <View style={styles.transactionDetails}>
//           <View style={styles.detailRow}>
//             <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
//               Amount:
//             </Text>
//             <Text style={[
//               styles.detailValue,
//               { color: getTypeColor(transaction.type) }
//             ]}>
//               {transaction.type === 'payment' ? '+' : transaction.type === 'refund' ? '-' : ''}
//               {formatCurrency(transaction.amount)}
//             </Text>
//           </View>
//           <View style={styles.detailRow}>
//             <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
//               Type:
//             </Text>
//             <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
//               {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
//             </Text>
//           </View>
//           <View style={styles.detailRow}>
//             <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
//               Status:
//             </Text>
//             <View style={[
//               styles.statusBadge,
//               { backgroundColor: getStatusColor(transaction.status) + '20' }
//             ]}>
//               <Text style={[
//                 styles.statusText,
//                 { color: getStatusColor(transaction.status) }
//               ]}>
//                 {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
//               </Text>
//             </View>
//           </View>
//           <View style={styles.detailRow}>
//             <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
//               Date:
//             </Text>
//             <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
//               {formatDate(transaction.date)}
//             </Text>
//           </View>
//           {transaction.paymentMethod && (
//             <View style={styles.detailRow}>
//               <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
//                 Payment Method:
//               </Text>
//               <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
//                 {transaction.paymentMethod.replace('_', ' ').toUpperCase()}
//               </Text>
//             </View>
//           )}
//           {transaction.dueDate && (
//             <View style={styles.detailRow}>
//               <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
//                 Due Date:
//               </Text>
//               <Text style={[styles.detailValue, { color: theme.colors.warning }]}>
//                 {formatDate(transaction.dueDate)}
//               </Text>
//             </View>
//           )}
//         </View>
//       </Card>
//     </TouchableOpacity>
//   );

//   if (error) {
//     return (
//       <View style={[styles.container, styles.centerContent, { backgroundColor: theme.colors.background }]}>
//         <Text style={[styles.errorText, { color: theme.colors.error }]}>
//           Failed to load transaction data
//         </Text>
//         <Button
//           title="Retry"
//           onPress={onRefresh}
//           style={styles.retryButton}
//         />
//       </View>
//     );
//   }

//   return (
//     <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
//       <ScrollView
//         style={styles.scrollView}
//         refreshControl={
//           <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
//         }
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Header */}
//         <View style={styles.header}>
//           <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//             <Text style={[styles.backText, { color: theme.colors.primary }]}>← Back</Text>
//           </TouchableOpacity>
//           <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
//             Transaction History
//           </Text>
//           <TouchableOpacity onPress={handleNewTransaction} style={styles.newButton}>
//             <Text style={[styles.newText, { color: theme.colors.primary }]}>+ New</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Search */}
//         <View style={styles.searchContainer}>
//           <InputField
//             label="Search Transactions"
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//             placeholder="Search by description, invoice number, or transaction ID..."
//             containerStyle={styles.searchInput}
//           />
//         </View>

//         {/* Filters */}
//         <View style={styles.filtersContainer}>
//           <Text style={[styles.filtersLabel, { color: theme.colors.textSecondary }]}>
//             Filter by Type:
//           </Text>
//           <View style={styles.filtersRow}>
//             {['all', 'purchase', 'payment', 'refund', 'installment'].map((filter) => (
//               <TouchableOpacity
//                 key={filter}
//                 style={[styles.filterButton, getFilterButtonStyle(filter, 'type')]}
//                 onPress={() => setSelectedFilter(filter as any)}
//               >
//                 <Text style={[styles.filterText, getFilterTextStyle(filter, 'type')]}>
//                   {filter.charAt(0).toUpperCase() + filter.slice(1)}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>
          
//           <Text style={[styles.filtersLabel, { color: theme.colors.textSecondary }]}>
//             Filter by Status:
//           </Text>
//           <View style={styles.filtersRow}>
//             {['all', 'completed', 'pending', 'cancelled'].map((filter) => (
//               <TouchableOpacity
//                 key={filter}
//                 style={[styles.filterButton, getFilterButtonStyle(filter, 'status')]}
//                 onPress={() => setSelectedStatus(filter as any)}
//               >
//                 <Text style={[styles.filterText, getFilterTextStyle(filter, 'status')]}>
//                   {filter.charAt(0).toUpperCase() + filter.slice(1)}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>

//         {/* Summary Stats */}
//         <Card style={styles.summaryCard} padding="lg">
//           <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
//             Transaction Summary
//           </Text>
//           <View style={styles.summaryGrid}>
//             <View style={styles.summaryItem}>
//               <Text style={[styles.summaryValue, { color: theme.colors.primary }]}>
//                 {formatNumber(filteredTransactions.length)}
//               </Text>
//               <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
//                 Total Transactions
//               </Text>
//             </View>
//             <View style={styles.summaryItem}>
//               <Text style={[styles.summaryValue, { color: theme.colors.success }]}>
//                 {formatCurrency(filteredTransactions.reduce((sum, t) => sum + (t.type === 'payment' ? t.amount : 0), 0))}
//               </Text>
//               <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
//                 Total Payments
//               </Text>
//             </View>
//             <View style={styles.summaryItem}>
//               <Text style={[styles.summaryValue, { color: theme.colors.error }]}>
//                 {formatCurrency(filteredTransactions.reduce((sum, t) => sum + (t.type === 'purchase' ? t.amount : 0), 0))}
//               </Text>
//               <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
//                 Total Purchases
//               </Text>
//             </View>
//             <View style={styles.summaryItem}>
//               <Text style={[styles.summaryValue, { color: theme.colors.warning }]}>
//                 {formatNumber(filteredTransactions.filter(t => t.status === 'pending').length)}
//               </Text>
//               <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
//                 Pending
//               </Text>
//             </View>
//           </View>
//         </Card>

//         {/* Transaction List */}
//         <View style={styles.transactionList}>
//           <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
//             Transactions ({filteredTransactions.length})
//           </Text>
//           {filteredTransactions.length === 0 ? (
//             <Card style={styles.emptyCard} padding="lg">
//               <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
//                 {searchQuery ? 'No transactions found matching your search.' : 'No transactions available.'}
//               </Text>
//             </Card>
//           ) : (
//             filteredTransactions.map(renderTransactionCard)
//           )}
//         </View>

//         {/* Bottom Spacing */}
//         <View style={styles.bottomSpacing} />
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   centerContent: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   scrollView: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingTop: 20,
//     paddingBottom: 10,
//   },
//   backButton: {
//     padding: 8,
//   },
//   backText: {
//     fontSize: 16,
//     fontFamily: 'Poppins-SemiBold',
//   },
//   title: {
//     fontSize: 20,
//     fontFamily: 'Poppins-Bold',
//     flex: 1,
//     textAlign: 'center',
//   },
//   newButton: {
//     padding: 8,
//   },
//   newText: {
//     fontSize: 16,
//     fontFamily: 'Poppins-SemiBold',
//   },
//   searchContainer: {
//     paddingHorizontal: 20,
//     marginBottom: 20,
//   },
//   searchInput: {
//     marginBottom: 0,
//   },
//   filtersContainer: {
//     paddingHorizontal: 20,
//     marginBottom: 20,
//   },
//   filtersLabel: {
//     fontSize: 14,
//     fontFamily: 'Poppins-Medium',
//     marginBottom: 8,
//     marginTop: 12,
//   },
//   filtersRow: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//   },
//   filterButton: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//     borderWidth: 1,
//   },
//   filterText: {
//     fontSize: 12,
//     fontFamily: 'Poppins-Medium',
//   },
//   summaryCard: {
//     marginHorizontal: 20,
//     marginBottom: 20,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontFamily: 'Poppins-SemiBold',
//     marginBottom: 16,
//   },
//   summaryGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   summaryItem: {
//     width: '48%',
//     marginBottom: 16,
//   },
//   summaryValue: {
//     fontSize: 20,
//     fontFamily: 'Poppins-Bold',
//     marginBottom: 4,
//   },
//   summaryLabel: {
//     fontSize: 12,
//     fontFamily: 'Poppins-Regular',
//   },
//   transactionList: {
//     paddingHorizontal: 20,
//     marginBottom: 20,
//   },
//   transactionCard: {
//     marginBottom: 16,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   transactionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: 16,
//   },
//   transactionInfo: {
//     flex: 1,
//   },
//   transactionId: {
//     fontSize: 16,
//     fontFamily: 'Poppins-SemiBold',
//     marginBottom: 4,
//   },
//   transactionDescription: {
//     fontSize: 14,
//     fontFamily: 'Poppins-Regular',
//     marginBottom: 2,
//   },
//   invoiceNumber: {
//     fontSize: 12,
//     fontFamily: 'Poppins-Regular',
//   },
//   transactionIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#f1f5f9',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   iconText: {
//     fontSize: 20,
//   },
//   transactionDetails: {
//     gap: 8,
//   },
//   detailRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   detailLabel: {
//     fontSize: 14,
//     fontFamily: 'Poppins-Regular',
//   },
//   detailValue: {
//     fontSize: 14,
//     fontFamily: 'Poppins-SemiBold',
//   },
//   statusBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   statusText: {
//     fontSize: 12,
//     fontFamily: 'Poppins-SemiBold',
//   },
//   emptyCard: {
//     alignItems: 'center',
//     paddingVertical: 40,
//   },
//   emptyText: {
//     fontSize: 16,
//     fontFamily: 'Poppins-Regular',
//     textAlign: 'center',
//   },
//   errorText: {
//     fontSize: 16,
//     fontFamily: 'Poppins-SemiBold',
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   retryButton: {
//     marginTop: 8,
//   },
//   bottomSpacing: {
//     height: 20,
//   },
// });
