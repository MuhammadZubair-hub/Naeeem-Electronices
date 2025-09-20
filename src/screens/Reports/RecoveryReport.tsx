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
import { RootState, AppDispatch } from '../../redux/store';
import { fetchDashboardData } from '../../redux/slices/dashboardSlice';
import { useTheme } from '../../hooks/useTheme';
import { usePermissions } from '../../hooks/usePermissions';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LineGraph } from '../../components/charts/LineGraph';
import { BarGraph } from '../../components/charts/BarGraph';
import { DonutGauge } from '../../components/charts/ProgressGraph';
import { formatCurrency, formatNumber, formatDate } from '../../utils/formatters';
import { Role } from '../../types';
import { mockDataService, Sale, Customer } from '../../services/mock/mockDataService';

const { width } = Dimensions.get('window');

interface RecoveryItem {
  id: string;
  customerId: string;
  customerName: string;
  invoiceId: string;
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  daysOverdue: number;
  status: 'pending' | 'in_progress' | 'recovered' | 'written_off';
  assignedTo: string;
  lastContactDate?: string;
  notes: string;
}

export const RecoveryReport: React.FC = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const permissions = usePermissions();
  
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: dashboardData, isLoading, error } = useSelector((state: RootState) => state.dashboard);

  const [recoveryItems, setRecoveryItems] = useState<RecoveryItem[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'in_progress' | 'recovered' | 'written_off'>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | '30' | '60' | '90' | 'overdue'>('all');

  // Mock recovery data
  const mockRecoveryData: RecoveryItem[] = [
    {
      id: 'rec-1',
      customerId: 'customer-1',
      customerName: 'Ahmed Hassan',
      invoiceId: 'sale-1',
      invoiceNumber: 'INV-001',
      amount: 15000,
      dueDate: '2024-01-15T00:00:00Z',
      daysOverdue: 45,
      status: 'pending',
      assignedTo: 'user-9',
      notes: 'Customer not responding to calls',
    },
    {
      id: 'rec-2',
      customerId: 'customer-3',
      customerName: 'Omar Sheikh',
      invoiceId: 'sale-3',
      invoiceNumber: 'INV-003',
      amount: 25000,
      dueDate: '2024-01-20T00:00:00Z',
      daysOverdue: 40,
      status: 'in_progress',
      assignedTo: 'user-11',
      lastContactDate: '2024-02-25T00:00:00Z',
      notes: 'Customer agreed to payment plan',
    },
    {
      id: 'rec-3',
      customerId: 'customer-5',
      customerName: 'Tech Solutions Ltd',
      invoiceId: 'sale-5',
      invoiceNumber: 'INV-005',
      amount: 75000,
      dueDate: '2023-12-15T00:00:00Z',
      daysOverdue: 75,
      status: 'in_progress',
      assignedTo: 'user-13',
      lastContactDate: '2024-02-20T00:00:00Z',
      notes: 'Legal action being considered',
    },
    {
      id: 'rec-4',
      customerId: 'customer-7',
      customerName: 'Modern Appliances',
      invoiceId: 'sale-7',
      invoiceNumber: 'INV-007',
      amount: 20000,
      dueDate: '2024-02-12T00:00:00Z',
      daysOverdue: 18,
      status: 'pending',
      assignedTo: 'user-10',
      notes: 'Follow up required',
    },
    {
      id: 'rec-5',
      customerId: 'customer-9',
      customerName: 'Digital World',
      invoiceId: 'sale-9',
      invoiceNumber: 'INV-009',
      amount: 12000,
      dueDate: '2024-02-08T00:00:00Z',
      daysOverdue: 22,
      status: 'recovered',
      assignedTo: 'user-12',
      lastContactDate: '2024-02-28T00:00:00Z',
      notes: 'Payment received successfully',
    },
    {
      id: 'rec-6',
      customerId: 'customer-11',
      customerName: 'ElectroMax Store',
      invoiceId: 'sale-11',
      invoiceNumber: 'INV-011',
      amount: 30000,
      dueDate: '2024-01-28T00:00:00Z',
      daysOverdue: 32,
      status: 'in_progress',
      assignedTo: 'user-14',
      lastContactDate: '2024-02-26T00:00:00Z',
      notes: 'Partial payment received',
    },
    {
      id: 'rec-7',
      customerId: 'customer-13',
      customerName: 'Baloch Electronics',
      invoiceId: 'sale-13',
      invoiceNumber: 'INV-013',
      amount: 15000,
      dueDate: '2023-12-30T00:00:00Z',
      daysOverdue: 61,
      status: 'written_off',
      assignedTo: 'user-16',
      notes: 'Customer declared bankruptcy',
    },
  ];

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  useEffect(() => {
    setRecoveryItems(mockRecoveryData);
  }, []);

  const onRefresh = () => {
    dispatch(fetchDashboardData());
  };

  const getFilteredRecoveryItems = () => {
    let filtered = recoveryItems;

    // Apply status filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(item => item.status === selectedFilter);
    }

    // Apply period filter
    if (selectedPeriod !== 'all') {
      filtered = filtered.filter(item => {
        switch (selectedPeriod) {
          case '30': return item.daysOverdue <= 30;
          case '60': return item.daysOverdue > 30 && item.daysOverdue <= 60;
          case '90': return item.daysOverdue > 60 && item.daysOverdue <= 90;
          case 'overdue': return item.daysOverdue > 90;
          default: return true;
        }
      });
    }

    return filtered.sort((a, b) => b.daysOverdue - a.daysOverdue);
  };

  const getRecoveryTrendData = () => {
    // Mock trend data for the last 6 months
    return [
      { x: 'Jan', y: 85 },
      { x: 'Feb', y: 78 },
      { x: 'Mar', y: 82 },
      { x: 'Apr', y: 88 },
      { x: 'May', y: 91 },
      { x: 'Jun', y: 87 },
    ];
  };

  const getOverdueDistributionData = () => {
    const overdue30 = recoveryItems.filter(item => item.daysOverdue <= 30).length;
    const overdue60 = recoveryItems.filter(item => item.daysOverdue > 30 && item.daysOverdue <= 60).length;
    const overdue90 = recoveryItems.filter(item => item.daysOverdue > 60 && item.daysOverdue <= 90).length;
    const overdueOver90 = recoveryItems.filter(item => item.daysOverdue > 90).length;

    return [
      { x: '0-30 Days', y: overdue30 },
      { x: '31-60 Days', y: overdue60 },
      { x: '61-90 Days', y: overdue90 },
      { x: '90+ Days', y: overdueOver90 },
    ];
  };

  const getStatusDistributionData = () => {
    const pending = recoveryItems.filter(item => item.status === 'pending').length;
    const inProgress = recoveryItems.filter(item => item.status === 'in_progress').length;
    const recovered = recoveryItems.filter(item => item.status === 'recovered').length;
    const writtenOff = recoveryItems.filter(item => item.status === 'written_off').length;

    return [
      { x: 'Pending', y: pending },
      { x: 'In Progress', y: inProgress },
      { x: 'Recovered', y: recovered },
      { x: 'Written Off', y: writtenOff },
    ];
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return theme.colors.warning;
      case 'in_progress': return theme.colors.primary;
      case 'recovered': return theme.colors.success;
      case 'written_off': return theme.colors.error;
      default: return theme.colors.textSecondary;
    }
  };

  const renderRecoveryItem = (item: RecoveryItem) => (
    <Card key={item.id} style={styles.recoveryCard} padding="lg">
      <View style={styles.recoveryHeader}>
        <View style={styles.recoveryInfo}>
          <Text style={[styles.invoiceNumber, { color: theme.colors.textPrimary }]}>
            {item.invoiceNumber}
          </Text>
          <Text style={[styles.customerName, { color: theme.colors.textSecondary }]}>
            {item.customerName}
          </Text>
          <Text style={[styles.amount, { color: theme.colors.primary }]}>
            {formatCurrency(item.amount)}
          </Text>
        </View>
        <View style={styles.recoveryBadges}>
          <StatusBadge status={item.status} size="sm" />
          <View style={[
            styles.overdueBadge,
            { backgroundColor: item.daysOverdue > 60 ? theme.colors.error + '20' : theme.colors.warning + '20' }
          ]}>
            <Text style={[
              styles.overdueText,
              { color: item.daysOverdue > 60 ? theme.colors.error : theme.colors.warning }
            ]}>
              {item.daysOverdue} days overdue
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.recoveryDetails}>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
            Due Date:
          </Text>
          <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
            {formatDate(item.dueDate)}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
            Assigned To:
          </Text>
          <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
            Staff Member
          </Text>
        </View>
        {item.lastContactDate && (
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              Last Contact:
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
              {formatDate(item.lastContactDate)}
            </Text>
          </View>
        )}
        <View style={styles.notesContainer}>
          <Text style={[styles.notesLabel, { color: theme.colors.textSecondary }]}>
            Notes:
          </Text>
          <Text style={[styles.notesText, { color: theme.colors.textPrimary }]}>
            {item.notes}
          </Text>
        </View>
      </View>
    </Card>
  );

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          Failed to load recovery data
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
            Recovery Report
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Outstanding Payment Recovery Analysis
          </Text>
        </View>

        {/* Filters */}
        <Card style={styles.filtersCard} padding="lg">
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Filter by Status
          </Text>
          <View style={styles.filterButtons}>
            {['all', 'pending', 'in_progress', 'recovered', 'written_off'].map((filter) => (
              <TouchableOpacity
                key={filter}
                onPress={() => setSelectedFilter(filter as any)}
                style={[styles.filterButton, getFilterButtonStyle(filter, 'status')]}
              >
                <Text style={[styles.filterButtonText, getFilterTextStyle(filter, 'status')]}>
                  {filter.replace('_', ' ').charAt(0).toUpperCase() + filter.replace('_', ' ').slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Filter by Overdue Period
          </Text>
          <View style={styles.filterButtons}>
            {['all', '30', '60', '90', 'overdue'].map((filter) => (
              <TouchableOpacity
                key={filter}
                onPress={() => setSelectedPeriod(filter as any)}
                style={[styles.filterButton, getFilterButtonStyle(filter, 'period')]}
              >
                <Text style={[styles.filterButtonText, getFilterTextStyle(filter, 'period')]}>
                  {filter === 'all' ? 'All' : filter === 'overdue' ? '90+ Days' : `${filter} Days`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Summary Stats */}
        <Card style={styles.summaryCard} padding="lg">
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Recovery Summary
          </Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: theme.colors.primary }]}>
                {formatNumber(getFilteredRecoveryItems().length)}
              </Text>
              <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                Total Items
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: theme.colors.error }]}>
                {formatCurrency(getFilteredRecoveryItems().reduce((sum, item) => sum + item.amount, 0))}
              </Text>
              <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                Outstanding Amount
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: theme.colors.success }]}>
                {formatNumber(getFilteredRecoveryItems().filter(item => item.status === 'recovered').length)}
              </Text>
              <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                Recovered
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: theme.colors.warning }]}>
                {formatNumber(getFilteredRecoveryItems().filter(item => item.status === 'in_progress').length)}
              </Text>
              <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                In Progress
              </Text>
            </View>
          </View>
        </Card>

        {/* Charts */}
        <View style={styles.chartsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Recovery Analytics
          </Text>
          
          <LineGraph
            title="Recovery Rate Trend (6 Months)"
            data={getRecoveryTrendData()}
            color={theme.colors.primary}
          />
          
          <BarGraph
            title="Overdue Distribution"
            data={getOverdueDistributionData()}
            color={theme.colors.warning}
          />
          
          <DonutGauge
            title="Recovery Status Distribution"
            data={getStatusDistributionData()}
            colors={[theme.colors.warning, theme.colors.primary, theme.colors.success, theme.colors.error]}
          />
        </View>

        {/* Recovery Items */}
        <View style={styles.recoverySection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Recovery Items ({getFilteredRecoveryItems().length})
          </Text>
          {getFilteredRecoveryItems().map(renderRecoveryItem)}
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
  filtersCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
    marginTop: 20,
  },
  filterButtons: {
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
  filterButtonText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  summaryCard: {
    marginHorizontal: 20,
    marginBottom: 20,
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
  chartsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  recoverySection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  recoveryCard: {
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recoveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  recoveryInfo: {
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
    marginBottom: 4,
  },
  amount: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  recoveryBadges: {
    alignItems: 'flex-end',
    gap: 8,
  },
  overdueBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  overdueText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  recoveryDetails: {
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
  notesContainer: {
    marginTop: 8,
  },
  notesLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    lineHeight: 20,
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
