import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ImageBackground,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { RootState, AppDispatch } from '../../redux/store';
import {
  clearData,
  fetchDashboardData,
} from '../../redux/slices/dashboardSlice';
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
import { API_Config } from '../../services/apiServices';
import { fonts } from '../../assets/fonts/Fonts';
import { AppSizes } from '../../utils/AppSizes';
import Loader from '../../components/common/Loader';

const { width } = Dimensions.get('window');

// Branch interface is now imported from mockDataService

export const BranchList: React.FC = () => {
  const route = useRoute();
  const { zoneId } = route.params;

  const { theme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const permissions = usePermissions();
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const {
    data: dashboardData,
    isLoading,
    error,
  } = useSelector((state: RootState) => state.dashboard);

  const [branches, setBranches] = useState();
  const Id = useSelector((state: RootState) => state.auth.user?.empId);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     console.log('user?.role', user);
  //     console.log(user.designation, 'user?.designation');
  //     // Refresh data when screen is focused
  //   }, []),
  // );

  // useEffect(() => {
  //   dispatch(fetchDashboardData());
  // }, [dispatch]);

  // useEffect(() => {
  //   // Filter branches based on user role and search query
  //   let accessibleBranches = branches;

  //   // Apply role-based filtering
  //   if (user?.role === Role.RM || user?.role === Role.ZM) {
  //     accessibleBranches = branches.filter(
  //       branch => branch.regionId === user.regionId,
  //     );
  //   } else if (user?.role === Role.BR) {
  //     accessibleBranches = branches.filter(
  //       branch => branch.id === user.branchId,
  //     );
  //   }

  //   // Apply search filter
  //   if (searchQuery.trim()) {
  //     accessibleBranches = accessibleBranches.filter(
  //       branch =>
  //         branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //         branch.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //         branch.managerName.toLowerCase().includes(searchQuery.toLowerCase()),
  //     );
  //   }

  //   setFilteredBranches(accessibleBranches);
  // }, [searchQuery, user]);

  // const onRefresh = () => {
  //   dispatch(fetchDashboardData());
  // };

  // const handleBranchPress = (branch: Branch) => {
  //   console.log('branch.name issss', branch);
  //   (navigation as any).navigate(screenName.BranchDetail, {
  //     branchId: branch.id,
  //   });
  // };

  useEffect(() => {
    getAllBranches();
  }, []);

  const getAllBranches = async () => {
    setLoading(true);
    const response = await API_Config.getZoneBranches({ ID: Id, Zone: zoneId });

    if (response.success) {
      console.log('braches are  : ', response.data.data);
      setBranches(response.data.data);
      setLoading(false);
    } else {
      setLoading(false);
      console.log('response erro', response.message);
    }
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

  const handleBranchPress = ( item ) => {
   console.log('itme passsing is ',item);
    navigation.navigate('AVOsList', { branch: item?.branchCode });

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
        <Button title="Retry" style={styles.retryButton} />
      </View>
    );
  }

  return (
    <ImageBackground
          blurRadius={10}
          source={require('../../assets/images/loginbackground.jpg')}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          {/* Overlay for dark shade */}
          <View style={styles.overlay} />
    
          {/* Main Screen Content */}
          <View style={styles.safeArea}>
            <Header title="Zones" subtitle="Zonal Managers" showBackButton />
    
            {loading ? (
              <Loader />
            ) : (
              <FlatList
                data={branches}
                keyExtractor={item => item.id}
                ListEmptyComponent={() => (
                  <View style={{ alignItems: 'center', marginTop: 20 }}>
                    <Text style={{ color: theme.colors.white }}>No Item Found</Text>
                  </View>
                )}
                renderItem={({ item }) => (
                  <View
                    style={[
                      { backgroundColor: theme.colors.surface },
                      styles.item,
                    ]}
                  >
                    <Text
                      style={[
                        styles.title,
                        {
                          color: theme.colors.secondary,
                          fontFamily: fonts.extraBoldItalic,
                          fontSize: AppSizes.Font_20,
                          marginVertical: AppSizes.Margin_Vertical_10,
                        },
                      ]}
                    >
                      {item.branchName}
                    </Text>
    
                    {/* Amounts */}
                    <View style={styles.row}>
                      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                        Total Amount :
                      </Text>
                      <Text style={[styles.value, { color: theme.colors.white }]}>
                        {parseFloat(item.instTotalAmount).toFixed(2)|| 'N/A'}
                      </Text>
                    </View>
    
                    <View style={styles.row}>
                      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                        Paid Amount :
                      </Text>
                      <Text style={[styles.value, { color: theme.colors.success,  }]}>
                        {parseFloat(item.instRecAmount).toFixed(2) || 'N/A'}
                      </Text>
                    </View>
    
    
                    <View style={styles.row}>
                      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                        Due Amount :
                      </Text>
                      <Text style={[styles.value, { color: theme.colors.warning,  }]}>
                        {parseFloat(item.instDueAmount).toFixed(2)|| 'N/A'}
                      </Text>
                    </View>
    
                    {/* <View style={styles.row}>
                      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                        Zone Branches :
                      </Text>
                      <Text style={[styles.value, { color: theme.colors.secondary, }]}>
                        {item.zoneBranches || 'N/A'}
                      </Text>
                    </View> */}
    
                    <Button
                      title="View Branch"
                      onPress={() => handleBranchPress(item)}
                      variant="secondary"
                      size="sm"
                      style={{ marginTop: 22 }}
                    />
    
                    <View style={styles.divider} />
                  </View>
                )}
                contentContainerStyle={styles.list}
              />
            )}
          </View>
        </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingBottom: 100 },
  backgroundImage: { flex: 1, width: '100%', height: '100%' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  safeArea: { flex: 1, paddingBottom: 20 },
  list: { padding: AppSizes.Padding_Vertical_15, rowGap: AppSizes.Gap_20 },
  item: {
    borderRadius: 12,
    padding: 16,
    // marginBottom: 16,
    elevation: 2,
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  subtitle: { fontSize: 14, marginTop: 4 },

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

  value: {
    fontWeight: 'bold',
    padding: AppSizes.Padding_Horizontal_5,
    borderRadius: AppSizes.Radius_15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  divider: {
    marginVertical: 12,
    borderWidth: 0.5,
    borderTopColor: '#ccc',
  },
});
