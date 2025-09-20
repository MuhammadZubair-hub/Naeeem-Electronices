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
import { DonutGauge } from '../../components/charts/ProgressGraph';
import { formatCurrency, formatNumber, formatDate } from '../../utils/formatters';
import { Role } from '../../types';
import { mockDataService } from '../../services/mock/mockDataService';

const { width } = Dimensions.get('window');

export const RevenueTrends: React.FC = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const permissions = usePermissions();
  
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: dashboardData, isLoading, error } = useSelector((state: RootState) => state.dashboard);

  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'customers' | 'transactions'>('revenue');

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  const onRefresh = () => {
    dispatch(fetchDashboardData());
  };

  const getRevenueTrendData = () => {
    switch (selectedPeriod) {
      case 'daily':
        return [
          { x: 'Mon', y: 45000 },
          { x: 'Tue', y: 52000 },
          { x: 'Wed', y: 48000 },
          { x: 'Thu', y: 55000 },
          { x: 'Fri', y: 60000 },
          { x: 'Sat', y: 65000 },
          { x: 'Sun', y: 40000 },
        ];
      case 'weekly':
        return [
          { x: 'Week 1', y: 320000 },
          { x: 'Week 2', y: 380000 },
          { x: 'Week 3', y: 350000 },
          { x: 'Week 4', y: 420000 },
        ];
      case 'monthly':
        return [
          { x: 'Jan', y: 1200000 },
          { x: 'Feb', y: 1350000 },
          { x: 'Mar', y: 1280000 },
          { x: 'Apr', y: 1420000 },
          { x: 'May', y: 1380000 },
          { x: 'Jun', y: 1500000 },
        ];
      case 'yearly':
        return [
          { x: '2020', y: 12000000 },
          { x: '2021', y: 13500000 },
          { x: '2022', y: 14200000 },
          { x: '2023', y: 15800000 },
          { x: '2024', y: 16500000 },
        ];
      default:
        return [];
    }
  };

  const getCustomerTrendData = () => {
    switch (selectedPeriod) {
      case 'daily':
        return [
          { x: 'Mon', y: 25 },
          { x: 'Tue', y: 32 },
          { x: 'Wed', y: 28 },
          { x: 'Thu', y: 35 },
          { x: 'Fri', y: 42 },
          { x: 'Sat', y: 48 },
          { x: 'Sun', y: 22 },
        ];
      case 'weekly':
        return [
          { x: 'Week 1', y: 180 },
          { x: 'Week 2', y: 220 },
          { x: 'Week 3', y: 195 },
          { x: 'Week 4', y: 240 },
        ];
      case 'monthly':
        return [
          { x: 'Jan', y: 750 },
          { x: 'Feb', y: 820 },
          { x: 'Mar', y: 780 },
          { x: 'Apr', y: 890 },
          { x: 'May', y: 850 },
          { x: 'Jun', y: 920 },
        ];
      case 'yearly':
        return [
          { x: '2020', y: 8500 },
          { x: '2021', y: 9200 },
          { x: '2022', y: 9800 },
          { x: '2023', y: 10500 },
          { x: '2024', y: 11200 },
        ];
      default:
        return [];
    }
  };

  const getTransactionTrendData = () => {
    switch (selectedPeriod) {
      case 'daily':
        return [
          { x: 'Mon', y: 45 },
          { x: 'Tue', y: 52 },
          { x: 'Wed', y: 48 },
          { x: 'Thu', y: 55 },
          { x: 'Fri', y: 60 },
          { x: 'Sat', y: 65 },
          { x: 'Sun', y: 40 },
        ];
      case 'weekly':
        return [
          { x: 'Week 1', y: 320 },
          { x: 'Week 2', y: 380 },
          { x: 'Week 3', y: 350 },
          { x: 'Week 4', y: 420 },
        ];
      case 'monthly':
        return [
          { x: 'Jan', y: 1200 },
          { x: 'Feb', y: 1350 },
          { x: 'Mar', y: 1280 },
          { x: 'Apr', y: 1420 },
          { x: 'May', y: 1380 },
          { x: 'Jun', y: 1500 },
        ];
      case 'yearly':
        return [
          { x: '2020', y: 12000 },
          { x: '2021', y: 13500 },
          { x: '2022', y: 14200 },
          { x: '2023', y: 15800 },
          { x: '2024', y: 16500 },
        ];
      default:
        return [];
    }
  };

  const getCurrentData = () => {
    switch (selectedMetric) {
      case 'revenue': return getRevenueTrendData();
      case 'customers': return getCustomerTrendData();
      case 'transactions': return getTransactionTrendData();
      default: return [];
    }
  };

  const getMetricLabel = () => {
    switch (selectedMetric) {
      case 'revenue': return 'Revenue (PKR)';
      case 'customers': return 'New Customers';
      case 'transactions': return 'Transactions';
      default: return '';
    }
  };

  const getRevenueByBranchData = () => {
    const branches = mockDataService.getBranches();
    return branches.slice(0, 5).map(branch => ({
      x: branch.name.split(' ')[0],
      y: branch.totalRevenue,
    }));
  };

  const getRevenueByRegionData = () => {
    const regions = [
      { name: 'Karachi', revenue: 850000 },
      { name: 'Lahore', revenue: 720000 },
      { name: 'Islamabad', revenue: 580000 },
      { name: 'Other', revenue: 450000 },
    ];
    return regions.map(region => ({
      x: region.name,
      y: region.revenue,
    }));
  };

  const getPaymentMethodData = () => {
    return [
      { x: 'Cash', y: 35 },
      { x: 'Card', y: 40 },
      { x: 'Bank Transfer', y: 20 },
      { x: 'Cheque', y: 5 },
    ];
  };

  const getPeriodButtonStyle = (period: string) => {
    const isSelected = selectedPeriod === period;
    return {
      backgroundColor: isSelected ? theme.colors.primary : theme.colors.surfaceVariant,
      borderColor: isSelected ? theme.colors.primary : theme.colors.border,
    };
  };

  const getPeriodButtonTextStyle = (period: string) => {
    const isSelected = selectedPeriod === period;
    return {
      color: isSelected ? theme.colors.white : theme.colors.textPrimary,
    };
  };

  const getMetricButtonStyle = (metric: string) => {
    const isSelected = selectedMetric === metric;
    return {
      backgroundColor: isSelected ? theme.colors.primary : theme.colors.surfaceVariant,
      borderColor: isSelected ? theme.colors.primary : theme.colors.border,
    };
  };

  const getMetricButtonTextStyle = (metric: string) => {
    const isSelected = selectedMetric === metric;
    return {
      color: isSelected ? theme.colors.white : theme.colors.textPrimary,
    };
  };

  const getCurrentTotal = () => {
    const data = getCurrentData();
    return data.reduce((sum, item) => sum + item.y, 0);
  };

  const getGrowthRate = () => {
    const data = getCurrentData();
    if (data.length < 2) return 0;
    const current = data[data.length - 1].y;
    const previous = data[data.length - 2].y;
    return ((current - previous) / previous) * 100;
  };

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          Failed to load revenue trends data
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
            Revenue Trends
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Financial Performance Analysis
          </Text>
        </View>

        {/* Period Selector */}
        <Card style={styles.periodCard} padding="lg">
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Time Period
          </Text>
          <View style={styles.periodButtons}>
            {['daily', 'weekly', 'monthly', 'yearly'].map((period) => (
              <TouchableOpacity
                key={period}
                onPress={() => setSelectedPeriod(period as any)}
                style={[styles.periodButton, getPeriodButtonStyle(period)]}
              >
                <Text style={[styles.periodButtonText, getPeriodButtonTextStyle(period)]}>
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Metric Selector */}
        <Card style={styles.metricCard} padding="lg">
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Metric
          </Text>
          <View style={styles.metricButtons}>
            {[
              { key: 'revenue', label: 'Revenue' },
              { key: 'customers', label: 'Customers' },
              { key: 'transactions', label: 'Transactions' },
            ].map((metric) => (
              <TouchableOpacity
                key={metric.key}
                onPress={() => setSelectedMetric(metric.key as any)}
                style={[styles.metricButton, getMetricButtonStyle(metric.key)]}
              >
                <Text style={[styles.metricButtonText, getMetricButtonTextStyle(metric.key)]}>
                  {metric.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Summary Stats */}
        <Card style={styles.summaryCard} padding="lg">
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            {getMetricLabel()} Summary
          </Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: theme.colors.primary }]}>
                {selectedMetric === 'revenue' ? formatCurrency(getCurrentTotal()) : formatNumber(getCurrentTotal())}
              </Text>
              <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                Total {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[
                styles.summaryValue,
                { color: getGrowthRate() >= 0 ? theme.colors.success : theme.colors.error }
              ]}>
                {getGrowthRate() >= 0 ? '+' : ''}{getGrowthRate().toFixed(1)}%
              </Text>
              <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                Growth Rate
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: theme.colors.warning }]}>
                {formatNumber(getCurrentData().length)}
              </Text>
              <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                Data Points
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: theme.colors.error }]}>
                {selectedMetric === 'revenue' ? formatCurrency(getCurrentTotal() / getCurrentData().length) : formatNumber(getCurrentTotal() / getCurrentData().length)}
              </Text>
              <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                Average
              </Text>
            </View>
          </View>
        </Card>

        {/* Main Trend Chart */}
        <Card style={styles.trendCard} padding="lg">
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            {getMetricLabel()} Trend
          </Text>
          <LineGraph
            title={`${getMetricLabel()} Over Time`}
            data={getCurrentData()}
            color={theme.colors.primary}
          />
        </Card>

        {/* Additional Charts */}
        <View style={styles.chartsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Additional Analytics
          </Text>
          
          <BarGraph
            title="Revenue by Branch"
            data={getRevenueByBranchData()}
            color={theme.colors.success}
          />
          
          <BarGraph
            title="Revenue by Region"
            data={getRevenueByRegionData()}
            color={theme.colors.warning}
          />
          
          <DonutGauge
            title="Payment Method Distribution"
            data={getPaymentMethodData()}
            colors={[theme.colors.primary, theme.colors.success, theme.colors.warning, theme.colors.error]}
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
  periodCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
  },
  periodButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  periodButtonText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  metricCard: {
    marginHorizontal: 20,
    marginBottom: 20,
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
  trendCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  chartsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
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
