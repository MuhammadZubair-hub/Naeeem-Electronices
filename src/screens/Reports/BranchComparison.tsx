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
import { LineGraph } from '../../components/charts/LineGraph';
import { BarGraph } from '../../components/charts/BarGraph';
import { ProgressGraph } from '../../components/charts/ProgressGraph';
import {
  formatCurrency,
  formatNumber,
  formatDate,
} from '../../utils/formatters';
import { Role } from '../../types';
import { mockDataService, Branch } from '../../services/mock/mockDataService';

const { width } = Dimensions.get('window');

export const BranchComparison: React.FC = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const permissions = usePermissions();

  const { user } = useSelector((state: RootState) => state.auth);
  const {
    data: dashboardData,
    isLoading,
    error,
  } = useSelector((state: RootState) => state.dashboard);

  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<
    'revenue' | 'customers' | 'staff' | 'efficiency'
  >('revenue');

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  useEffect(() => {
    // Get branches based on user role
    let accessibleBranches = mockDataService.getBranches();

    if (user?.role === Role.RM || user?.role === Role.ZM) {
      accessibleBranches = mockDataService.getBranchesByRegion(
        user.regionId || '',
      );
    } else if (user?.role === Role.BR) {
      accessibleBranches = accessibleBranches.filter(
        branch => branch.id === user.branchId,
      );
    }

    setBranches(accessibleBranches);
  }, [user]);

  const onRefresh = () => {
    dispatch(fetchDashboardData());
  };

  const getMetricValue = (branch: Branch, metric: string) => {
    switch (metric) {
      case 'revenue':
        return branch.totalRevenue;
      case 'customers':
        return branch.totalCustomers;
      case 'staff':
        return branch.totalStaff;
      case 'efficiency':
        return Math.round(branch.totalRevenue / branch.totalStaff / 1000); // Revenue per staff in thousands
      default:
        return 0;
    }
  };

  const getMetricLabel = (metric: string) => {
    switch (metric) {
      case 'revenue':
        return 'Revenue (PKR)';
      case 'customers':
        return 'Customers';
      case 'staff':
        return 'Staff Members';
      case 'efficiency':
        return 'Efficiency (PKR/Staff)';
      default:
        return '';
    }
  };

  const getMetricFormat = (metric: string) => {
    switch (metric) {
      case 'revenue':
        return 'currency';
      case 'customers':
        return 'number';
      case 'staff':
        return 'number';
      case 'efficiency':
        return 'currency';
      default:
        return 'number';
    }
  };

  const formatMetricValue = (value: number, metric: string) => {
    const format = getMetricFormat(metric);
    if (format === 'currency') {
      return formatCurrency(value);
    }
    return formatNumber(value);
  };

  const getSortedBranches = () => {
    return [...branches].sort(
      (a, b) =>
        getMetricValue(b, selectedMetric) - getMetricValue(a, selectedMetric),
    );
  };

  const getChartData = () => {
    const sortedBranches = getSortedBranches().slice(0, 5); // Top 5 branches
    return sortedBranches.map(branch => ({
      label: branch.name.split(' ')[0], // For BarGraph
      value: getMetricValue(branch, selectedMetric),
    }));
  };

  const getRevenueTrendData = () => {
    // Mock trend data for the last 6 months
    return [
      { x: 'Jan', y: 1200000 },
      { x: 'Feb', y: 1350000 },
      { x: 'Mar', y: 1280000 },
      { x: 'Apr', y: 1420000 },
      { x: 'May', y: 1380000 },
      { x: 'Jun', y: 1500000 },
    ];
  };

  const getBranchDistributionData = () => {
    const totalRevenue = branches.reduce(
      (sum, branch) => sum + branch.totalRevenue,
      0,
    );
    return branches.slice(0, 4).map(branch => ({
      x: branch.name.split(' ')[0],
      y: totalRevenue > 0 ? branch.totalRevenue / totalRevenue : 0, // value as fraction 0-1
    }));
  };

  const renderBranchCard = (branch: Branch, index: number) => {
    const value = getMetricValue(branch, selectedMetric);
    const isTopPerformer = index === 0;

    return (
      <Card key={branch.id} style={styles.branchCard} padding="lg">
        <View style={styles.branchHeader}>
          <View style={styles.branchInfo}>
            <Text
              style={[styles.branchName, { color: theme.colors.textPrimary }]}
            >
              {branch.name}
            </Text>
            <Text
              style={[
                styles.branchAddress,
                { color: theme.colors.textSecondary },
              ]}
            >
              📍 {branch.address}
            </Text>
            <Text
              style={[
                styles.branchManager,
                { color: theme.colors.textSecondary },
              ]}
            >
              👤 {branch.managerName}
            </Text>
          </View>
          {isTopPerformer && (
            <View
              style={[
                styles.topPerformerBadge,
                { backgroundColor: theme.colors.success + '20' },
              ]}
            >
              <Text
                style={[
                  styles.topPerformerText,
                  { color: theme.colors.success },
                ]}
              >
                🏆 #1
              </Text>
            </View>
          )}
        </View>

        <View style={styles.branchMetrics}>
          <View style={styles.metricItem}>
            <Text style={[styles.metricValue, { color: theme.colors.primary }]}>
              {formatMetricValue(value, selectedMetric)}
            </Text>
            <Text
              style={[
                styles.metricLabel,
                { color: theme.colors.textSecondary },
              ]}
            >
              {getMetricLabel(selectedMetric)}
            </Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={[styles.metricValue, { color: theme.colors.success }]}>
              {formatCurrency(branch.totalRevenue)}
            </Text>
            <Text
              style={[
                styles.metricLabel,
                { color: theme.colors.textSecondary },
              ]}
            >
              Total Revenue
            </Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={[styles.metricValue, { color: theme.colors.warning }]}>
              {formatNumber(branch.totalCustomers)}
            </Text>
            <Text
              style={[
                styles.metricLabel,
                { color: theme.colors.textSecondary },
              ]}
            >
              Customers
            </Text>
          </View>
        </View>
      </Card>
    );
  };

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
          Failed to load comparison data
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
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            Branch Comparison
          </Text>
          <Text
            style={[styles.subtitle, { color: theme.colors.textSecondary }]}
          >
            Performance Analysis Across Branches
          </Text>
        </View>

        {/* Metric Selector */}
        <Card style={styles.metricCard} padding="lg">
          <Text
            style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}
          >
            Compare By
          </Text>
          <View style={styles.metricButtons}>
            {[
              { key: 'revenue', label: 'Revenue' },
              { key: 'customers', label: 'Customers' },
              { key: 'staff', label: 'Staff' },
              { key: 'efficiency', label: 'Efficiency' },
            ].map(metric => (
              <TouchableOpacity
                key={metric.key}
                onPress={() => setSelectedMetric(metric.key as any)}
                style={[
                  styles.metricButton,
                  {
                    backgroundColor:
                      selectedMetric === metric.key
                        ? theme.colors.primary
                        : theme.colors.surfaceVariant,
                    borderColor:
                      selectedMetric === metric.key
                        ? theme.colors.primary
                        : theme.colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.metricButtonText,
                    {
                      color:
                        selectedMetric === metric.key
                          ? theme.colors.white
                          : theme.colors.textPrimary,
                    },
                  ]}
                >
                  {metric.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Summary Stats */}
        <Card style={styles.summaryCard} padding="lg">
          <Text
            style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}
          >
            Summary Statistics
          </Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text
                style={[styles.summaryValue, { color: theme.colors.primary }]}
              >
                {formatNumber(branches.length)}
              </Text>
              <Text
                style={[
                  styles.summaryLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Total Branches
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text
                style={[styles.summaryValue, { color: theme.colors.success }]}
              >
                {formatCurrency(
                  branches.reduce(
                    (sum, branch) => sum + branch.totalRevenue,
                    0,
                  ),
                )}
              </Text>
              <Text
                style={[
                  styles.summaryLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Total Revenue
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text
                style={[styles.summaryValue, { color: theme.colors.warning }]}
              >
                {formatNumber(
                  branches.reduce(
                    (sum, branch) => sum + branch.totalCustomers,
                    0,
                  ),
                )}
              </Text>
              <Text
                style={[
                  styles.summaryLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Total Customers
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text
                style={[styles.summaryValue, { color: theme.colors.error }]}
              >
                {formatNumber(
                  branches.reduce((sum, branch) => sum + branch.totalStaff, 0),
                )}
              </Text>
              <Text
                style={[
                  styles.summaryLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Total Staff
              </Text>
            </View>
          </View>
        </Card>

        {/* Charts */}
        <View style={styles.chartsSection}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}
          >
            Performance Charts
          </Text>

          <BarGraph
            title={`Top 5 Branches by ${getMetricLabel(selectedMetric)}`}
            data={getChartData()}
          />

          <LineGraph
            title="Revenue Trend (6 Months)"
            data={getRevenueTrendData()}
            color={theme.colors.success}
          />

          <ProgressGraph
            title="Branch Revenue Distribution"
            data={getBranchDistributionData()}
            colors={[
              theme.colors.primary,
              theme.colors.success,
              theme.colors.warning,
              theme.colors.error,
            ]}
          />
        </View>

        {/* Branch Rankings */}
        <View style={styles.rankingsSection}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}
          >
            Branch Rankings by {getMetricLabel(selectedMetric)}
          </Text>
          {getSortedBranches().map((branch, index) =>
            renderBranchCard(branch, index),
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
  metricCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
  },
  metricButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metricButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  metricButtonText: {
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
  rankingsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  branchCard: {
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  branchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  branchInfo: {
    flex: 1,
  },
  branchName: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 4,
  },
  branchAddress: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 2,
  },
  branchManager: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  topPerformerBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  topPerformerText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  branchMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
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
