import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  Alert,
  BackHandler,
  ScrollView,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { Button } from '../../components/common/Button';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import { Header } from '../../components/common/Header';
import { screenName } from '../../navigation/ScreenName';
import { API_Config } from '../../services/apiServices';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { AppSizes } from '../../utils/AppSizes';
import Loader from '../../components/common/Loader';
import { fonts } from '../../assets/fonts/Fonts';
import { Card } from '../../components/common';
import { SafeAreaView } from 'react-native-safe-area-context';
import { showMessage } from 'react-native-flash-message';
import { CommonStyles } from '../../styles/GlobalStyle';
import EmptyComponents from '../../components/common/EmptyComponents';
import MainHeader from '../../components/common/MainHeader';
import { HorizontalStackedBarGraph } from '../../components/charts/BarGraphHorizontal';
import { ZonesData } from '../Zones/ZoneList';

type Zone = {
  id: string;
  zone: string;
  zmName: string;
  instTotalAmount: string | number;
  instRecAmount: string | number;
  instDueAmount: string | number;
  zoneBranches: string | number;
  item: any;

};

interface Region {
  region: string;
  total: number;
  paid: number;
  due: number;

}

export const RM_ZM_Dashboard: React.FC = () => {
  const { theme } = useTheme();
  const route = useRoute<any>();

  const users = useSelector((state: RootState) => state.auth.user);

  const data = route?.params?.data ?? users?.region;

  const [zoneData, setZoneData] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(false);


  const [showGraph, setShowGraph] = useState(false);
  const [allZonesTotal, setAllZoneTotal] = useState<Region[]>([]);
  const [ZonesCountData, setZonesCountData] = useState<{
    totalCount: number;
    dueCount: number;
    paidCount: number;
  }>({ totalCount: 0, dueCount: 0, paidCount: 0 });




  useEffect(() => {
    getAllZones();
  }, []);

  const getAllZones = async () => {
    try {
      setLoading(true);
      const response = await API_Config.getZones({ ID: users?.empId, Region: data });
      console.log('zones are ', response);
      if (response?.success) {
        setZoneData(response.data.data);
        const data = response.data.data;

        if (Array.isArray(data)) {
          let count = {
            totalCount: 0,
            dueCount: 0,
            paidCount: 0,
          };

          data.forEach((item: any) => {
            console.log(
              item.instTotalAmount,
              item.instDueAmount,
              item.instRecAmount,
            );
            count.totalCount +=
              parseInt(String(item.instTotalAmount).replace(/,/g, ''), 10) || 0;
            count.dueCount +=
              parseInt(String(item.instDueAmount).replace(/,/g, ''), 10) || 0;
            count.paidCount +=
              parseInt(String(item.instRecAmount).replace(/,/g, ''), 10) || 0;
          });

          setZonesCountData(count);
        }

        console.log(data, 'horizontal data fetched');
        const formatted = data.map((item: any, index: number) => ({
          region: item.zmName,
          total: parseInt(String(item.instTotalAmount).replace(/,/g, ''), 10),

          paid: parseInt(String(item.instRecAmount).replace(/,/g, ''), 10),
          due: parseInt(String(item.instDueAmount).replace(/,/g, ''), 10),
          // total: parseFloat(item.instTotalAmount),
          // paid: parseFloat(item.instRecAmount),
          // due: parseFloat(item.instDueAmount),
        }));

        setAllZoneTotal(formatted);

        setShowGraph(true);
      } else {
        showMessage({
          message: 'Error',
          description: response.data.message,
          type: 'danger',
          style: CommonStyles.error,
        });
      }
    } catch (error) {
      console.error('Error fetching regions:', error);
    } finally {
      setLoading(false);
    }
  };



  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        Alert.alert(
          '',
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


  return (
    <SafeAreaView edges={['top']} style={CommonStyles.mainContainer}>
      <StatusBar
        backgroundColor={'#140958'}
        barStyle="light-content"
      />
      <MainHeader title={users?.firstName} subTitle={users?.designation} />
      {loading ? (
        <Loader title={'Loading Zones...'} />
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => getAllZones()}
            />
          }
        >

          <HorizontalStackedBarGraph
            title={'Zonal stats'}
            data={allZonesTotal}
          />

          <Card
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginHorizontal: AppSizes.Margin_Horizontal_20,
              elevation: 12,
            }}
          >
            <View
              style={[
                CommonStyles.cardtitle,
                { backgroundColor: theme.colors.secondaryDark },
              ]}
            >
              <Text style={CommonStyles.cardSubtitle}>Total</Text>
              <Text style={{ color: 'white', fontFamily: fonts.medium }}>
                {ZonesCountData.totalCount.toLocaleString()}
              </Text>
            </View>
            <View
              style={[
                CommonStyles.cardtitle,
                { backgroundColor: theme.colors.success },
              ]}
            >
              <Text style={CommonStyles.cardSubtitle}>Paid</Text>
              <Text style={{ color: 'white', fontFamily: fonts.medium }}>
                {ZonesCountData.paidCount.toLocaleString()}
              </Text>
            </View>

            <View
              style={[
                CommonStyles.cardtitle,
                { backgroundColor: theme.colors.warning },
              ]}
            >
              <Text style={CommonStyles.cardSubtitle}>Due</Text>
              <Text style={{ color: 'white', fontFamily: fonts.medium }}>
                {ZonesCountData.dueCount.toLocaleString()}
              </Text>
            </View>
          </Card>

          <ZonesData
            zoneData={zoneData}
            refreshing={loading}
           // onRefresh={() => getAllZones()}
          />

        </ScrollView>
      )}
    </SafeAreaView>
  );
};
