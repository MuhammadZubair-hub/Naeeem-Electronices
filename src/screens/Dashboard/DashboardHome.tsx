import { View, ActivityIndicator, ImageBackground } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Role } from '../../types';
import { screenName } from '../../navigation/ScreenName';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../navigation/AppNavigator';
import Loader from '../../components/common/Loader';

export const DashboardHome: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user) {
      // ensure navigation happens after initial render
      setTimeout(() => {
        navigateToRoleDashboard();
      }, 1000);
    }
  }, [user]);

  const navigateToRoleDashboard = () => {
    if (!user) return;

    console.log('user role in DashboardHome:', user);
    const designation = user?.designation?.toUpperCase();
    console.log('user designation in DashboardHome:', designation);

    switch (designation) {
      case Role.CEO:
      case Role.GM:
        navigation.navigate(screenName.CEO_GM_Dashboard);
        console.log('first case');
        break;
      case Role.RM:
      case Role.ZM:
        navigation.navigate(screenName.RM_ZM_Dashboard);
        break;
      case Role.BR:
        navigation.navigate(screenName.BR_AVO_Dashboard);
        break;
      case Role.AVO:
        navigation.navigate(screenName.AVO_AllCustomers);
        break;
      default:
        navigation.navigate(screenName.AVO_AllCustomers);
    }
  };

  // loader until redirect
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Loader />
    </View>
    // <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    // </View>
  );
};

// import React, { useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   RefreshControl,
//   Dimensions,
//   Alert,
// } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigation } from '@react-navigation/native';
// import { RootState, AppDispatch } from '../../redux/store';
// import { fetchDashboardData } from '../../redux/slices/dashboardSlice';
// import { logout } from '../../redux/slices/authSlice';
// import { useTheme } from '../../hooks/useTheme';
// import { Card } from '../../components/common/Card';
// import { Button } from '../../components/common/Button';
// import { Header } from '../../components/common/Header';
// import { Role } from '../../types';
// import { screenName } from '../../navigation/ScreenName';
// const { width } = Dimensions.get('window');

// export const DashboardHome: React.FC = () => {
//   const { theme } = useTheme();
//   const dispatch = useDispatch<AppDispatch>();
//   const navigation = useNavigation();

//   const { user } = useSelector((state: RootState) => state.auth);
//   const {
//     data: dashboardData,
//     isLoading,
//     error,
//   } = useSelector((state: RootState) => state.dashboard);

//   useEffect(() => {
//     dispatch(fetchDashboardData());
//   }, [dispatch]);

//   const onRefresh = () => {
//     dispatch(fetchDashboardData());
//   };

//   const handleLogout = () => {
//     Alert.alert('Logout', 'Are you sure you want to logout?', [
//       { text: 'Cancel', style: 'cancel' },
//       {
//         text: 'Logout',
//         style: 'destructive',
//         onPress: () => dispatch(logout()),
//       },
//     ]);
//   };

//   const formatCurrency = (amount: number): string => {
//     return new Intl.NumberFormat('en-PK', {
//       style: 'currency',
//       currency: 'PKR',
//       minimumFractionDigits: 0,
//     }).format(amount);
//   };

//   const formatNumber = (num: number): string => {
//     return new Intl.NumberFormat('en-PK').format(num);
//   };

//   const getGreeting = (): string => {
//     const hour = new Date().getHours();
//     if (hour < 12) return 'Good Morning';
//     if (hour < 18) return 'Good Afternoon';
//     return 'Good Evening';
//   };

//   const getRoleDisplayName = (role: Role): string => {
//     const roleNames = {
//       [Role.CEO]: 'Chief Executive Officer',
//       [Role.GM]: 'General Manager',
//       [Role.RM]: 'Regional Manager',
//       [Role.ZM]: 'Zone Manager',
//       [Role.BR]: 'Branch Manager',
//       [Role.AVO]: 'Area Sales Officer',
//     };
//     return roleNames[role] || '';
//   };

