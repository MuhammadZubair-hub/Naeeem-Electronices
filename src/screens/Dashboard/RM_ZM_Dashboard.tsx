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
import { useNavigation } from '@react-navigation/native';
import { RootState, AppDispatch } from '../../redux/store';
import { fetchDashboardData } from '../../redux/slices/dashboardSlice';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { LineGraph } from '../../components/charts/LineGraph';
import { BarGraph } from '../../components/charts/BarGraph';
import { ProgressGraph } from '../../components/charts/ProgressGraph';
import { Role } from '../../types';
import { screenName } from '../../navigation/ScreenName';

const { width } = Dimensions.get('window');

export const RM_ZM_Dashboard: React.FC = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();

  const { user } = useSelector((state: RootState) => state.auth);
  const {
    data: dashboardData,
    isLoading,
    error,
  } = useSelector((state: RootState) => state.dashboard);

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

  // Regional/Zone specific data
  const zonePerformanceData = [
    { x: 'Zone A', y: 85000 },
    { x: 'Zone B', y: 72000 },
    { x: 'Zone C', y: 68000 },
    { x: 'Zone D', y: 59000 },
  ];

  const salesTrendData = [
    { x: 'Week 1', y: 12000 },
    { x: 'Week 2', y: 15000 },
    { x: 'Week 3', y: 18000 },
    { x: 'Week 4', y: 16000 },
  ];

  const customerDistributionData = [
    { x: 'Retail', y: 45 },
    { x: 'Wholesale', y: 35 },
    { x: 'Corporate', y: 20 },
  ];

  if (error) {
    return (
      <View
        style={[
          styles.container,
          styles.centerContent,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          Failed to load dashboard data
        </Text>
        <Button title="Retry" onPress={onRefresh} style={styles.retryButton} />
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
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
            <Text
              style={[styles.greeting, { color: theme.colors.textPrimary }]}
            >
              Regional/Zone Dashboard
            </Text>
            <Text
              style={[styles.userName, { color: theme.colors.textPrimary }]}
            >
              {user?.name}
            </Text>
            <Text
              style={[styles.userRole, { color: theme.colors.textSecondary }]}
            >
              {user ? getRoleDisplayName(user.role) : ''}
            </Text>
          </View>
        </View>

        {/* Regional Summary */}
        {dashboardData?.summary && (
          <Card style={styles.summaryCard} padding="lg">
            <Text
              style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}
            >
              Regional Performance
            </Text>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text
                  style={[styles.summaryValue, { color: theme.colors.primary }]}
                >
                  {formatCurrency(dashboardData.summary.totalRevenue * 0.3)}
                </Text>
                <Text
                  style={[
                    styles.summaryLabel,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  Regional Revenue
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text
                  style={[styles.summaryValue, { color: theme.colors.success }]}
                >
                  {formatNumber(dashboardData.summary.totalCustomers * 0.4)}
                </Text>
                <Text
                  style={[
                    styles.summaryLabel,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  Regional Customers
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text
                  style={[styles.summaryValue, { color: theme.colors.warning }]}
                >
                  {formatNumber(dashboardData.summary.totalBranches * 0.5)}
                </Text>
                <Text
                  style={[
                    styles.summaryLabel,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  Managed Branches
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text
                  style={[styles.summaryValue, { color: theme.colors.error }]}
                >
                  {formatCurrency(dashboardData.summary.totalDue * 0.3)}
                </Text>
                <Text
                  style={[
                    styles.summaryLabel,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  Regional Outstanding
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* Charts Section */}
        <View style={styles.chartsSection}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}
          >
            Regional Analytics
          </Text>

          <LineGraph
            title="Monthly Sales Trend"
            data={salesTrendData}
            color={theme.colors.primary}
          />

          <ProgressGraph
            title="Customer Type Distribution"
            data={customerDistributionData}
            colors={[
              theme.colors.primary,
              theme.colors.success,
              theme.colors.warning,
            ]}
          />
        </View>

        {/* Hierarchical Navigation */}
        <Card style={styles.navigationCard} padding="lg">
          <Text
            style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}
          >
            Navigate Through Hierarchy
          </Text>
          <View style={styles.navigationGrid}>
            <Button
              title="View Regional Branches"
              onPress={() =>
                (navigation as any).navigate(screenName.BranchList)
              }
              variant="primary"
              size="sm"
              style={styles.navigationButton}
            />
            <Button
              title="View Regional Customers"
              onPress={() =>
                (navigation as any).navigate(screenName.CustomerList)
              }
              variant="primary"
              size="sm"
              style={styles.navigationButton}
            />
            <Button
              title="View Regional Sales"
              onPress={() =>
                (navigation as any).navigate(screenName.InvoiceList)
              }
              variant="primary"
              size="sm"
              style={styles.navigationButton}
            />
            <Button
              title="Branch Comparison"
              onPress={() =>
                (navigation as any).navigate(screenName.BranchComparison)
              }
              variant="outline"
              size="sm"
              style={styles.navigationButton}
            />
            <Button
              title="Staff Performance"
              onPress={() =>
                (navigation as any).navigate(screenName.StaffPerformance)
              }
              variant="outline"
              size="sm"
              style={styles.navigationButton}
            />
            <Button
              title="Revenue Trends"
              onPress={() =>
                (navigation as any).navigate(screenName.RevenueTrends)
              }
              variant="outline"
              size="sm"
              style={styles.navigationButton}
            />
          </View>
        </Card>

        {/* Quick Actions */}
        <Card style={styles.quickActionsCard} padding="lg">
          <Text
            style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}
          >
            Regional Actions
          </Text>
          <View style={styles.quickActionsGrid}>
            <Button
              title="Recovery Report"
              onPress={() =>
                (navigation as any).navigate(screenName.RecoveryReport)
              }
              variant="outline"
              size="sm"
              style={styles.quickActionButton}
            />
            <Button
              title="Branch Reports"
              onPress={() =>
                (navigation as any).navigate(screenName.BranchComparison)
              }
              variant="outline"
              size="sm"
              style={styles.quickActionButton}
            />
            <Button
              title="Sales Analysis"
              onPress={() =>
                (navigation as any).navigate(screenName.RevenueTrends)
              }
              variant="outline"
              size="sm"
              style={styles.quickActionButton}
            />
            <Button
              title="Team Performance"
              onPress={() =>
                (navigation as any).navigate(screenName.StaffPerformance)
              }
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
  navigationCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  navigationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  navigationButton: {
    width: '48%',
    marginBottom: 12,
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
