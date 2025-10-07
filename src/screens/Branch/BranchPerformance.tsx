// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   RefreshControl,
//   TouchableOpacity,
//   Dimensions,
// } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { RootState, AppDispatch } from '../../redux/store';
// import { fetchDashboardData } from '../../redux/slices/dashboardSlice';
// import { useTheme } from '../../hooks/useTheme';
// import { usePermissions } from '../../hooks/usePermissions';
// import { Card } from '../../components/common/Card';
// import { Button } from '../../components/common/Button';
// import { LineGraph } from '../../components/charts/LineGraph';
// import { BarGraph } from '../../components/charts/BarGraph';
// import { ProgressGraph } from '../../components/charts/ProgressGraph';
// import { formatCurrency, formatNumber, formatDate } from '../../utils/formatters';
// import { Role } from '../../types';

// const { width } = Dimensions.get('window');

// interface BranchPerformanceProps {
//   route: {
//     params: {
//       branchId: string;
//     };
//   };
// }

// interface PerformanceMetric {
//   id: string;
//   title: string;
//   value: number;
//   target: number;
//   change: number;
//   changeType: 'increase' | 'decrease' | 'neutral';
//   format: 'currency' | 'number' | 'percentage';
//   color: string;
// }

// interface ComparisonData {
//   branch: string;
//   revenue: number;
//   customers: number;
//   efficiency: number;
// }

// export const BranchPerformance: React.FC<BranchPerformanceProps> = ({ route }) => {
//   const { theme } = useTheme();
//   const dispatch = useDispatch<AppDispatch>();
//   const navigation = useNavigation();
//   const permissions = usePermissions();
  
//   const { user } = useSelector((state: RootState) => state.auth);
//   const { data: dashboardData, isLoading, error } = useSelector((state: RootState) => state.dashboard);

//   const { branchId } = route.params;
//   const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
//   const [comparisonData, setComparisonData] = useState<ComparisonData[]>([]);

//   useEffect(() => {
//     dispatch(fetchDashboardData());
//   }, [dispatch]);

//   useEffect(() => {
//     // Mock performance metrics
//     const metrics: PerformanceMetric[] = [
//       {
//         id: 'revenue',
//         title: 'Monthly Revenue',
//         value: 450000,
//         target: 500000,
//         change: 12.5,
//         changeType: 'increase',
//         format: 'currency',
//         color: theme.colors.primary,
//       },
//       {
//         id: 'customers',
//         title: 'New Customers',
//         value: 25,
//         target: 30,
//         change: -8.3,
//         changeType: 'decrease',
//         format: 'number',
//         color: theme.colors.success,
//       },
//       {
//         id: 'efficiency',
//         title: 'Staff Efficiency',
//         value: 87,
//         target: 90,
//         change: 5.2,
//         changeType: 'increase',
//         format: 'percentage',
//         color: theme.colors.warning,
//       },
//       {
//         id: 'satisfaction',
//         title: 'Customer Satisfaction',
//         value: 4.6,
//         target: 4.8,
//         change: 2.1,
//         changeType: 'increase',
//         format: 'percentage',
//         color: theme.colors.error,
//       },
//     ];

//     // Mock comparison data
//     const comparison: ComparisonData[] = [
//       {
//         branch: 'Karachi Central',
//         revenue: 450000,
//         customers: 125,
//         efficiency: 87,
//       },
//       {
//         branch: 'Lahore Main',
//         revenue: 380000,
//         customers: 98,
//         efficiency: 82,
//       },
//       {
//         branch: 'Islamabad',
//         revenue: 320000,
//         customers: 87,
//         efficiency: 79,
//       },
//       {
//         branch: 'Faisalabad',
//         revenue: 280000,
//         customers: 76,
//         efficiency: 75,
//       },
//     ];

//     setPerformanceMetrics(metrics);
//     setComparisonData(comparison);
//   }, [theme.colors]);

//   const onRefresh = () => {
//     dispatch(fetchDashboardData());
//   };

//   const formatValue = (value: number, format: string): string => {
//     switch (format) {
//       case 'currency':
//         return formatCurrency(value);
//       case 'percentage':
//         return `${value}%`;
//       default:
//         return formatNumber(value);
//     }
//   };

//   const renderPerformanceCard = (metric: PerformanceMetric) => (
//     <Card key={metric.id} style={styles.metricCard} padding="md">
//       <View style={styles.metricHeader}>
//         <Text style={[styles.metricTitle, { color: theme.colors.textSecondary }]}>
//           {metric.title}
//         </Text>
//         <View style={[styles.targetBadge, { backgroundColor: theme.colors.surfaceVariant }]}>
//           <Text style={[styles.targetText, { color: theme.colors.textSecondary }]}>
//             Target: {formatValue(metric.target, metric.format)}
//           </Text>
//         </View>
//       </View>
      
