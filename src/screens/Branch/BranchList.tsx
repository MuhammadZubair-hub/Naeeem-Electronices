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
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { RootState, AppDispatch } from '../../redux/store';
import { fetchDashboardData } from '../../redux/slices/dashboardSlice';
import { useTheme } from '../../hooks/useTheme';
import { usePermissions } from '../../hooks/usePermissions';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { InputField } from '../../components/common/InputField';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import { Role } from '../../types';
import { mockDataService, Branch } from '../../services/mock/mockDataService';
import { screenName } from '../../navigation/ScreenName';
import { Header } from '../../components/common/Header';

const { width } = Dimensions.get('window');

// Branch interface is now imported from mockDataService

export const BranchList: React.FC = () => {
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

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBranches, setFilteredBranches] = useState<Branch[]>([]);

  // Get branches from mock data service
  const branches = mockDataService.getBranches();

  useFocusEffect(
    React.useCallback(() => {
      console.log('user?.role', user);
      console.log(user.designation, 'user?.designation');
      // Refresh data when screen is focused
    }, []),
  );

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  useEffect(() => {
    // Filter branches based on user role and search query
    let accessibleBranches = branches;

    // Apply role-based filtering
    if (user?.role === Role.RM || user?.role === Role.ZM) {
      accessibleBranches = branches.filter(
        branch => branch.regionId === user.regionId,
      );
    } else if (user?.role === Role.BR) {
      accessibleBranches = branches.filter(
        branch => branch.id === user.branchId,
      );
    }

    // Apply search filter
    if (searchQuery.trim()) {
      accessibleBranches = accessibleBranches.filter(
        branch =>
          branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          branch.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          branch.managerName.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    setFilteredBranches(accessibleBranches);
  }, [searchQuery, user]);

  const onRefresh = () => {
    dispatch(fetchDashboardData());
  };

  const handleBranchPress = (branch: Branch) => {
    console.log('branch.name issss', branch);
    (navigation as any).navigate(screenName.BranchDetail, {
      branchId: branch.id,
    });
  };

  const renderBranchCard = (branch: Branch) => (
    <TouchableOpacity
      key={branch.id}
      onPress={() => {
        handleBranchPress(branch);
        console.log('branch.name', branch);
      }}
      activeOpacity={0.7}
    >
      <Card style={styles.branchCard} padding="lg">
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
              style={[styles.statLabel, { color: theme.colors.textSecondary }]}
            >
              Revenue
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.success }]}>
              {formatNumber(branch.totalCustomers)}
            </Text>
            <Text
              style={[styles.statLabel, { color: theme.colors.textSecondary }]}
            >
              Customers
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.warning }]}>
              {formatNumber(branch.totalStaff)}
            </Text>
            <Text
              style={[styles.statLabel, { color: theme.colors.textSecondary }]}
            >
              Staff
            </Text>
          </View>
        </View>

        {/* <View style={styles.branchActions}>
          <Button
            title="View Customers"
            onPress={() => {
              (navigation as any).navigate(screenName.CustomerList, {
                branchId: branch.id,
              });
            }}
            variant="outline"
            size="sm"
            style={styles.actionButton}
          />
          <Button
            title="View Sales"
            onPress={() => {
              (navigation as any).navigate(screenName.InvoiceList, {
                branchId: branch.id,
              });
            }}
            variant="outline"
            size="sm"
            style={styles.actionButton}
          />
        </View> */}
      </Card>
    </TouchableOpacity>
  );

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
      <Header title="Branches" subtitle="Branch Managers" showBackButton />
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
            Branch Management
          </Text>
          <Text
            style={[styles.subtitle, { color: theme.colors.textSecondary }]}
          >
            {user?.role === Role.CEO || user?.role === Role.GM
              ? 'All Branches'
              : user?.role === Role.RM || user?.role === Role.ZM
              ? 'Regional Branches'
              : 'Your Branch'}
          </Text>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <InputField
            label="Search Branches"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by name, address, or manager..."
            containerStyle={styles.searchInput}
          />
        </View>

        {/* Summary Stats */}
        <Card style={styles.summaryCard} padding="lg">
          <Text
            style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}
          >
            Branch Overview
          </Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text
                style={[styles.summaryValue, { color: theme.colors.primary }]}
              >
                {formatNumber(filteredBranches.length)}
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
                  filteredBranches.reduce(
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
                  filteredBranches.reduce(
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
                  filteredBranches.reduce(
                    (sum, branch) => sum + branch.totalStaff,
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
                Total Staff
              </Text>
            </View>
          </View>
        </Card>

        {/* Branch List */}
        <View style={styles.branchList}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}
          >
            Branches ({filteredBranches.length})
          </Text>
          {filteredBranches.length === 0 ? (
            <Card style={styles.emptyCard} padding="lg">
              <Text
                style={[
                  styles.emptyText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {searchQuery
                  ? 'No branches found matching your search.'
                  : 'No branches available.'}
              </Text>
            </Card>
          ) : (
            filteredBranches.map(renderBranchCard)
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
  branchList: {
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
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  branchActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 8,
  },
  actionButton: {
    flex: 1,
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