//   // --- Render Functions and Navigation ---
//   // Only one definition of each helper below:
//   // --- Render Functions and Navigation ---
//   // --- Render Functions ---
//   const renderKPICard = (kpi: any) => (
//     <Card key={kpi.id} style={styles.kpiCard} padding="md">
//       <View style={styles.kpiHeader}>
//         <Text style={[styles.kpiTitle, { color: theme.colors.textSecondary }]}>
//           {kpi.title}
//         </Text>
//         <View style={[styles.kpiIcon, { backgroundColor: kpi.color + '20' }]}>
//           <Text style={[styles.kpiIconText, { color: kpi.color }]}>
//             {kpi.icon === 'trending-up' && '📈'}
//             {kpi.icon === 'users' && '👥'}
//             {kpi.icon === 'shopping-cart' && '🛒'}
//             {kpi.icon === 'alert-circle' && '⚠️'}
//             {kpi.icon === 'building' && '🏢'}
//             {kpi.icon === 'dollar-sign' && '💰'}
//           </Text>
//         </View>
//       </View>
//       <Text style={[styles.kpiValue, { color: theme.colors.textPrimary }]}>
//         {kpi.format === 'currency' ? formatCurrency(kpi.value) : formatNumber(kpi.value)}
//       </Text>
//       <View style={styles.kpiChange}>
//         <Text
//           style={[
//             styles.kpiChangeText,
//             {
//               color:
//                 kpi.changeType === 'increase'
//                   ? theme.colors.success
//                   : kpi.changeType === 'decrease'
//                   ? theme.colors.error
//                   : theme.colors.textSecondary,
//             },
//           ]}
//         >
//           {kpi.changeType === 'increase'
//             ? '↗'
//             : kpi.changeType === 'decrease'
//             ? '↘'
//             : '→'}{' '}
//           {Math.abs(kpi.change)}%
//         </Text>
//         <Text style={[styles.kpiChangeLabel, { color: theme.colors.textTertiary }]}>vs last month</Text>
//       </View>
//     </Card>
//   );

//   const navigateToRoleDashboard = () => {
//     if (!user) return;
//     switch (user.role) {
//       case Role.CEO:
//         (navigation as any).navigate({ name: screenName.CEO_GM_Dashboard });
//         break;
//       case Role.GM:
//         (navigation as any).navigate({ name: screenName.CEO_GM_Dashboard });
//         break;
//       case Role.RM:
//         (navigation as any).navigate({ name: screenName.RM_ZM_Dashboard });
//         break;
//       case Role.ZM:
//         (navigation as any).navigate({ name: screenName.RM_ZM_Dashboard });
//         break;
//       case Role.BR:
//         (navigation as any).navigate({ name: screenName.BR_AVO_Dashboard });
//         break;
//       case Role.AVO:
//         (navigation as any).navigate({ name: screenName.AVO_AllCustomers });
//         break;
//       default:
//         break;
//     }
//   };

//   const renderQuickActions = () => (
//     <Card style={styles.quickActionsCard} padding="lg">
//       <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Quick Actions</Text>
//       <View style={styles.quickActionsGrid}>
//         <Button
//           title="My Dashboard"
//           onPress={navigateToRoleDashboard}
//           variant="primary"
//           size="sm"
//           style={styles.quickActionButton}
//         />
//         <Button
//           title="View Branches"
//           onPress={() => (navigation as any).navigate(screenName.BranchList)}
//           variant="outline"
//           size="sm"
//           style={styles.quickActionButton}
//         />
//         <Button
//           title="View Customers"
//           onPress={() => (navigation as any).navigate(screenName.CustomerList)}
//           variant="outline"
//           size="sm"
//           style={styles.quickActionButton}
//         />
//         <Button
//           title="View Sales"
//           onPress={() => (navigation as any).navigate(screenName.InvoiceList)}
//           variant="outline"
//           size="sm"
//           style={styles.quickActionButton}
//         />
//         <Button
//           title="View Reports"
//           onPress={() => (navigation as any).navigate(screenName.RevenueTrends)}
//           variant="outline"
//           size="sm"
//           style={styles.quickActionButton}
//         />
//       </View>
//     </Card>
//   );

