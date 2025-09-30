import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Alert,
  BackHandler,
  ImageBackground,
  RefreshControl,
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RootState, AppDispatch } from '../../redux/store';
import { fetchDashboardData } from '../../redux/slices/dashboardSlice';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import MainHeader from '../../components/common/MainHeader';
import { PieGraph } from '../../components/charts/PieGraph';
import { RegionList } from '../Regions/RegionList';
import { API_Config } from '../../services/apiServices';
import { fonts } from '../../assets/fonts/Fonts';
import { AppSizes } from '../../utils/AppSizes';
import { BarGraph } from '../../components/charts/BarGraph';
import { colors } from '../../styles/theme';
import { HorizontalStackedBarGraph } from '../../components/charts/BarGraphHorizontal';
import { showMessage } from 'react-native-flash-message';

const { width } = Dimensions.get('window');

interface Region {
  region: string;
  total: number;
  paid: number;
  due: number;
}

export const CEO_GM_Dashboard: React.FC = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();

  const [loader, setLoader] = useState(false);
  const [regionsData, setRegionsData] = useState<any[]>([]);
  const [regionsCountData, setRegionsCountData] = useState<{
    totalCount: number;
    dueCount: number;
    paidCount: number;
  }>({ totalCount: 0, dueCount: 0, paidCount: 0 });
  const [allRegionsTotal, setAllRegionsTotal] = useState<Region[]>([]);
  const [showGraph, setShowGraph] = useState(false);

  const { isLoading } = useSelector((state: RootState) => state.dashboard);
  const Id = useSelector((state: RootState) => state.auth.user?.empId);

  // ✅ Random color generator (optimized)
  const getRandomColor = useCallback(() => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }, []);

  const generateUniqueColors = useCallback(
    (count: number) => {
      const colors = new Set<string>();
      while (colors.size < count) {
        colors.add(getRandomColor());
      }
      return Array.from(colors);
    },
    [getRandomColor],
  );

  // ✅ API Calls
  const getAllRegionsCount = useCallback(async () => {
    try {
      const response = await API_Config.getRegionCount({ obj: Id });
      if (response?.success) {
        const data = response.data.data[0];
        setRegionsCountData({
          totalCount: data.instTotalAmount,
          dueCount: data.instDueAmount,
          paidCount: data.instRecAmount,
        });

        console.log('Regions total : ', data);
      } else {
        Alert.alert('Error in Fetching API', response.data.message);
        //console.log('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Error fetching regions count:', error);
    }
  }, [Id]);

  const getAllRegions = useCallback(async () => {
    try {
      const response = await API_Config.getRegions({ obj: Id });
      if (response?.success) {
        const data = response.data.data;
        setRegionsData(data);

        console.log(data, 'horizontal data fetched');
        const formatted = data.map((item: any, index: number) => ({
          region: item.region,
          total: parseInt(String(item.instTotalAmount).replace(/,/g, ''), 10),

          paid: parseInt(String(item.instRecAmount).replace(/,/g, ''), 10),
          due: parseInt(String(item.instDueAmount).replace(/,/g, ''), 10),
          // total: parseFloat(item.instTotalAmount),
          // paid: parseFloat(item.instRecAmount),
          // due: parseFloat(item.instDueAmount),
        }));

        setAllRegionsTotal(formatted);

        setShowGraph(true);
      } else {showMessage({
        message: 'Error',
        description: response.data.message,
        type: 'danger',
      });
      }
    } catch (error) {
      console.error('Error fetching regions:', error);
    }
  }, [Id, generateUniqueColors]);

  const getAllDashboardData = useCallback(async () => {
    try {
      setLoader(true);
      await Promise.all([getAllRegions()]);
    } catch (e) {
      Alert.alert(
        'Error',
        'Something went wrong while fetching dashboard data',
      );
      console.log('in else');
    } finally {
      setLoader(false);
    }
  }, [getAllRegions, getAllRegionsCount]);

  useEffect(() => {
    getAllDashboardData();
  }, [getAllDashboardData]);

  useEffect(() => {
    const backAction = () => true; // disable hardware back
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  const onRefresh = useCallback(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  const users = useSelector((state: RootState) => state.auth.user);

  // const data = [
  //   { week: 'Total Outstanding', blue: regionsCountData.totalCount },
  //   { week: 'Total Paid', blue: regionsCountData.paidCount },
  //   { week: 'Total Due', blue: regionsCountData.dueCount },
  // ];

  const dataHorizontal = [
    { region: 'Region 1', total: 120, paid: 80, due: 40 },
    { region: 'Region 2', total: 100, paid: 50, due: 50 },
    { region: 'Region 3', total: 200, paid: 120, due: 80 },
    { region: 'Region 4', total: 150, paid: 100, due: 50 },
    { region: 'Region 5', total: 90, paid: 60, due: 30 },
    { region: 'Region 6', total: 120, paid: 80, due: 40 },
    { region: 'Region 7', total: 100, paid: 50, due: 50 },
    { region: 'Region 8', total: 200, paid: 120, due: 80 },
    { region: 'Region 9', total: 150, paid: 100, due: 50 },
    { region: 'Region 10', total: 90, paid: 60, due: 30 },

    // … up to 10+
  ];

  const data = [
    {
      week: 'Outstand',
      blue: parseInt(String(regionsCountData.totalCount).replace(/,/g, ''), 10),

      color: theme.colors.secondaryDark,
    },
    {
      week: ' Paid',
      blue: parseInt(String(regionsCountData.paidCount).replace(/,/g, ''), 10),
      color: theme.colors.success,
    },
    {
      week: ' Due',
      blue: parseInt(String(regionsCountData.dueCount).replace(/,/g, ''), 10),
      color: theme.colors.warning,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.overlay} />

      <SafeAreaView
        edges={['top']}
        style={[styles.safeArea, { backgroundColor: theme.colors.surface }]}
      >
        <MainHeader title={users?.firstName} subTitle={users?.designation} />

        {loader ? (
          <Loader />
        ) : (
          <ScrollView
            style={styles.scrollView}
            refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
          >
            {showGraph && (
              <>
                {/* <BarGraph
                  total={regionsCountData.totalCount}
                  paid={regionsCountData.paidCount}
                  due={regionsCountData.dueCount}
                  data={data}
                  purple={false}
                /> */}

                <HorizontalStackedBarGraph data={allRegionsTotal} />
              </>
            )}

            <RegionList data={regionsData} />

            <View style={styles.bottomSpacing} />
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: 'white', zIndex: 2 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 1,
  },
  scrollView: { flex: 1 },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
  },
  navigationCard: { marginHorizontal: 20, marginBottom: 10, elevation: 5 },
  bottomSpacing: { marginBottom: AppSizes.Margin_Vertical_40 },
});
