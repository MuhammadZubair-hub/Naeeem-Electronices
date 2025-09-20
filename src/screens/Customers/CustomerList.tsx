import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RootState, AppDispatch } from '../../redux/store';
import { fetchDashboardData } from '../../redux/slices/dashboardSlice';
import { useTheme } from '../../hooks/useTheme';
import { usePermissions } from '../../hooks/usePermissions';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { InputField } from '../../components/common/InputField';
import { formatCurrency, formatNumber, formatPhoneNumber } from '../../utils/formatters';
import { Role } from '../../types';
import { mockDataService, Customer } from '../../services/mock/mockDataService';
import { screenName } from '../../navigation/ScreenName';

const { width } = Dimensions.get('window');

// Customer interface is now imported from mockDataService

interface CustomerListProps {
  route?: {
    params?: {
      branchId?: string;
    };
  };
}

export const CustomerList: React.FC<CustomerListProps> = ({ route }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const permissions = usePermissions();
  
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: dashboardData, isLoading, error } = useSelector((state: RootState) => state.dashboard);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'inactive' | 'overdue'>('all');

  // Get customers from mock data service
  const customers = mockDataService.getCustomers();

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  useEffect(() => {
    // Filter customers based on user role, branch filter, search query, and status filter
    let accessibleCustomers = customers;

    // Apply role-based filtering
    if (user?.role === Role.RM || user?.role === Role.ZM) {
      accessibleCustomers = customers.filter(customer => customer.regionId === user.regionId);
    } else if (user?.role === Role.BR) {
      accessibleCustomers = customers.filter(customer => customer.branchId === user.branchId);
    } else if (user?.role === Role.AVO) {
      accessibleCustomers = customers.filter(customer => customer.assignedTo === user.id);
    }

    // Apply branch filter if specified
    if (route?.params?.branchId) {
      accessibleCustomers = accessibleCustomers.filter(customer => customer.branchId === route.params.branchId);
    }

    // Apply status filter
    switch (selectedFilter) {
      case 'active':
        accessibleCustomers = accessibleCustomers.filter(customer => customer.isActive);
        break;
      case 'inactive':
        accessibleCustomers = accessibleCustomers.filter(customer => !customer.isActive);
        break;
      case 'overdue':
        accessibleCustomers = accessibleCustomers.filter(customer => customer.totalDue > 0);
        break;
    }

    // Apply search filter
    if (searchQuery.trim()) {
      accessibleCustomers = accessibleCustomers.filter(customer =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.includes(searchQuery) ||
        customer.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredCustomers(accessibleCustomers);
  }, [searchQuery, selectedFilter, user, route?.params?.branchId]);

  const onRefresh = () => {
    dispatch(fetchDashboardData());
  };

  const handleCustomerPress = (customer: Customer) => {
    (navigation as any).navigate(screenName.CustomerDetail, { customerId: customer.id });
  };

  const getFilterButtonStyle = (filter: string) => {
    const isSelected = selectedFilter === filter;
    return {
      backgroundColor: isSelected ? theme.colors.primary : theme.colors.surfaceVariant,
      borderColor: isSelected ? theme.colors.primary : theme.colors.border,
    };
  };

  const getFilterTextStyle = (filter: string) => {
    const isSelected = selectedFilter === filter;
    return {
      color: isSelected ? theme.colors.white : theme.colors.textPrimary,
    };
  };

  const renderCustomerCard = (customer: Customer) => (
    <TouchableOpacity
      key={customer.id}
      onPress={() => handleCustomerPress(customer)}
      activeOpacity={0.7}
    >
      <Card style={styles.customerCard} padding="lg">
        <View style={styles.customerHeader}>
          <View style={styles.customerInfo}>
            <Text style={[styles.customerName, { color: theme.colors.textPrimary }]}>
              {customer.name}
            </Text>
            <Text style={[styles.customerType, { color: theme.colors.textSecondary }]}>
              {customer.customerType === 'business' ? '🏢 Business' : '👤 Individual'}
            </Text>
            <Text style={[styles.customerContact, { color: theme.colors.textSecondary }]}>
              📧 {customer.email}
            </Text>
            <Text style={[styles.customerContact, { color: theme.colors.textSecondary }]}>
              📞 {formatPhoneNumber(customer.phone)}
            </Text>
            <Text style={[styles.customerAddress, { color: theme.colors.textSecondary }]}>
              📍 {customer.address}
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

        <View style={styles.customerFooter}>
          <Text style={[styles.lastPurchase, { color: theme.colors.textTertiary }]}>
            Last Purchase: {new Date(customer.lastPurchaseDate).toLocaleDateString()}
          </Text>
          <View style={styles.customerActions}>
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                (navigation as any).navigate(screenName.CustomerDetail, { customerId: customer.id });
              }}
              style={[styles.actionButton, { backgroundColor: theme.colors.success + '20' }]}
            >
              <Text style={[styles.actionButtonText, { color: theme.colors.success }]}>
                View Details
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                (navigation as any).navigate(screenName.CustomerTransactions, { customerId: customer.id });
              }}
              style={[styles.actionButton, { backgroundColor: theme.colors.primary + '20' }]}
            >
              <Text style={[styles.actionButtonText, { color: theme.colors.primary }]}>
                View Transactions
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

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
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            Customer Management
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            {user?.role === Role.CEO || user?.role === Role.GM ? 'All Customers' : 
             user?.role === Role.RM || user?.role === Role.ZM ? 'Regional Customers' : 
             user?.role === Role.BR ? 'Branch Customers' : 'My Customers'}
          </Text>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <InputField
            label="Search Customers"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by name, email, phone, or address..."
            containerStyle={styles.searchInput}
          />
        </View>

        {/* Filters */}
        <View style={styles.filtersContainer}>
          <Text style={[styles.filtersLabel, { color: theme.colors.textSecondary }]}>
            Filter by Status:
          </Text>
          <View style={styles.filtersRow}>
            {['all', 'active', 'inactive', 'overdue'].map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[styles.filterButton, getFilterButtonStyle(filter)]}
                onPress={() => setSelectedFilter(filter as any)}
              >
                <Text style={[styles.filterText, getFilterTextStyle(filter)]}>
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Summary Stats */}
        <Card style={styles.summaryCard} padding="lg">
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Customer Overview
          </Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: theme.colors.primary }]}>
                {formatNumber(filteredCustomers.length)}
              </Text>
              <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                Total Customers
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: theme.colors.success }]}>
                {formatCurrency(filteredCustomers.reduce((sum, customer) => sum + customer.totalPurchases, 0))}
              </Text>
              <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                Total Purchases
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: theme.colors.error }]}>
                {formatCurrency(filteredCustomers.reduce((sum, customer) => sum + customer.totalDue, 0))}
              </Text>
              <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                Outstanding Due
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: theme.colors.warning }]}>
                {formatNumber(filteredCustomers.filter(c => c.isActive).length)}
              </Text>
              <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                Active Customers
              </Text>
            </View>
          </View>
        </Card>

        {/* Customer List */}
        <View style={styles.customerList}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Customers ({filteredCustomers.length})
          </Text>
          {filteredCustomers.length === 0 ? (
            <Card style={styles.emptyCard} padding="lg">
              <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                {searchQuery ? 'No customers found matching your search.' : 'No customers available.'}
              </Text>
            </Card>
          ) : (
            filteredCustomers.map(renderCustomerCard)
          )}
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchInput: {
    marginBottom: 0,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filtersLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    marginBottom: 8,
  },
  filtersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  summaryCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryItem: {
    width: '48%',
    marginBottom: 16,
  },
  summaryValue: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  customerList: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  customerCard: {
    marginBottom: 16,
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
    marginBottom: 16,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 4,
  },
  customerType: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 2,
  },
  customerContact: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 2,
  },
  customerAddress: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
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
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  customerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastPurchase: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    flex: 1,
  },
  customerActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flex: 1,
  },
  actionButtonText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
  },
  viewTransactionsButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  viewTransactionsText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
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
