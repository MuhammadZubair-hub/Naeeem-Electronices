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
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatCurrency, formatNumber, formatDate } from '../../utils/formatters';
import { Role } from '../../types';
import { mockDataService, Sale } from '../../services/mock/mockDataService';
import { screenName } from '../../navigation/ScreenName';

const { width } = Dimensions.get('window');

interface InvoiceListProps {
  route?: {
    params?: {
      branchId?: string;
      customerId?: string;
    };
  };
}

export const InvoiceList: React.FC<InvoiceListProps> = ({ route }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const permissions = usePermissions();
  
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: dashboardData, isLoading, error } = useSelector((state: RootState) => state.dashboard);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredInvoices, setFilteredInvoices] = useState<Sale[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'paid' | 'partial' | 'unpaid'>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | 'today' | 'week' | 'month'>('all');

  // Get sales from mock data service
  const sales = mockDataService.getSales();

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  useEffect(() => {
    // Filter invoices based on user role, filters, and search query
    let accessibleInvoices = sales;

    // Apply role-based filtering
    if (user?.role === Role.RM || user?.role === Role.ZM) {
      accessibleInvoices = mockDataService.getSalesByRegion(user.regionId || '');
    } else if (user?.role === Role.BR) {
      accessibleInvoices = mockDataService.getSalesByBranch(user.branchId || '');
    } else if (user?.role === Role.AVO) {
      // AVO can only see sales for their assigned customers
      const assignedCustomers = mockDataService.getCustomersByAssignedTo(user.id || '');
      const customerIds = assignedCustomers.map(c => c.id);
      accessibleInvoices = sales.filter(sale => customerIds.includes(sale.customerId));
    }

    // Apply branch filter if specified
    if (route?.params?.branchId) {
      accessibleInvoices = accessibleInvoices.filter(invoice => invoice.branchId === route.params.branchId);
    }

    // Apply customer filter if specified
    if (route?.params?.customerId) {
      accessibleInvoices = accessibleInvoices.filter(invoice => invoice.customerId === route.params.customerId);
    }

    // Apply payment status filter
    if (selectedFilter !== 'all') {
      accessibleInvoices = accessibleInvoices.filter(invoice => invoice.paymentStatus === selectedFilter);
    }

    // Apply period filter
    const now = new Date();
    if (selectedPeriod !== 'all') {
      accessibleInvoices = accessibleInvoices.filter(invoice => {
        const invoiceDate = new Date(invoice.saleDate);
        switch (selectedPeriod) {
          case 'today':
            return invoiceDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return invoiceDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return invoiceDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    // Apply search filter
    if (searchQuery.trim()) {
      accessibleInvoices = accessibleInvoices.filter(invoice =>
        invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredInvoices(accessibleInvoices);
  }, [searchQuery, selectedFilter, selectedPeriod, user, route?.params, sales]);

  const onRefresh = () => {
    dispatch(fetchDashboardData());
  };

  const handleInvoicePress = (invoice: Sale) => {
    (navigation as any).navigate(screenName.InvoiceDetail, { invoiceId: invoice.id });
  };

  const handleNewSale = () => {
    (navigation as any).navigate(screenName.NewSale);
  };

  const getFilterButtonStyle = (filter: string, filterType: 'status' | 'period') => {
    const isSelected = filterType === 'status' ? selectedFilter === filter : selectedPeriod === filter;
    return {
      backgroundColor: isSelected ? theme.colors.primary : theme.colors.surfaceVariant,
      borderColor: isSelected ? theme.colors.primary : theme.colors.border,
    };
  };

  const getFilterTextStyle = (filter: string, filterType: 'status' | 'period') => {
    const isSelected = filterType === 'status' ? selectedFilter === filter : selectedPeriod === filter;
    return {
      color: isSelected ? theme.colors.white : theme.colors.textPrimary,
    };
  };

  const renderInvoiceCard = (invoice: Sale) => (
    <TouchableOpacity
      key={invoice.id}
      onPress={() => handleInvoicePress(invoice)}
      activeOpacity={0.7}
    >
      <Card style={styles.invoiceCard} padding="lg">
        <View style={styles.invoiceHeader}>
          <View style={styles.invoiceInfo}>
            <Text style={[styles.invoiceNumber, { color: theme.colors.textPrimary }]}>
              {invoice.invoiceNumber}
            </Text>
            <Text style={[styles.customerName, { color: theme.colors.textSecondary }]}>
              {invoice.customerName}
            </Text>
            <Text style={[styles.salesPerson, { color: theme.colors.textTertiary }]}>
              Sales: {invoice.salesPersonName}
            </Text>
          </View>
          <StatusBadge status={invoice.paymentStatus} size="sm" />
        </View>

        <View style={styles.invoiceDetails}>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              Amount:
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
              {formatCurrency(invoice.finalAmount)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              Items:
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
              {invoice.items.length} item(s)
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              Date:
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
              {formatDate(invoice.saleDate)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              Payment:
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
              {invoice.paymentMethod.replace('_', ' ').toUpperCase()}
            </Text>
          </View>
        </View>

        {invoice.dueDate && invoice.paymentStatus !== 'paid' && (
          <View style={styles.dueDateContainer}>
            <Text style={[styles.dueDateText, { color: theme.colors.warning }]}>
              Due: {formatDate(invoice.dueDate)}
            </Text>
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          Failed to load invoice data
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
            Sales & Invoices
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            {user?.role === Role.CEO || user?.role === Role.GM ? 'All Invoices' : 
             user?.role === Role.RM || user?.role === Role.ZM ? 'Regional Invoices' : 
             user?.role === Role.BR ? 'Branch Invoices' : 'My Customer Invoices'}
          </Text>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <InputField
            label="Search Invoices"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by invoice number, customer, or ID..."
            containerStyle={styles.searchInput}
          />
        </View>

        {/* Filters */}
        <View style={styles.filtersContainer}>
          <Text style={[styles.filtersLabel, { color: theme.colors.textSecondary }]}>
            Filter by Status:
          </Text>
          <View style={styles.filtersRow}>
            {['all', 'paid', 'partial', 'unpaid'].map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[styles.filterButton, getFilterButtonStyle(filter, 'status')]}
                onPress={() => setSelectedFilter(filter as any)}
              >
                <Text style={[styles.filterText, getFilterTextStyle(filter, 'status')]}>
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <Text style={[styles.filtersLabel, { color: theme.colors.textSecondary }]}>
            Filter by Period:
          </Text>
          <View style={styles.filtersRow}>
            {['all', 'today', 'week', 'month'].map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[styles.filterButton, getFilterButtonStyle(filter, 'period')]}
                onPress={() => setSelectedPeriod(filter as any)}
              >
                <Text style={[styles.filterText, getFilterTextStyle(filter, 'period')]}>
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Summary Stats */}
        <Card style={styles.summaryCard} padding="lg">
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Sales Summary
          </Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: theme.colors.primary }]}>
                {formatNumber(filteredInvoices.length)}
              </Text>
              <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                Total Invoices
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: theme.colors.success }]}>
                {formatCurrency(filteredInvoices.reduce((sum, invoice) => sum + invoice.finalAmount, 0))}
              </Text>
              <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                Total Sales
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: theme.colors.warning }]}>
                {formatNumber(filteredInvoices.filter(i => i.paymentStatus === 'paid').length)}
              </Text>
              <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                Paid Invoices
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: theme.colors.error }]}>
                {formatNumber(filteredInvoices.filter(i => i.paymentStatus === 'unpaid').length)}
              </Text>
              <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                Unpaid Invoices
              </Text>
            </View>
          </View>
        </Card>

        {/* Action Button */}
        <View style={styles.actionContainer}>
          <Button
            title="New Sale"
            onPress={handleNewSale}
            variant="primary"
            style={styles.newSaleButton}
          />
        </View>

        {/* Invoice List */}
        <View style={styles.invoiceList}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Invoices ({filteredInvoices.length})
          </Text>
          {filteredInvoices.length === 0 ? (
            <Card style={styles.emptyCard} padding="lg">
              <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                {searchQuery ? 'No invoices found matching your search.' : 'No invoices available.'}
              </Text>
            </Card>
          ) : (
            filteredInvoices.map(renderInvoiceCard)
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
    marginTop: 12,
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
  actionContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  newSaleButton: {
    width: '100%',
  },
  invoiceList: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  invoiceCard: {
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  invoiceInfo: {
    flex: 1,
  },
  invoiceNumber: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 4,
  },
  customerName: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 2,
  },
  salesPerson: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  invoiceDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  detailValue: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
  dueDateContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  dueDateText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
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
