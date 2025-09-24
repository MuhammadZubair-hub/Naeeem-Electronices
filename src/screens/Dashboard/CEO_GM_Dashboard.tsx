import React, { useEffect } from 'react';
import { BackHandler, Switch } from 'react-native';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../redux/slices/themeSlice';
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
import MainHeader from '../../components/common/MainHeader';
import { PieGraph } from '../../components/charts/PieGraph';
import App from 'App';
import { AppSizes } from '../../utils/AppSizes';
import { RegionList } from '../Regions/RegionList';
import { API_Config } from '../../services/apiServices';
import { fonts } from '../../assets/fonts/Fonts';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export const CEO_GM_Dashboard: React.FC = () => {
  const { theme, isDarkMode } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();

  const [regionsData, setRegionsData] = React.useState<any>([]);
  const [regionsCountData, setRegionsCountData] = React.useState<{
    totalCount: string;
    dueCount: string;
    paidCount: string;
  }>({
    totalCount: '',
    dueCount: '',
    paidCount: '',
  });

  const { user } = useSelector((state: RootState) => state.auth);
  const {
    data: dashboardData,
    isLoading,
    error,
  } = useSelector((state: RootState) => state.dashboard);

  const Id = useSelector((state: RootState) => state.auth.user?.empId);

  useEffect(() => {
    getAllRegions();
    getAllRegionsCount();
  }, [Id,]);

  useEffect(()=>{},[])

  const getAllRegionsCount = async () => {
    try {
      console.log('user id is: ', Id);
      const response = await API_Config.getRegionCount({ obj: Id });
      console.log('Regions API Response:', response);
      if (response?.success) {
        const data = response.data.data;
        setRegionsCountData(pre => ({
          ...pre,
          totalCount: data.instTotalAmount,
          dueCount: data.instDueAmount,
          paidCount: data.instRecAmount,
        }));
        console.log('Regions data:', response.data.data);
      }
    } catch (error) {
      console.error('Error fetching regions:', error);
    } finally {
      // setIsLoading(false);
    }
  };

  const getAllRegions = async () => {
    try {
      console.log('user id is: ', Id);
      const response = await API_Config.getRegions({ obj: Id });
      console.log('Regions API Response:', response);
      if (response?.success) {
        setRegionsData(response.data.data);
        console.log('Regions data:', response.data.data);
      }
    } catch (error) {
      console.error('Error fetching regions:', error);
    } finally {
      // setIsLoading(false);
    }
  };

  // useEffect(() => {
  //   dispatch(fetchDashboardData());
  // }, [dispatch]);

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

  // Sample data for charts
  const revenueTrendData = [
    { x: 'Mon', y: 45000 },
    { x: 'Tue', y: 52000 },
    { x: 'Wed', y: 48000 },
    { x: 'Thu', y: 61000 },
    { x: 'Fri', y: 55000 },
    { x: 'Sat', y: 67000 },
    { x: 'Sun', y: 58000 },
  ];

  const branchPerformanceData = [
    { x: 'Karachi', y: 125000 },
    { x: 'Lahore', y: 98000 },
    { x: 'Islamabad', y: 87000 },
    { x: 'Faisalabad', y: 76000 },
    { x: 'Rawalpindi', y: 65000 },
  ];

  const PieGraphData = [
    {
      name: 'Seoul',
      population: 21500000,
      color: 'rgba(131, 167, 234, 1)',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Toronto',
      population: 2800000,
      color: '#F00',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Beijing',
      population: 527612,
      color: 'red',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'New York',
      population: 8538000,
      color: '#ffffff',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Moscow',
      population: 11920000,
      color: 'rgb(0, 0, 255)',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
  ];

  const salesByRegion = [
    { name: 'North', population: 40, color: '#10B981' },
    { name: 'South', population: 30, color: '#3B82F6' },
    { name: 'East', population: 20, color: '#F59E0B' },
    { name: 'West', population: 10, color: '#EF4444' },
  ];
  const progressData = [
    { x: 'Completed', y: 0.6 },
    { x: 'Pending', y: 0.25 },
    { x: 'Failed', y: 0.15 },
  ];

  const revenueData = [
    { label: 'Karachi', value: 125000 },
    { label: 'Lahore', value: 98000 },
    { label: 'Islamabad', value: 87000 },
    { label: 'Faisalabad', value: 76000 },
    { label: 'Rawalpindi', value: 65000 },
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

  useEffect(() => {
    const backAction = () => {
      return true; // returning true disables back action
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaView
      edges={['top']}
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

        <MainHeader title="Executive Dashboard" />
        <Text>Paid: {regionsCountData.paidCount}</Text>
        <PieGraph title="Sales by Region" />

        {/* Executive Summary */}
        {/* {dashboardData?.summary && (
          <Card style={styles.summaryCard} padding="lg">
            <Text
              style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}
            >
              Executive Summary
            </Text>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text
                  style={[styles.summaryValue, { color: theme.colors.primary }]}
                >
                  {formatCurrency(dashboardData.summary.totalRevenue)}
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
                  style={[styles.summaryValue, { color: theme.colors.success }]}
                >
                  {formatNumber(dashboardData.summary.totalCustomers)}
                </Text>
                <Text
                  style={[
                    styles.summaryLabel,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  Active Customers
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text
                  style={[styles.summaryValue, { color: theme.colors.warning }]}
                >
                  {formatNumber(dashboardData.summary.totalBranches)}
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
                  style={[styles.summaryValue, { color: theme.colors.error }]}
                >
                  {formatCurrency(dashboardData.summary.totalDue)}
                </Text>
                <Text
                  style={[
                    styles.summaryLabel,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  Outstanding Amount
                </Text>
              </View>
            </View>
          </Card>
        )} */}

        {/* Charts Section */}
        {/* <View style={styles.chartsSection}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}
          >
            Performance Analytics
          </Text>

          <LineGraph
            title="Weekly Revenue Trends"
            data={revenueTrendData}
            // color={theme.colors.primary}
          />


          <BarGraph title="Branch Revenue" data={revenueData} height={250} />
        </View> */}

        {/* Hierarchical Navigation */}
        {/* <Card style={styles.navigationCard} padding="lg">
          <Text
            style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}
          >
            Navigate Through Hierarchy
          </Text>
          <View style={styles.navigationGrid}>
            <Button
              title="View All Branches"
              onPress={() =>
                (navigation as any).navigate(screenName.BranchList)
              }
              variant="primary"
              size="sm"
              style={styles.navigationButton}
            />
            <Button
              title="View All Customers"
              onPress={() =>
                (navigation as any).navigate(screenName.CustomerList)
              }
              variant="primary"
              size="sm"
              style={styles.navigationButton}
            />
            <Button
              title="View All Sales"
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
            <Button
              title="All Regions"
              onPress={() =>
                (navigation as any).navigate(screenName.RegionList)
              }
              variant="outline"
              size="sm"
              style={styles.navigationButton}
            />
          </View>
        </Card> */}

        <Card style={styles.navigationCard} padding="md">
          <Text
            style={[
              styles.sectionTitle,
              {
                color: theme.colors.secondary,
                fontSize: AppSizes.Font_20,
                fontFamily: fonts.bold,
              },
            ]}
          >
            All Regions
          </Text>
          <View
            style={{ borderWidth: 0.5, borderTopColor: theme.colors.secondary }}
          ></View>
          <RegionList data={regionsData} />
        </Card>

        {/* Quick Actions */}
        {/* <Card style={styles.quickActionsCard} padding="lg">
          <Text
            style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}
          >
            Executive Actions
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
              title="Financial Reports"
              onPress={() =>
                (navigation as any).navigate(screenName.RevenueTrends)
              }
              variant="outline"
              size="sm"
              style={styles.quickActionButton}
            />
            <Button
              title="Branch Analysis"
              onPress={() =>
                (navigation as any).navigate(screenName.BranchComparison)
              }
              variant="outline"
              size="sm"
              style={styles.quickActionButton}
            />
            <Button
              title="Customer Insights"
              onPress={() =>
                (navigation as any).navigate(screenName.CustomerList)
              }
              variant="outline"
              size="sm"
              style={styles.quickActionButton}
            />
          </View>
        </Card>  */}

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
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
    marginBottom: 70,
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
    marginBottom: AppSizes.Margin_Vertical_40,
  },
});
