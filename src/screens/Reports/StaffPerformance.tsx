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
import { mockDataService, StaffMember } from '../../services/mock/mockDataService';

const { width } = Dimensions.get('window');

export const StaffPerformance: React.FC = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const permissions = usePermissions();
  
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: dashboardData, isLoading, error } = useSelector((state: RootState) => state.dashboard);

  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'managers' | 'sales' | 'technicians' | 'support'>('all');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  useEffect(() => {
    // Get staff based on user role
    let accessibleStaff = mockDataService.getStaff();
    
    if (user?.role === Role.RM || user?.role === Role.ZM) {
      accessibleStaff = mockDataService.getStaffByRegion(user.regionId || '');
    } else if (user?.role === Role.BR) {
      accessibleStaff = mockDataService.getStaffByBranch(user.branchId || '');
    }

    setStaff(accessibleStaff);
  }, [user]);

  const onRefresh = () => {
    dispatch(fetchDashboardData());
  };

  const getFilteredStaff = () => {
    let filtered = staff;

    // Apply role filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(member => {
        const role = member.role.toLowerCase();
        switch (selectedFilter) {
          case 'managers': return role.includes('manager');
          case 'sales': return role.includes('sales');
          case 'technicians': return role.includes('technician');
          case 'support': return role.includes('cashier') || role.includes('support');
          default: return true;
        }
      });
    }

    // Apply branch filter
    if (selectedBranch !== 'all') {
      filtered = filtered.filter(member => member.branchId === selectedBranch);
    }

    return filtered.sort((a, b) => b.performance - a.performance);
  };

  const getPerformanceLevel = (performance: number) => {
    if (performance >= 90) return { level: 'excellent', color: theme.colors.success };
    if (performance >= 80) return { level: 'good', color: theme.colors.warning };
    if (performance >= 70) return { level: 'average', color: theme.colors.error };
    return { level: 'needs improvement', color: theme.colors.error };
  };

  const getPerformanceTrendData = () => {
    // Mock trend data for the last 6 months
    return [
      { x: 'Jan', y: 85 },
      { x: 'Feb', y: 87 },
      { x: 'Mar', y: 89 },
      { x: 'Apr', y: 91 },
      { x: 'May', y: 88 },
      { x: 'Jun', y: 92 },
    ];
  };

  const getRoleDistributionData = () => {
    const roles = ['managers', 'sales', 'technicians', 'support'];
    return roles.map(role => {
      const count = staff.filter(member => {
        const memberRole = member.role.toLowerCase();
        switch (role) {
          case 'managers': return memberRole.includes('manager');
          case 'sales': return memberRole.includes('sales');
          case 'technicians': return memberRole.includes('technician');
          case 'support': return memberRole.includes('cashier') || memberRole.includes('support');
          default: return false;
        }
      }).length;
      return { x: role.charAt(0).toUpperCase() + role.slice(1), y: count };
    });
  };

  const getPerformanceDistributionData = () => {
    const excellent = staff.filter(m => m.performance >= 90).length;
    const good = staff.filter(m => m.performance >= 80 && m.performance < 90).length;
    const average = staff.filter(m => m.performance >= 70 && m.performance < 80).length;
    const needsImprovement = staff.filter(m => m.performance < 70).length;

    return [
      { x: 'Excellent', y: excellent },
      { x: 'Good', y: good },
      { x: 'Average', y: average },
      { x: 'Needs Improvement', y: needsImprovement },
    ];
  };

  const getFilterButtonStyle = (filter: string) => {
    const isSelected = selectedFilter === filter;
    return {
      backgroundColor: isSelected ? theme.colors.primary : theme.colors.surfaceVariant,
      borderColor: isSelected ? theme.colors.primary : theme.colors.border,
    };
  };

  const getFilterTextStyle = (filter: string) => {
    const isSelected = selectedFilter === filter;
    return {
      color: isSelected ? theme.colors.white : theme.colors.textPrimary,
    };
  };

  const renderStaffCard = (member: StaffMember, index: number) => {
    const performance = getPerformanceLevel(member.performance);
    const isTopPerformer = index === 0;
    
    return (
      <Card key={member.id} style={styles.staffCard} padding="lg">
        <View style={styles.staffHeader}>
          <View style={styles.staffInfo}>
            <Text style={[styles.staffName, { color: theme.colors.textPrimary }]}>
              {member.name}
            </Text>
            <Text style={[styles.staffRole, { color: theme.colors.textSecondary }]}>
              {member.role}
            </Text>
            <Text style={[styles.staffBranch, { color: theme.colors.textTertiary }]}>
              📍 Branch {member.branchId.split('-')[1]}
            </Text>
          </View>
          <View style={styles.staffBadges}>
            {isTopPerformer && (
              <View style={[styles.topPerformerBadge, { backgroundColor: theme.colors.success + '20' }]}>
                <Text style={[styles.topPerformerText, { color: theme.colors.success }]}>
                  🏆 #1
                </Text>
              </View>
            )}
            <StatusBadge 
              status={member.isActive ? 'active' : 'inactive'} 
              size="sm" 
            />
          </View>
        </View>

        <View style={styles.staffMetrics}>
          <View style={styles.metricItem}>
            <Text style={[styles.metricValue, { color: performance.color }]}>
              {member.performance}%
            </Text>
            <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>
              Performance
            </Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={[styles.metricValue, { color: theme.colors.primary }]}>
              {formatCurrency(member.salary)}
            </Text>
            <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>
              Salary
            </Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={[styles.metricValue, { color: theme.colors.warning }]}>
              {formatDate(member.joinDate)}
            </Text>
            <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>
              Join Date
            </Text>
          </View>
        </View>

        <View style={styles.performanceBar}>
          <View style={styles.performanceBarBackground}>
            <View 
              style={[
                styles.performanceBarFill,
                { 
                  width: `${member.performance}%`,
                  backgroundColor: performance.color 
                }
              ]} 
            />
          </View>
          <Text style={[styles.performanceText, { color: theme.colors.textSecondary }]}>
            {performance.level.charAt(0).toUpperCase() + performance.level.slice(1)}
          </Text>
        </View>
      </Card>
    );
  };

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          Failed to load staff performance data
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
            Staff Performance
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Employee Performance Analysis
          </Text>
        </View>

        {/* Filters */}
        <Card style={styles.filtersCard} padding="lg">
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Filter by Role
          </Text>
          <View style={styles.filterButtons}>
            {[
              { key: 'all', label: 'All Staff' },
              { key: 'managers', label: 'Managers' },
              { key: 'sales', label: 'Sales' },
              { key: 'technicians', label: 'Technicians' },
              { key: 'support', label: 'Support' },
            ].map((filter) => (
              <TouchableOpacity
                key={filter.key}
                onPress={() => setSelectedFilter(filter.key as any)}
                style={[styles.filterButton, getFilterButtonStyle(filter.key)]}
              >
                <Text style={[styles.filterButtonText, getFilterTextStyle(filter.key)]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Summary Stats */}
        <Card style={styles.summaryCard} padding="lg">
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Performance Summary
          </Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: theme.colors.primary }]}>
                {formatNumber(getFilteredStaff().length)}
              </Text>
              <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                Total Staff
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: theme.colors.success }]}>
                {formatNumber(getFilteredStaff().filter(m => m.performance >= 90).length)}
              </Text>
              <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                Excellent
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: theme.colors.warning }]}>
                {formatNumber(getFilteredStaff().filter(m => m.performance >= 80 && m.performance < 90).length)}
              </Text>
              <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                Good
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: theme.colors.error }]}>
                {formatNumber(getFilteredStaff().filter(m => m.performance < 80).length)}
              </Text>
              <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                Needs Improvement
              </Text>
            </View>
          </View>
        </Card>

        {/* Charts */}
        <View style={styles.chartsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Performance Analytics
          </Text>
          
          <LineGraph
            title="Average Performance Trend (6 Months)"
            data={getPerformanceTrendData()}
            color={theme.colors.primary}
          />
          
          <BarGraph
            title="Staff Distribution by Role"
            data={getRoleDistributionData()}
            color={theme.colors.success}
          />
          
          <DonutGauge
            title="Performance Distribution"
            data={getPerformanceDistributionData()}
            colors={[theme.colors.success, theme.colors.warning, theme.colors.error, theme.colors.textSecondary]}
          />
        </View>

        {/* Staff Rankings */}
        <View style={styles.staffSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Staff Performance Rankings
          </Text>
          {getFilteredStaff().map((member, index) => renderStaffCard(member, index))}
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
  staffSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  staffCard: {
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  staffHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  staffInfo: {
    flex: 1,
  },
  staffName: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 4,
  },
  staffRole: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 2,
  },
  staffBranch: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  staffBadges: {
    alignItems: 'flex-end',
    gap: 8,
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
  staffMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
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
  performanceBar: {
    gap: 8,
  },
  performanceBarBackground: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  performanceBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  performanceText: {
    fontSize: 12,
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