//   const renderRecentActivity = () => (
//     <Card style={styles.recentActivityCard} padding="lg">
//       <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Recent Sales Activity</Text>
//       {dashboardData?.recentSales?.slice(0, 3).map((sale, index) => (
//         <View key={sale.id} style={styles.activityItem}>
//           <View style={styles.activityIcon}>
//             <Text style={styles.activityIconText}>
//               {sale.paymentStatus === 'paid'
//                 ? '✅'
//                 : sale.paymentStatus === 'partial'
//                 ? '⚠️'
//                 : '❌'}
//             </Text>
//           </View>
//           <View style={styles.activityContent}>
//             <Text style={[styles.activityTitle, { color: theme.colors.textPrimary }]}>Sale #{sale.id.slice(-6)}</Text>
//             <Text style={[styles.activitySubtitle, { color: theme.colors.textSecondary }]}> {formatCurrency(sale.totalAmount)} • {sale.paymentStatus}</Text>
//           </View>
//           <Text style={[styles.activityTime, { color: theme.colors.textTertiary }]}> {new Date(sale.saleDate).toLocaleDateString()}</Text>
//         </View>
//       ))}
//     </Card>
//   );

//   if (error) {
//     return (
//       <View
//         style={[
//           styles.container,
//           styles.centerContent,
//           { backgroundColor: theme.colors.background },
//         ]}
//       >
//         <Text style={[styles.errorText, { color: theme.colors.error }]}>
//           Failed to load dashboard data
//         </Text>
//         <Button title="Retry" onPress={onRefresh} style={styles.retryButton} />
//       </View>
//     );
//   }

//   return (
//     <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
//       <Header
//         title={user?.name || 'Dashboard'}
//         subtitle={user ? getRoleDisplayName(user.role) : ''}
//         showBackButton={false}
//         rightButton={
//           <Button
//             title="Logout"
//             onPress={handleLogout}
//             variant="ghost"
//             size="sm"
//             style={styles.logoutButton}
//           />
//         }
//       />
//       <ScrollView
//         style={styles.scrollView}
//         refreshControl={
//           <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
//         }
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Summary Stats */}
//         {dashboardData?.summary && (
//           <Card style={styles.summaryCard} padding="lg">
//             <Text
//               style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}
//             >
//               Business Overview
//             </Text>
//             <View style={styles.summaryGrid}>
//               <View style={styles.summaryItem}>
//                 <Text
//                   style={[styles.summaryValue, { color: theme.colors.primary }]}
//                 >
//                   {formatCurrency(dashboardData.summary.totalRevenue)}
//                 </Text>
//                 <Text
//                   style={[
//                     styles.summaryLabel,
//                     { color: theme.colors.textSecondary },
//                   ]}
//                 >
//                   Total Revenue
//                 </Text>
//               </View>
//               <View style={styles.summaryItem}>
//                 <Text
//                   style={[styles.summaryValue, { color: theme.colors.success }]}
//                 >
//                   {formatNumber(dashboardData.summary.totalCustomers)}
//                 </Text>
//                 <Text
//                   style={[
//                     styles.summaryLabel,
//                     { color: theme.colors.textSecondary },
//                   ]}
//                 >
//                   Customers
//                 </Text>
//               </View>
//               <View style={styles.summaryItem}>
//                 <Text
//                   style={[styles.summaryValue, { color: theme.colors.warning }]}
//                 >
//                   {formatNumber(dashboardData.summary.totalBranches)}
//                 </Text>
//                 <Text
//                   style={[
//                     styles.summaryLabel,
//                     { color: theme.colors.textSecondary },
//                   ]}
//                 >
//                   Branches
//                 </Text>
//               </View>
//               <View style={styles.summaryItem}>
//                 <Text
//                   style={[styles.summaryValue, { color: theme.colors.error }]}
//                 >
//                   {formatCurrency(dashboardData.summary.totalDue)}
//                 </Text>
//                 <Text
//                   style={[
//                     styles.summaryLabel,
//                     { color: theme.colors.textSecondary },
//                   ]}
//                 >
//                   Outstanding
//                 </Text>
//               </View>
//             </View>
//           </Card>
//         )}