//       <Text style={[styles.metricValue, { color: metric.color }]}>
//         {formatValue(metric.value, metric.format)}
//       </Text>
      
//       <View style={styles.metricFooter}>
//         <View style={styles.progressBar}>
//           <View 
//             style={[
//               styles.progressFill, 
//               { 
//                 width: `${Math.min((metric.value / metric.target) * 100, 100)}%`,
//                 backgroundColor: metric.color 
//               }
//             ]} 
//           />
//         </View>
//         <Text style={[
//           styles.changeText,
//           { 
//             color: metric.changeType === 'increase' ? theme.colors.success : 
//                    metric.changeType === 'decrease' ? theme.colors.error : 
//                    theme.colors.textSecondary 
//           }
//         ]}>
//           {metric.changeType === 'increase' ? '↗' : metric.changeType === 'decrease' ? '↘' : '→'} {Math.abs(metric.change)}%
//         </Text>
//       </View>
//     </Card>
//   );

//   // Chart data
//   const revenueTrendData = [
//     { x: 'Jan', y: 350000 },
//     { x: 'Feb', y: 420000 },
//     { x: 'Mar', y: 380000 },
//     { x: 'Apr', y: 450000 },
//     { x: 'May', y: 480000 },
//     { x: 'Jun', y: 450000 },
//   ];

//   const branchComparisonData = comparisonData.map(branch => ({
//     x: branch.branch.split(' ')[0], // First word only
//     y: branch.revenue,
//   }));

//   const efficiencyData = [
//     { x: 'Sales', y: 45 },
//     { x: 'Service', y: 30 },
//     { x: 'Support', y: 25 },
//   ];

//   if (error) {
//     return (
//       <View style={[styles.container, styles.centerContent, { backgroundColor: theme.colors.background }]}>
//         <Text style={[styles.errorText, { color: theme.colors.error }]}>
//           Failed to load performance data
//         </Text>
//         <Button
//           title="Retry"
//           onPress={onRefresh}
//           style={styles.retryButton}
//         />
//       </View>
//     );
//   }

//   return (
//     <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
//       <ScrollView
//         style={styles.scrollView}
//         refreshControl={
//           <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
//         }
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Header */}
//         <View style={styles.header}>
//           <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//             <Text style={[styles.backText, { color: theme.colors.primary }]}>← Back</Text>
//           </TouchableOpacity>
//           <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
//             Branch Performance
//           </Text>
//           <View style={styles.placeholder} />
//         </View>

//         {/* Performance Metrics */}
//         <View style={styles.metricsSection}>
//           <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
//             Key Performance Indicators
//           </Text>
//           <View style={styles.metricsGrid}>
//             {performanceMetrics.map(renderPerformanceCard)}
//           </View>
//         </View>

//         {/* Performance Summary */}
//         <Card style={styles.summaryCard} padding="lg">
//           <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
//             Performance Summary
//           </Text>
//           <View style={styles.summaryGrid}>
//             <View style={styles.summaryItem}>
//               <Text style={[styles.summaryValue, { color: theme.colors.primary }]}>
//                 {formatCurrency(450000)}
//               </Text>
//               <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
//                 Total Revenue
//               </Text>
//             </View>
//             <View style={styles.summaryItem}>
//               <Text style={[styles.summaryValue, { color: theme.colors.success }]}>
//                 {formatNumber(125)}
//               </Text>
//               <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
//                 Active Customers
//               </Text>
//             </View>
//             <View style={styles.summaryItem}>
//               <Text style={[styles.summaryValue, { color: theme.colors.warning }]}>
//                 87%
//               </Text>
//               <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
//                 Efficiency Rate
//               </Text>
//             </View>
//             <View style={styles.summaryItem}>
//               <Text style={[styles.summaryValue, { color: theme.colors.error }]}>
//                 4.6/5
//               </Text>
//               <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
//                 Satisfaction
//               </Text>
//             </View>
//           </View>
//         </Card>

//         {/* Charts */}
//         <View style={styles.chartsSection}>
//           <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
//             Performance Analytics
//           </Text>
          
//           <LineGraph
//             title="Revenue Trend (6 Months)"
//             data={revenueTrendData}
//             color={theme.colors.primary}
//           />
          
//           {/* <BarGraph
//             title="omparison"
//             data={branchComparisonData}
//             color={theme.colors.success}
//           /> */}
          
//           <ProgressGraph
//             title="Efficiency Distribution"
//             data={efficiencyData}
//             colors={[theme.colors.primary, theme.colors.success, theme.colors.warning]}
//           />
//         </View>

