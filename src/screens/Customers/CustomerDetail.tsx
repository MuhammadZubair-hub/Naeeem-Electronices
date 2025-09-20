import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RootState, AppDispatch } from '../../redux/store';
import { fetchDashboardData } from '../../redux/slices/dashboardSlice';
import { useTheme } from '../../hooks/useTheme';
import { usePermissions } from '../../hooks/usePermissions';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { LineGraph } from '../../components/charts/LineGraph';
import { BarGraph } from '../../components/charts/BarGraph';
import { ProgressGraph } from '../../components/charts/ProgressGraph';
import { formatCurrency, formatNumber, formatPhoneNumber, formatDate } from '../../utils/formatters';
import { Role } from '../../types';
import { screenName } from '../../navigation/ScreenName';

const { width } = Dimensions.get('window');

interface CustomerDetailProps {
  route: {
    params: {
      customerId: string;
    };
  };
}

interface Customer {
  id: string;
  customerCode: string;
  name: string;
  fatherName: string;
  cnic: string;
  phone: string;
  occupation: string;
  isHomeOwner: boolean;
  isMarried: boolean;
  residentialAddress: string;
  officeAddress?: string;
  branchId: string;
  regionId: string;
  zoneId: string;
  assignedTo: string;
  totalPurchases: number;
  totalDue: number;
  lastPurchaseDate: string;
  isActive: boolean;
  customerType: 'individual' | 'business';
  creditLimit: number;
  registrationDate: string;
  taxNumber?: string;
  businessType?: string;
}

interface Guarantor {
  id: string;
  name: string;
  fatherName: string;
  cnic: string;
  phone: string;
  occupation: string;
  residentialAddress: string;
  officeAddress?: string;
}

interface Transaction {
  id: string;
  customerId: string;
  amount: number;
  type: 'purchase' | 'payment' | 'refund';
  date: string;
  description: string;
  status: 'completed' | 'pending' | 'cancelled';
}

