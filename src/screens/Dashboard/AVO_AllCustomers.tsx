import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
  FlatList,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { fetchDashboardData } from '../../redux/slices/dashboardSlice';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { LineGraph } from '../../components/charts/LineGraph';
import { BarGraph } from '../../components/charts/BarGraph';
import { DonutGauge } from '../../components/charts/ProgressGraph';
import { Role } from '../../types';

const { width } = Dimensions.get('window');

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalPurchases: number;
  lastPurchase: string;
  status: 'active' | 'inactive';
}

export const AVO_AllCustomers: React.FC = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: dashboardData, isLoading, error } = useSelector((state: RootState) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  const onRefresh = () => {
    dispatch(fetchDashboardData());
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-PK').format(num);
  };

  const getRoleDisplayName = (role: Role): string => {
    const roleNames = {
      [Role.CEO]: 'Chief Executive Officer',
      [Role.GM]: 'General Manager',
      [Role.RM]: 'Regional Manager',
      [Role.ZM]: 'Zone Manager',
      [Role.BR]: 'Branch Manager',
      [Role.AVO]: 'Area Sales Officer',
    };
    return roleNames[role];
  };

  // Sample customer data
  const customers: Customer[] = [
    {
      id: '1',
      name: 'Ahmed Ali',
      email: 'ahmed.ali@email.com',
      phone: '+92-300-1234567',
      totalPurchases: 45000,
      lastPurchase: '2024-01-15',
      status: 'active',
    },
    {
      id: '2',
      name: 'Fatima Khan',
      email: 'fatima.khan@email.com',
      phone: '+92-301-2345678',
      totalPurchases: 32000,
      lastPurchase: '2024-01-12',
      status: 'active',
    },
    {
      id: '3',
      name: 'Muhammad Hassan',
      email: 'm.hassan@email.com',
      phone: '+92-302-3456789',
      totalPurchases: 28000,
      lastPurchase: '2024-01-10',
      status: 'active',
    },
    {
      id: '4',
      name: 'Aisha Malik',
      email: 'aisha.malik@email.com',
      phone: '+92-303-4567890',
      totalPurchases: 15000,
      lastPurchase: '2024-01-08',
      status: 'inactive',
    },
    {
      id: '5',
      name: 'Omar Sheikh',
      email: 'omar.sheikh@email.com',
      phone: '+92-304-5678901',
      totalPurchases: 67000,
      lastPurchase: '2024-01-14',
      status: 'active',
    },
  ];

  // Customer analytics data
  const customerGrowthData = [
    { x: 'Jan', y: 45 },
    { x: 'Feb', y: 52 },
    { x: 'Mar', y: 48 },
    { x: 'Apr', y: 61 },
    { x: 'May', y: 55 },
    { x: 'Jun', y: 67 },
  ];

  const customerValueData = [
    { x: 'High Value', y: 25 },
    { x: 'Medium Value', y: 45 },
    { x: 'Low Value', y: 30 },
  ];

  const customerStatusData = [
    { x: 'Active', y: 75 },
    { x: 'Inactive', y: 25 },
  ];

  const renderCustomerItem = ({ item }: { item: Customer }) => (
    <Card style={styles.customerCard} padding="md">
      <View style={styles.customerHeader}>
        <Text style={[styles.customerName, { color: theme.colors.textPrimary }]}>
          {item.name}
        </Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: item.status === 'active' ? theme.colors.success + '20' : theme.colors.error + '20' }
        ]}>
          <Text style={[
            styles.statusText,
            { color: item.status === 'active' ? theme.colors.success : theme.colors.error }
          ]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>
      <Text style={[styles.customerEmail, { color: theme.colors.textSecondary }]}>
        {item.email}
      </Text>
      <Text style={[styles.customerPhone, { color: theme.colors.textSecondary }]}>
        {item.phone}
      </Text>
      <View style={styles.customerFooter}>
        <Text style={[styles.purchaseAmount, { color: theme.colors.primary }]}>
          {formatCurrency(item.totalPurchases)}
        </Text>
        <Text style={[styles.lastPurchase, { color: theme.colors.textTertiary }]}>
          Last: {new Date(item.lastPurchase).toLocaleDateString()}
        </Text>
      </View>
    </Card>
  );

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          Failed to load dashboard data
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
          <View>
            <Text style={[styles.greeting, { color: theme.colors.textPrimary }]}>
              Customer Management
            </Text>
            <Text style={[styles.userName, { color: theme.colors.textPrimary }]}>
              {user?.name}
            </Text>
            <Text style={[styles.userRole, { color: theme.colors.textSecondary }]}>
              {user ? getRoleDisplayName(user.role) : ''}
            </Text>
          </View>
        </View>

        {/* Customer Summary */}
        {dashboardData?.summary && (
          <Card style={styles.summaryCard} padding="lg">
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              Customer Overview
            </Text>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: theme.colors.primary }]}>
                  {formatNumber(customers.length)}
                </Text>
                <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                  Total Customers
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: theme.colors.success }]}>
                  {formatNumber(customers.filter(c => c.status === 'active').length)}
                </Text>
                <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                  Active Customers
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: theme.colors.warning }]}>
                  {formatCurrency(customers.reduce((sum, c) => sum + c.totalPurchases, 0))}
                </Text>
                <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                  Total Sales
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: theme.colors.error }]}>
                  {formatNumber(customers.filter(c => c.status === 'inactive').length)}
                </Text>
                <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                  Inactive Customers
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* Charts Section */}
        <View style={styles.chartsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Customer Analytics
          </Text>
          
          <LineGraph
            title="Customer Growth Trend"
            data={customerGrowthData}
            color={theme.colors.primary}
          />
          
          <BarGraph
            title="Customer Value Distribution"
            data={customerValueData}
            color={theme.colors.success}
          />
          
          <DonutGauge
            title="Customer Status"
            data={customerStatusData}
            colors={[theme.colors.success, theme.colors.error]}
          />
        </View>

        {/* Customer List */}
        <View style={styles.customerSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            All Customers
          </Text>
          <FlatList
            data={customers}
            renderItem={renderCustomerItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Quick Actions */}
        <Card style={styles.quickActionsCard} padding="lg">
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Customer Actions
          </Text>
          <View style={styles.quickActionsGrid}>
            <Button
              title="Add Customer"
              onPress={() => {}}
              variant="outline"
              size="sm"
              style={styles.quickActionButton}
            />
            <Button
              title="Search Customer"
              onPress={() => {}}
              variant="outline"
              size="sm"
              style={styles.quickActionButton}
            />
            <Button
              title="Export Data"
              onPress={() => {}}
              variant="outline"
              size="sm"
              style={styles.quickActionButton}
            />
            <Button
              title="Customer Reports"
              onPress={() => {}}
              variant="outline"
              size="sm"
              style={styles.quickActionButton}
            />
          </View>
        </Card>

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
  greeting: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    marginTop: 2,
  },
  userRole: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginTop: 2,
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
  chartsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  customerSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  customerCard: {
    marginBottom: 12,
  },
  customerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  customerName: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'Poppins-SemiBold',
  },
  customerEmail: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 4,
  },
  customerPhone: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 8,
  },
  customerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  purchaseAmount: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  lastPurchase: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  quickActionsCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: '48%',
    marginBottom: 12,
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
