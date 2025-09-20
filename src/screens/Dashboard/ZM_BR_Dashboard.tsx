import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
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

export const ZM_BR_Dashboard: React.FC = () => {
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

  // Zone/Branch specific data
  const branchSalesData = [
    { x: 'Branch 1', y: 45000 },
    { x: 'Branch 2', y: 38000 },
    { x: 'Branch 3', y: 42000 },
    { x: 'Branch 4', y: 35000 },
  ];

  const dailySalesData = [
    { x: 'Mon', y: 8500 },
    { x: 'Tue', y: 9200 },
    { x: 'Wed', y: 7800 },
    { x: 'Thu', y: 10500 },
    { x: 'Fri', y: 9800 },
    { x: 'Sat', y: 11200 },
    { x: 'Sun', y: 6800 },
  ];

  const productCategoryData = [
    { x: 'Electronics', y: 40 },
    { x: 'Appliances', y: 30 },
    { x: 'Accessories', y: 20 },
    { x: 'Services', y: 10 },
  ];

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
              Zone/Branch Dashboard
            </Text>
            <Text style={[styles.userName, { color: theme.colors.textPrimary }]}>
              {user?.name}
            </Text>
            <Text style={[styles.userRole, { color: theme.colors.textSecondary }]}>
              {user ? getRoleDisplayName(user.role) : ''}
            </Text>
          </View>
        </View>

        {/* Zone/Branch Summary */}
        {dashboardData?.summary && (
          <Card style={styles.summaryCard} padding="lg">
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              Zone/Branch Performance
            </Text>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: theme.colors.primary }]}>
                  {formatCurrency(dashboardData.summary.totalRevenue * 0.2)}
                </Text>
                <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                  Zone Revenue
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: theme.colors.success }]}>
                  {formatNumber(dashboardData.summary.totalCustomers * 0.25)}
                </Text>
                <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                  Zone Customers
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: theme.colors.warning }]}>
                  {formatNumber(dashboardData.summary.totalBranches * 0.3)}
                </Text>
                <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                  Managed Branches
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: theme.colors.error }]}>
                  {formatCurrency(dashboardData.summary.totalDue * 0.2)}
                </Text>
                <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                  Zone Outstanding
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* Charts Section */}
        <View style={styles.chartsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Zone Analytics
          </Text>
          
          <LineGraph
            title="Daily Sales Trend"
            data={dailySalesData}
            color={theme.colors.primary}
          />
          
          <BarGraph
            title="Branch Performance"
            data={branchSalesData}
            color={theme.colors.success}
          />
          
          <DonutGauge
            title="Product Category Sales"
            data={productCategoryData}
            colors={[theme.colors.primary, theme.colors.success, theme.colors.warning, theme.colors.error]}
          />
        </View>

        {/* Quick Actions */}
        <Card style={styles.quickActionsCard} padding="lg">
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Zone Actions
          </Text>
          <View style={styles.quickActionsGrid}>
            <Button
              title="View Branches"
              onPress={() => {}}
              variant="outline"
              size="sm"
              style={styles.quickActionButton}
            />
            <Button
              title="Sales Reports"
              onPress={() => {}}
              variant="outline"
              size="sm"
              style={styles.quickActionButton}
            />
            <Button
              title="Inventory Status"
              onPress={() => {}}
              variant="outline"
              size="sm"
              style={styles.quickActionButton}
            />
            <Button
              title="Staff Performance"
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