export const CustomerDetail: React.FC<CustomerDetailProps> = ({ route }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const permissions = usePermissions();
  
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: dashboardData, isLoading, error } = useSelector((state: RootState) => state.dashboard);

  const { customerId } = route.params;
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [guarantors, setGuarantors] = useState<Guarantor[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Mock customer data
  const customers: Customer[] = [
    {
      id: 'customer-1',
      customerCode: 'CS1439874',
      name: 'Kashif Muzamil',
      fatherName: 'M Muzamil',
      cnic: '3510268916271',
      phone: '00923011280303',
      occupation: 'hpr',
      isHomeOwner: true,
      isMarried: true,
      residentialAddress: 'gaon havili ajaib sing wlai nzd dr saleem k ghar via kto rada kisn rod vai rrk',
      officeAddress: 'nishadt dying fct nzd DHA housing scheme via gajumata rohi nal vai f p rod vai rrk',
      branchId: 'branch-1',
      regionId: 'region-1',
      zoneId: 'zone-1',
      assignedTo: 'user-9',
      totalPurchases: 125000,
      totalDue: 15000,
      lastPurchaseDate: '2024-01-15T00:00:00Z',
      isActive: true,
      customerType: 'individual',
      creditLimit: 50000,
      registrationDate: '2023-06-15T00:00:00Z',
    },
    {
      id: 'customer-2',
      customerCode: 'CS1439875',
      name: 'Fatima Electronics',
      fatherName: 'Muhammad Ali',
      cnic: '3510268916272',
      phone: '00923011280304',
      occupation: 'Business Owner',
      isHomeOwner: true,
      isMarried: true,
      residentialAddress: 'Shop 45, Gulberg Plaza, Gulberg, Lahore',
      officeAddress: 'Shop 45, Gulberg Plaza, Gulberg, Lahore',
      branchId: 'branch-2',
      regionId: 'region-1',
      zoneId: 'zone-2',
      assignedTo: 'user-10',
      totalPurchases: 250000,
      totalDue: 0,
      lastPurchaseDate: '2024-01-10T00:00:00Z',
      isActive: true,
      customerType: 'business',
      creditLimit: 100000,
      registrationDate: '2023-03-20T00:00:00Z',
      taxNumber: 'NTN-123456789',
      businessType: 'Electronics Retail',
    },
  ];

  // Mock guarantor data
  const allGuarantors: Guarantor[] = [
    {
      id: 'g1-1',
      name: 'M muzambal',
      fatherName: 'm anees',
      cnic: '3510266212609',
      phone: '00923039471642',
      occupation: 'owner',
      residentialAddress: 'gaon havili ajaib sing wlai nzd dr saleem k ghar via kto rada kisn rod vai rrk',
      officeAddress: 'apna zati zaindara krty h + dodh k akm krty h',
    },
    {
      id: 'g2-1',
      name: 'naseer ul din',
      fatherName: 'handu khan',
      cnic: '3510202270811',
      phone: '00923001535988',
      occupation: 'E M T',
      residentialAddress: 'gaon havili ajaib sing wlai nzd dr saleem k ghar via kto rada kisn rod vai rrk',
      officeAddress: '1122 me mulazim h diff jgo per duty krty h',
    },
  ];

  // Mock transaction data
  const allTransactions: Transaction[] = [
    {
      id: 'txn-1',
      customerId: 'customer-1',
      amount: 25000,
      type: 'purchase',
      date: '2024-01-15T00:00:00Z',
      description: 'Purchase of LED TV and Sound System',
      status: 'completed',
    },
    {
      id: 'txn-2',
      customerId: 'customer-1',
      amount: 10000,
      type: 'payment',
      date: '2024-01-20T00:00:00Z',
      description: 'Payment received',
      status: 'completed',
    },
    {
      id: 'txn-3',
      customerId: 'customer-2',
      amount: 50000,
      type: 'purchase',
      date: '2024-01-10T00:00:00Z',
      description: 'Bulk purchase of mobile phones',
      status: 'completed',
    },
  ];

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  useEffect(() => {
    // Find customer by ID
    const foundCustomer = customers.find(c => c.id === customerId);
    if (foundCustomer) {
      setCustomer(foundCustomer);
      // Filter transactions for this customer
      const customerTransactions = allTransactions.filter(t => t.customerId === customerId);
      setTransactions(customerTransactions);
      // Set guarantors for this customer
      setGuarantors(allGuarantors);
    }
  }, [customerId]);

  const onRefresh = () => {
    dispatch(fetchDashboardData());
  };

  const handleEditCustomer = () => {
    Alert.alert('Edit Customer', 'Customer editing functionality will be implemented soon.');
  };

  const handleNewTransaction = () => {
    Alert.alert('New Transaction', 'New transaction functionality will be implemented soon.');
  };

  const handleViewAllTransactions = () => {
    (navigation as any).navigate(screenName.CustomerTransactions, { customerId });
  };

  const handleContactCustomer = () => {
    if (customer) {
      Alert.alert(
        'Contact Customer',
        `Would you like to call ${customer.name}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Call', onPress: () => Alert.alert('Calling...', `Calling ${customer.phone}`) },
        ]
      );
    }
  };

  // Chart data
  const purchaseTrendData = [
    { x: 'Oct', y: 15000 },
    { x: 'Nov', y: 25000 },
    { x: 'Dec', y: 20000 },
    { x: 'Jan', y: 25000 },
  ];

  const paymentStatusData = [
    { x: 'Paid', y: customer ? customer.totalPurchases - customer.totalDue : 0 },
    { x: 'Due', y: customer ? customer.totalDue : 0 },
  ];

  const transactionTypeData = [
    { x: 'Purchases', y: transactions.filter(t => t.type === 'purchase').length },
    { x: 'Payments', y: transactions.filter(t => t.type === 'payment').length },
    { x: 'Refunds', y: transactions.filter(t => t.type === 'refund').length },
  ];

  if (!customer) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          Customer not found
        </Text>
        <Button
          title="Go Back"
          onPress={() => navigation.goBack()}
          style={styles.retryButton}
        />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          Failed to load customer data
        </Text>
        <Button
          title="Retry"
          onPress={onRefresh}
          style={styles.retryButton}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={[styles.backText, { color: theme.colors.primary }]}>← Back</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            Customer Details
          </Text>
          <TouchableOpacity onPress={handleEditCustomer} style={styles.editButton}>
            <Text style={[styles.editText, { color: theme.colors.primary }]}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Customer Header */}
        <Card style={styles.infoCard} padding="lg">
          <View style={styles.customerHeader}>
            <View style={styles.customerInfo}>
              <Text style={[styles.customerName, { color: theme.colors.textPrimary }]}>
                {customer.name} S/O {customer.fatherName}
              </Text>
              <Text style={[styles.customerCode, { color: theme.colors.primary }]}>
                Customer Code: {customer.customerCode}
              </Text>
              <Text style={[styles.customerCnic, { color: theme.colors.textSecondary }]}>
                CNIC: {customer.cnic}
              </Text>
              <Text style={[styles.customerContact, { color: theme.colors.textSecondary }]}>
                Phone: {customer.phone}
              </Text>
              <Text style={[styles.customerOccupation, { color: theme.colors.textSecondary }]}>
                Occupation: {customer.occupation}
              </Text>
              <Text style={[styles.customerStatus, { color: theme.colors.textSecondary }]}>
                Home Owner: {customer.isHomeOwner ? 'Yes' : 'No'} | Married: {customer.isMarried ? 'Yes' : 'No'}
              </Text>
            </View>
            <View style={[
              styles.statusBadge,
              { backgroundColor: customer.isActive ? theme.colors.success + '20' : theme.colors.error + '20' }
            ]}>
              <Text style={[
                styles.statusText,
                { color: customer.isActive ? theme.colors.success : theme.colors.error }
              ]}>
                {customer.isActive ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>

          <View style={styles.addressSection}>
            <Text style={[styles.addressLabel, { color: theme.colors.textSecondary }]}>
              Location Res.:
            </Text>
            <Text style={[styles.addressText, { color: theme.colors.textPrimary }]}>
              {customer.residentialAddress}
            </Text>
            {customer.officeAddress && (
              <>
                <Text style={[styles.addressLabel, { color: theme.colors.textSecondary }]}>
                  Location Offc.:
                </Text>
                <Text style={[styles.addressText, { color: theme.colors.textPrimary }]}>
                  {customer.officeAddress}
                </Text>
              </>
            )}
          </View>

          <View style={styles.customerStats}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                {formatCurrency(customer.totalPurchases)}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                Total Purchases
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[
                styles.statValue,
                { color: customer.totalDue > 0 ? theme.colors.error : theme.colors.success }
              ]}>
                {formatCurrency(customer.totalDue)}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                Outstanding Due
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.warning }]}>
                {formatCurrency(customer.creditLimit)}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                Credit Limit
              </Text>
            </View>
          </View>
        </Card>

        {/* Customer Details */}
        <Card style={styles.detailsCard} padding="lg">
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Customer Information
          </Text>
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                Registration Date
              </Text>
              <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
                {formatDate(customer.registrationDate)}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                Last Purchase
              </Text>
              <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
                {formatDate(customer.lastPurchaseDate)}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                Branch
              </Text>
              <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
                Branch {customer.branchId.split('-')[1]}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                Credit Utilization
              </Text>
              <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
                {((customer.totalDue / customer.creditLimit) * 100).toFixed(1)}%
              </Text>
            </View>
          </View>
        </Card>

        {/* G1 Detail (First Guarantor) */}
        {guarantors.length > 0 && (
          <Card style={styles.guarantorCard} padding="lg">
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              G1 Detail
            </Text>
            <View style={styles.guarantorInfo}>
              <Text style={[styles.guarantorName, { color: theme.colors.textPrimary }]}>
                {guarantors[0].name} S/O {guarantors[0].fatherName}
              </Text>
              <Text style={[styles.guarantorCnic, { color: theme.colors.textSecondary }]}>
                CNIC: {guarantors[0].cnic}
              </Text>
              <Text style={[styles.guarantorOccupation, { color: theme.colors.textSecondary }]}>
                Occupation: {guarantors[0].occupation}
              </Text>
              <Text style={[styles.guarantorPhone, { color: theme.colors.textSecondary }]}>
                Phone: {guarantors[0].phone}
              </Text>
              <Text style={[styles.guarantorAddress, { color: theme.colors.textSecondary }]}>
                {guarantors[0].residentialAddress}
              </Text>
              <Text style={[styles.addressLabel, { color: theme.colors.textSecondary }]}>
                Location Res.:
              </Text>
              <Text style={[styles.guarantorAddress, { color: theme.colors.textPrimary }]}>
                {guarantors[0].officeAddress}
              </Text>
            </View>
          </Card>
        )}

        {/* G2 Detail (Second Guarantor) */}
        {guarantors.length > 1 && (
          <Card style={styles.guarantorCard} padding="lg">
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              G2 Detail
            </Text>
            <View style={styles.guarantorInfo}>
              <Text style={[styles.guarantorName, { color: theme.colors.textPrimary }]}>
                {guarantors[1].name} S/O {guarantors[1].fatherName}
              </Text>
              <Text style={[styles.guarantorCnic, { color: theme.colors.textSecondary }]}>
                CNIC: {guarantors[1].cnic}
              </Text>
              <Text style={[styles.guarantorOccupation, { color: theme.colors.textSecondary }]}>
                Occupation: {guarantors[1].occupation}
              </Text>
              <Text style={[styles.guarantorPhone, { color: theme.colors.textSecondary }]}>
                Phone: {guarantors[1].phone}
              </Text>
              <Text style={[styles.guarantorAddress, { color: theme.colors.textSecondary }]}>
                {guarantors[1].residentialAddress}
              </Text>
              <Text style={[styles.addressLabel, { color: theme.colors.textSecondary }]}>
                Location Res.:
              </Text>
              <Text style={[styles.guarantorAddress, { color: theme.colors.textPrimary }]}>
                {guarantors[1].officeAddress}
              </Text>
            </View>
          </Card>
        )}

        {/* Charts */}
        <View style={styles.chartsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Customer Analytics
          </Text>
          
          <LineGraph
            title="Purchase Trend (4 Months)"
            data={purchaseTrendData}
            color={theme.colors.primary}
          />
          
          <ProgressGraph
            title="Payment Status"
            data={paymentStatusData}
            colors={[theme.colors.success, theme.colors.error]}
          />
          
          
        </View>

        {/* Recent Transactions */}
        <Card style={styles.transactionsCard} padding="lg">
          <View style={styles.transactionsHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              Recent Transactions
            </Text>
            <TouchableOpacity onPress={handleViewAllTransactions}>
              <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>
                View All
              </Text>
            </TouchableOpacity>
          </View>
          {transactions.slice(0, 3).map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionInfo}>
                <Text style={[styles.transactionDescription, { color: theme.colors.textPrimary }]}>
                  {transaction.description}
                </Text>
                <Text style={[styles.transactionDate, { color: theme.colors.textSecondary }]}>
                  {formatDate(transaction.date)}
                </Text>
              </View>
              <View style={styles.transactionAmount}>
                <Text style={[
                  styles.transactionValue,
                  { 
                    color: transaction.type === 'payment' ? theme.colors.success : 
                           transaction.type === 'refund' ? theme.colors.error : 
                           theme.colors.textPrimary 
                  }
                ]}>
                  {transaction.type === 'payment' ? '+' : transaction.type === 'refund' ? '-' : ''}
                  {formatCurrency(transaction.amount)}
                </Text>
                <Text style={[styles.transactionType, { color: theme.colors.textSecondary }]}>
                  {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                </Text>
              </View>
            </View>
          ))}
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          <Button
            title="Contact Customer"
            onPress={handleContactCustomer}
            variant="outline"
            style={styles.actionButton}
          />
          <Button
            title="New Transaction"
            onPress={handleNewTransaction}
            variant="primary"
            style={styles.actionButton}
          />
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    padding: 8,
  },
  backText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    flex: 1,
    textAlign: 'center',
  },
  editButton: {
    padding: 8,
  },
  editText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  infoCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  customerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    marginBottom: 8,
  },
  customerCode: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 4,
  },
  customerCnic: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 4,
  },
  customerContact: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 4,
  },
  customerOccupation: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 4,
  },
  customerStatus: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 4,
  },
  addressSection: {
    marginTop: 16,
    marginBottom: 16,
  },
  addressLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  customerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  detailsCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  guarantorCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  guarantorInfo: {
    gap: 8,
  },
  guarantorName: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 8,
  },
  guarantorCnic: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  guarantorOccupation: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  guarantorPhone: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  guarantorAddress: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailItem: {
    width: '48%',
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
  chartsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  transactionsCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionValue: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    marginBottom: 2,
  },
  transactionType: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  actionsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 8,
  },
  bottomSpacing: {
    height: 20,
  },
});
