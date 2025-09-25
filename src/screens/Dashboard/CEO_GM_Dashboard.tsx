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

const { width } = Dimensions.get('window');

interface Region {
  regionName: string;
  regionamount: string;
  colors: string;
}

export const CEO_GM_Dashboard: React.FC = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();

  const [loader, setLoader] = useState(false);
  const [regionsData, setRegionsData] = useState<any[]>([]);
  const [regionsCountData, setRegionsCountData] = useState({
    totalCount: '',
    dueCount: '',
    paidCount: '',
  });
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
          totalCount: parseFloat(data.instTotalAmount).toFixed(2),
          dueCount: parseFloat(data.instDueAmount).toFixed(2),
          paidCount: parseFloat(data.instRecAmount).toFixed(2),
        });
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

        const colors = generateUniqueColors(data.length);
        const formatted = data.map((item: any, index: number) => ({
          regionName: item.region,
          regionamount: parseFloat(item.instTotalAmount).toFixed(0),
          colors: colors[index],
        }));

        setAllRegionsTotal(formatted);
        setShowGraph(true);
      }
    } catch (error) {
      console.error('Error fetching regions:', error);
    }
  }, [Id, generateUniqueColors]);

  const getAllDashboardData = useCallback(async () => {
    try {
      setLoader(true);
      await Promise.all([getAllRegions(), getAllRegionsCount()]);
    } catch (e) {
      Alert.alert(
        'Error',
        'Something went wrong while fetching dashboard data',
      );
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

  return (
    <View style={styles.container}>
      {/* Background Image + Overlay */}
      <ImageBackground
        blurRadius={10}
        source={require('../../assets/images/loginbackground.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <MainHeader title="Executive Dashboard" />

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
                <PieGraph
                  title="Sales of All Regions"
                  allregiondata={allRegionsTotal}
                />
              )}

              <View
                style={{
                  borderColor: theme.colors.secondary,
                  borderWidth: 1,
                  borderRadius: AppSizes.Radius_20,
                  paddingVertical: 10,
                  marginHorizontal: 20,
                }}
              >
                {/* <Card style={styles.navigationCard} padding="md">
                  
                </Card> */}

                <Text
                  style={[
                    styles.sectionTitle,
                    {
                      color: theme.colors.white,
                      
                      fontSize: AppSizes.Font_20,
                      fontFamily: fonts.bold,
                      textAlign: 'center',
                    },
                  ]}
                >
                  All Regions
                </Text>
                {/* <View
                  style={{
                    borderWidth: 1,
                    borderTopColor: theme.colors.secondary,
                    marginBottom:5
                  }}
                /> */}
                <RegionList data={regionsData} />
              </View>

              <View style={styles.bottomSpacing} />
            </ScrollView>
          )}
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: { flex: 1, width: '100%', height: '100%' },
  safeArea: { flex: 1, backgroundColor: 'transparent', zIndex: 2 },
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