//         {/* KPI Cards */}
//         <View style={styles.kpiSection}>
//           <Text
//             style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}
//           >
//             Key Performance Indicators
//           </Text>
//           <View style={styles.kpiGrid}>
//             {dashboardData?.kpis?.slice(0, 4).map(renderKPICard)}
//           </View>
//         </View>

//         {/* Quick Actions */}
//         {renderQuickActions()}

//         {/* Recent Activity */}
//         {renderRecentActivity()}

//         {/* Bottom Spacing */}
//         <View style={styles.bottomSpacing} />
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   centerContent: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   scrollView: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingTop: 20,
//     paddingBottom: 10,
//   },
//   headerRight: {
//     alignItems: 'center',
//   },
//   logoutButton: {
//     marginTop: 8,
//   },
//   greeting: {
//     fontSize: 16,
//     fontFamily: 'Poppins-Regular',
//   },
//   userName: {
//     fontSize: 24,
//     fontFamily: 'Poppins-Bold',
//     marginTop: 2,
//   },
//   userRole: {
//     fontSize: 14,
//     fontFamily: 'Poppins-Regular',
//     marginTop: 2,
//   },
//   avatar: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   avatarText: {
//     fontSize: 20,
//     fontFamily: 'Poppins-Bold',
//   },
//   summaryCard: {
//     marginHorizontal: 20,
//     marginBottom: 20,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontFamily: 'Poppins-SemiBold',
//     marginBottom: 16,
//   },
//   summaryGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   summaryItem: {
//     width: '48%',
//     marginBottom: 16,
//   },
//   summaryValue: {
//     fontSize: 20,
//     fontFamily: 'Poppins-Bold',
//     marginBottom: 4,
//   },
//   summaryLabel: {
//     fontSize: 12,
//     fontFamily: 'Poppins-Regular',
//   },
//   kpiSection: {
//     paddingHorizontal: 20,
//     marginBottom: 20,
//   },
//   kpiGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   kpiCard: {
//     width: (width - 60) / 2,
//     marginBottom: 16,
//   },
//   kpiHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   kpiTitle: {
//     fontSize: 12,
//     fontFamily: 'Poppins-Regular',
//     flex: 1,
//   },
//   kpiIcon: {
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   kpiIconText: {
//     fontSize: 12,
//   },
//   kpiValue: {
//     fontSize: 18,
//     fontFamily: 'Poppins-Bold',
//     marginBottom: 4,
//   },
//   kpiChange: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   kpiChangeText: {
//     fontSize: 12,
//     fontFamily: 'Poppins-SemiBold',
//     marginRight: 4,
//   },
//   kpiChangeLabel: {
//     fontSize: 10,
//     fontFamily: 'Poppins-Regular',
//   },
//   quickActionsCard: {
//     marginHorizontal: 20,
//     marginBottom: 20,
//   },
//   quickActionsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   quickActionButton: {
//     width: '48%',
//     marginBottom: 12,
//   },
//   recentActivityCard: {
//     marginHorizontal: 20,
//     marginBottom: 20,
//   },
//   activityItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   activityIcon: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: '#f1f5f9',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   activityIconText: {
//     fontSize: 16,
//   },
//   activityContent: {
//     flex: 1,
//   },
//   activityTitle: {
//     fontSize: 14,
//     fontFamily: 'Poppins-SemiBold',
//     marginBottom: 2,
//   },
//   activitySubtitle: {
//     fontSize: 12,
//     fontFamily: 'Poppins-Regular',
//   },
//   activityTime: {
//     fontSize: 10,
//     fontFamily: 'Poppins-Regular',
//   },
//   errorText: {
//     fontSize: 16,
//     fontFamily: 'Poppins-SemiBold',
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   retryButton: {
//     marginTop: 8,
//   },
//   bottomSpacing: {
//     height: 20,
//   },
// });
