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
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RootState, AppDispatch } from '../../redux/store';
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
import Ionicons from '@react-native-vector-icons/ionicons';
import { CommonStyles } from '../../styles/GlobalStyle';

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

  // const { isLoading } = useSelector((state: RootState) => state.dashboard);
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
        //Alert.alert('Error in Fetching API', response.data.message);
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
      } else {
        // showMessage({
        //   message: 'Error',
        //   description: response.data.message,
        //   type: 'danger',
        //   style: CommonStyles.error,
        // });
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
      showMessage({
        message: 'Error',
        description: `${e || 'Error in fetching API'}`,
        type: 'danger',
        style: CommonStyles.error,
      });
    } finally {
      setLoader(false);
    }
  }, [getAllRegions, getAllRegionsCount]);

  useEffect(() => {
    getAllDashboardData();
  }, [getAllDashboardData]);

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        Alert.alert(
          'Hold on!',
          'Do you want to exit the app?',
          [
            {
              text: 'Cancel',
              onPress: () => null,
              style: 'cancel',
            },
            {
              text: 'YES',
              onPress: () => BackHandler.exitApp(),
            },
          ],
          { cancelable: true },
        );
        return true; // prevent default back behavior
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      // Cleanup when leaving the screen
      return () => backHandler.remove();
    }, []),
  );

  const onRefresh = useCallback(() => {
    getAllDashboardData();
  }, []);

  const users = useSelector((state: RootState) => state.auth.user);

  return (
    <View style={styles.container}>
      <View style={styles.overlay} />

      <SafeAreaView
        edges={['top']}
        style={[styles.safeArea, { backgroundColor: theme.colors.surface }]}
      >
        <MainHeader title={users?.firstName} subTitle={users?.designation} />

        {loader ? (
          <Loader title={'Loading Dashboard...'} />
        ) : (
          <ScrollView
            style={styles.scrollView}
            refreshControl={
              <RefreshControl refreshing={loader} onRefresh={onRefresh} />
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

                <Card
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    marginHorizontal: AppSizes.Margin_Horizontal_20,
                    elevation: 12,
                    marginTop: AppSizes.Margin_Vertical_20,
                  }}
                >
                  <View
                    style={[
                      styles.cardtitle,
                      { backgroundColor: colors.secondaryDark },
                    ]}
                  >
                    <Text style={styles.cardSubtitle}>Total</Text>
                    <Text style={{ color: 'white' }}>
                      {regionsCountData.totalCount}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.cardtitle,
                      { backgroundColor: theme.colors.success },
                    ]}
                  >
                    <Text style={styles.cardSubtitle}>Paid</Text>
                    <Text style={{ color: 'white' }}>
                      {regionsCountData.paidCount}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.cardtitle,
                      { backgroundColor: theme.colors.warning },
                    ]}
                  >
                    <Text style={styles.cardSubtitle}>Due</Text>
                    <Text style={{ color: 'white' }}>
                      {regionsCountData.dueCount}
                    </Text>
                  </View>
                </Card>

                <HorizontalStackedBarGraph data={allRegionsTotal} />

                <RegionList data={regionsData} />
              </>
            )}

            {/* <View style={styles.bottomSpacing} /> */}
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
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
  navigationCard: { marginHorizontal: 20, marginBottom: 10, elevation: 5 },
  bottomSpacing: { marginBottom: 60 },
  cardtitle: {
    alignItems: 'center',

    padding: AppSizes.Padding_Vertical_10,
    borderRadius: AppSizes.Radius_8,
    paddingHorizontal: AppSizes.Padding_Horizontal_20,
    rowGap: AppSizes.Gap_10,
  },
  cardSubtitle: {
    fontSize: AppSizes.Font_16,
    fontWeight: 'bold',
    color: 'white',
  },
});
