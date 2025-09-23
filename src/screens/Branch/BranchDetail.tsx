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
import {
  formatCurrency,
  formatNumber,
  formatDate,
} from '../../utils/formatters';
import { Role } from '../../types';
import { screenName } from '../../navigation/ScreenName';
import { Header } from '../../components/common/Header';
import { AVOsList } from '../AVOs/AVOsList';
import { AppSizes } from '../../utils/AppSizes';

const { width } = Dimensions.get('window');

interface BranchDetailProps {
  route: {
    params: {
      branchId: string;
    };
  };
}

interface Branch {
  id: string;
  name: string;
  address: string;
  regionId: string;
  zoneId: string;
  managerId: string;
  managerName: string;
  totalRevenue: number;
  totalCustomers: number;
  totalStaff: number;
  isActive: boolean;
  createdAt: string;
  phone: string;
  email: string;
  openingHours: string;
  services: string[];
}

interface StaffMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  joinDate: string;
  performance: number;
}

export const BranchDetail: React.FC<BranchDetailProps> = ({ route }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const permissions = usePermissions();

  const { user } = useSelector((state: RootState) => state.auth);
  const {
    data: dashboardData,
    isLoading,
    error,
  } = useSelector((state: RootState) => state.dashboard);

  const { branchId } = route.params;
  console.log('branchId issss', branchId);
  const [branch, setBranch] = useState<Branch | null>(null);
  const [staff, setStaff] = useState<StaffMember[]>([]);

  // Mock branch data
  const branches: Branch[] = [
    {
      id: 'branch-1',
      name: 'Karachi Central Branch',
      address: 'Gulshan-e-Iqbal, Karachi',
      regionId: 'region-1',
      zoneId: 'zone-1',
      managerId: 'user-5',
      managerName: 'Omar Sheikh',
      totalRevenue: 450000,
      totalCustomers: 125,
      totalStaff: 8,
      isActive: true,
      createdAt: '2023-01-15T00:00:00Z',
      phone: '+92-21-1234567',
      email: 'karachi@naeemelectronics.com',
      openingHours: '9:00 AM - 9:00 PM',
      services: ['Sales', 'Service', 'Installation', 'Warranty'],
    },
    {
      id: 'branch-4',
      name: 'Lahore Main Branch',
      address: 'Gulberg, Lahore',
      regionId: 'region-1',
      zoneId: 'zone-2',
      managerId: 'user-6',
      managerName: 'Aisha Malik',
      totalRevenue: 380000,
      totalCustomers: 98,
      totalStaff: 6,
      isActive: true,
      createdAt: '2023-02-20T00:00:00Z',
      phone: '+92-42-2345678',
      email: 'lahore@naeemelectronics.com',
      openingHours: '9:00 AM - 9:00 PM',
      services: ['Sales', 'Service', 'Installation'],
    },
  ];

  // Mock staff data
  const allStaff: StaffMember[] = [
    {
      id: 'staff-1',
      name: 'Omar Sheikh',
      role: 'Branch Manager',
      email: 'omar@naeemelectronics.com',
      phone: '+92-300-1111111',
      joinDate: '2023-01-15T00:00:00Z',
      performance: 95,
    },
    {
      id: 'staff-2',
      name: 'Ahmed Ali',
      role: 'Sales Officer',
      email: 'ahmed@naeemelectronics.com',
      phone: '+92-300-2222222',
      joinDate: '2023-02-01T00:00:00Z',
      performance: 88,
    },
    {
      id: 'staff-3',
      name: 'Fatima Khan',
      role: 'Service Technician',
      email: 'fatima@naeemelectronics.com',
      phone: '+92-300-3333333',
      joinDate: '2023-03-15T00:00:00Z',
      performance: 92,
    },
    {
      id: 'staff-4',
      name: 'Hassan Raza',
      role: 'Cashier',
      email: 'hassan@naeemelectronics.com',
      phone: '+92-300-4444444',
      joinDate: '2023-04-01T00:00:00Z',
      performance: 85,
    },
  ];

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  useEffect(() => {
    // Find branch by ID
    const foundBranch = branches.find(b => b.id === branchId);
    if (foundBranch) {
      setBranch(foundBranch);
      // Filter staff for this branch (mock data)
      setStaff(allStaff);
    }
  }, [branchId]);

  const onRefresh = () => {
    dispatch(fetchDashboardData());
  };

  const handleEditBranch = () => {
    Alert.alert(
      'Edit Branch',
      'Branch editing functionality will be implemented soon.',
    );
  };

  const handleViewStaff = () => {
    Alert.alert(
      'Staff Management',
      'Staff management functionality will be implemented soon.',
    );
  };

  const handleViewCustomers = () => {
    (navigation as any).navigate(screenName.CustomerList, { branchId });
  };

  const handleViewSales = () => {
    (navigation as any).navigate(screenName.InvoiceList, { branchId });
  };

  // Chart data
  const revenueTrendData = [
    { x: 'Jan', y: 35000 },
    { x: 'Feb', y: 42000 },
    { x: 'Mar', y: 38000 },
    { x: 'Apr', y: 45000 },
    { x: 'May', y: 48000 },
    { x: 'Jun', y: 52000 },
  ];

  const staffPerformanceData = [
    { x: 'Omar', y: 95 },
    { x: 'Ahmed', y: 88 },
    { x: 'Fatima', y: 92 },
    { x: 'Hassan', y: 85 },
  ];

  const serviceDistributionData = [
    { x: 'Sales', y: 60 },
    { x: 'Service', y: 25 },
    { x: 'Installation', y: 15 },
  ];

  const revenueData = [
    { label: 'Karachi', value: 125000 },
    { label: 'Lahore', value: 98000 },
    { label: 'Islamabad', value: 87000 },
    { label: 'Faisalabad', value: 76000 },
    { label: 'Rawalpindi', value: 65000 },
  ];

  if (!branch) {
    return (
      <View
        style={[
          styles.container,
          styles.centerContent,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          Branch not found
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
      <View
        style={[
          styles.container,
          styles.centerContent,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          Failed to load branch data
        </Text>
        <Button title="Retry" onPress={onRefresh} style={styles.retryButton} />
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Header title={branch?.name} subtitle="Branch Details" showBackButton />

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={[styles.backText, { color: theme.colors.primary }]}>
              ← Back
            </Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            {branch.name}
          </Text>
          <TouchableOpacity
            onPress={handleEditBranch}
            style={styles.editButton}
          >
            <Text style={[styles.editText, { color: theme.colors.primary }]}>
              Edit
            </Text>
          </TouchableOpacity>
        </View> */}

        {/* Branch Info */}
        <Card style={styles.infoCard} padding="lg">
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
                👤 Manager: {branch.managerName}
              </Text>
              <Text
                style={[
                  styles.branchPhone,
                  { color: theme.colors.textSecondary },
                ]}
              >
                📞 {branch.phone}
              </Text>
              <Text
                style={[
                  styles.branchEmail,
                  { color: theme.colors.textSecondary },
                ]}
              >
                ✉️ {branch.email}
              </Text>
              <Text
                style={[
                  styles.branchHours,
                  { color: theme.colors.textSecondary },
                ]}
              >
                🕒 {branch.openingHours}
              </Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: branch.isActive
                    ? theme.colors.success + '20'
                    : theme.colors.error + '20',
                },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  {
                    color: branch.isActive
                      ? theme.colors.success
                      : theme.colors.error,
                  },
                ]}
              >
                {branch.isActive ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>

          <View style={styles.branchStats}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                {formatCurrency(branch.totalRevenue)}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Total Revenue
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.success }]}>
                {formatNumber(branch.totalCustomers)}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Customers
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.warning }]}>
                {formatNumber(branch.totalStaff)}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Staff Members
              </Text>
            </View>
          </View>
        </Card>

        <Card style={styles.servicesCard} padding="lg">
          <Text
            style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}
          >
            AVOs
          </Text>
          <AVOsList />
        </Card>

        {/* Services */}
        <Card style={styles.servicesCard} padding="lg">
          <Text
            style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}
          >
            Services Offered
          </Text>
          <View style={styles.servicesList}>
            {branch.services.map((service, index) => (
              <View
                key={index}
                style={[
                  styles.serviceItem,
                  { backgroundColor: theme.colors.surfaceVariant },
                ]}
              >
                <Text
                  style={[
                    styles.serviceText,
                    { color: theme.colors.textPrimary },
                  ]}
                >
                  {service}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Charts */}
        <View style={styles.chartsSection}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}
          >
            Performance Analytics
          </Text>

          <LineGraph
            title="Monthly Revenue Trend"
            data={revenueTrendData}
            color={theme.colors.primary}
          />

          <BarGraph title="Branch Revenue" data={revenueData} height={250} />
        </View>

        {/* Quick Actions */}
        <Card style={styles.actionsCard} padding="lg">
          <Text
            style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}
          >
            Quick Actions
          </Text>
          <View style={styles.actionsGrid}>
            <Button
              title="View Staff"
              onPress={handleViewStaff}
              variant="outline"
              size="sm"
              style={styles.actionButton}
            />
            <Button
              title="View Customers"
              onPress={handleViewCustomers}
              variant="outline"
              size="sm"
              style={styles.actionButton}
            />
            <Button
              title="View Sales"
              onPress={handleViewSales}
              variant="outline"
              size="sm"
              style={styles.actionButton}
            />
            <Button
              title="Performance Report"
              onPress={() =>
                (navigation as any).navigate(screenName.BranchPerformance, {
                  branchId,
                })
              }
              variant="outline"
              size="sm"
              style={styles.actionButton}
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
    // paddingTop: 20,
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
  branchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  branchInfo: {
    flex: 1,
  },
  branchName: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    marginBottom: 8,
  },
  branchAddress: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 4,
  },
  branchManager: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 4,
  },
  branchPhone: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 4,
  },
  branchEmail: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 4,
  },
  branchHours: {
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
  branchStats: {
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
  servicesCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
  },
  servicesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  serviceItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  serviceText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  chartsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  actionsCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
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