//         {/* Branch Comparison Table */}
//         <Card style={styles.comparisonCard} padding="lg">
//           <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
//             Branch Comparison
//           </Text>
//           <View style={styles.tableHeader}>
//             <Text style={[styles.tableHeaderText, { color: theme.colors.textSecondary }]}>
//               Branch
//             </Text>
//             <Text style={[styles.tableHeaderText, { color: theme.colors.textSecondary }]}>
//               Revenue
//             </Text>
//             <Text style={[styles.tableHeaderText, { color: theme.colors.textSecondary }]}>
//               Customers
//             </Text>
//             <Text style={[styles.tableHeaderText, { color: theme.colors.textSecondary }]}>
//               Efficiency
//             </Text>
//           </View>
//           {comparisonData.map((branch, index) => (
//             <View key={index} style={[
//               styles.tableRow,
//               { backgroundColor: index % 2 === 0 ? 'transparent' : theme.colors.surfaceVariant }
//             ]}>
//               <Text style={[styles.tableCell, { color: theme.colors.textPrimary }]}>
//                 {branch.branch.split(' ')[0]}
//               </Text>
//               <Text style={[styles.tableCell, { color: theme.colors.textPrimary }]}>
//                 {formatCurrency(branch.revenue)}
//               </Text>
//               <Text style={[styles.tableCell, { color: theme.colors.textPrimary }]}>
//                 {formatNumber(branch.customers)}
//               </Text>
//               <Text style={[styles.tableCell, { color: theme.colors.textPrimary }]}>
//                 {branch.efficiency}%
//               </Text>
//             </View>
//           ))}
//         </Card>

//         {/* Action Buttons */}
//         <View style={styles.actionsSection}>
//           <Button
//             title="Generate Report"
//             onPress={() => {}}
//             variant="primary"
//             style={styles.actionButton}
//           />
//           <Button
//             title="Export Data"
//             onPress={() => {}}
//             variant="outline"
//             style={styles.actionButton}
//           />
//         </View>

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
//   backButton: {
//     padding: 8,
//   },
//   backText: {
//     fontSize: 16,
//     fontFamily: 'Poppins-SemiBold',
//   },
//   title: {
//     fontSize: 20,
//     fontFamily: 'Poppins-Bold',
//     flex: 1,
//     textAlign: 'center',
//   },
//   placeholder: {
//     width: 60,
//   },
//   metricsSection: {
//     paddingHorizontal: 20,
//     marginBottom: 20,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontFamily: 'Poppins-SemiBold',
//     marginBottom: 16,
//   },
//   metricsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   metricCard: {
//     width: (width - 60) / 2,
//     marginBottom: 16,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//   },
//   metricHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   metricTitle: {
//     fontSize: 12,
//     fontFamily: 'Poppins-Regular',
//     flex: 1,
//   },
//   targetBadge: {
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 8,
//   },
//   targetText: {
//     fontSize: 10,
//     fontFamily: 'Poppins-Regular',
//   },
//   metricValue: {
//     fontSize: 20,
//     fontFamily: 'Poppins-Bold',
//     marginBottom: 8,
//   },
//   metricFooter: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   progressBar: {
//     flex: 1,
//     height: 4,
//     backgroundColor: '#e5e7eb',
//     borderRadius: 2,
//     marginRight: 8,
//   },
//   progressFill: {
//     height: '100%',
//     borderRadius: 2,
//   },
//   changeText: {
//     fontSize: 12,
//     fontFamily: 'Poppins-SemiBold',
//   },
//   summaryCard: {
//     marginHorizontal: 20,
//     marginBottom: 20,
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
//   chartsSection: {
//     paddingHorizontal: 20,
//     marginBottom: 20,
//   },
//   comparisonCard: {
//     marginHorizontal: 20,
//     marginBottom: 20,
//   },
//   tableHeader: {
//     flexDirection: 'row',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e5e7eb',
//     marginBottom: 8,
//   },
//   tableHeaderText: {
//     flex: 1,
//     fontSize: 14,
//     fontFamily: 'Poppins-SemiBold',
//     textAlign: 'center',
//   },
//   tableRow: {
//     flexDirection: 'row',
//     paddingVertical: 12,
//     borderRadius: 4,
//   },
//   tableCell: {
//     flex: 1,
//     fontSize: 14,
//     fontFamily: 'Poppins-Regular',
//     textAlign: 'center',
//   },
//   actionsSection: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: 20,
//     marginBottom: 20,
//   },
//   actionButton: {
//     flex: 1,
//     marginHorizontal: 8,
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
