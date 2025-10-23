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

export const ZoneList: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const users = useSelector((state: RootState) => state.auth.user);

  const data = route?.params?.data ?? users?.region;

  const [zoneData, setZoneData] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(false);

  const Id = useSelector((state: RootState) => state.auth.user?.empId);
  const [showGraph, setShowGraph] = useState(false);
  const [allZonesTotal, setAllZoneTotal] = useState<Region[]>([]);
  const [ZonesCountData, setZonesCountData] = useState<{
    totalCount: number;
    dueCount: number;
    paidCount: number;
  }>({ totalCount: 0, dueCount: 0, paidCount: 0 });


  const { user } = useSelector((state: RootState) => state.auth);
  const access = user?.fullAuth;

  useEffect(() => {
    getAllZones();
  }, []);

  const getAllZones = async () => {
    try {
      setLoading(true);
      console.log('the data is : ', Id, data);
      const response = await API_Config.getZones({ ID: Id, Region: data });
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

  const handleZonePress = (zone: any) => {
    navigation.navigate(screenName.BranchList, { Zone: zone });
    //  navigation.navigate(screenName.BranchList,);
  };

  if (users?.designation == "RM") {
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
  }

  return (
    <SafeAreaView edges={['top']} style={CommonStyles.mainContainer}>
      {users?.region && access=="N" ? (
        <MainHeader title={users.firstName} subTitle={users.designation} />
      ) : (
        <Header title="Zones" subtitle="Region's Zones" showBackButton />
      )}
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
          {users?.region && access=="N" && (
            <>
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
            </>
          )}

          <FlatList
            data={zoneData}
            nestedScrollEnabled={false}
            scrollEnabled
            refreshing={loading}
            keyExtractor={item => item.id}
            ListEmptyComponent={() => <EmptyComponents />}
            contentContainerStyle={CommonStyles.list}
            renderItem={({ item }) => (
              <View
                style={[
                  { backgroundColor: theme.colors.surface },
                  CommonStyles.item,
                ]}
              >
                <Text
                  style={[
                    CommonStyles.title,
                    {
                      color: theme.colors.secondaryDark,
                      fontFamily: fonts.bold,
                      fontSize: AppSizes.Font_20,
                    },
                  ]}
                >
                  {item.zmName || 'N/A'}
                </Text>

                <View style={CommonStyles.row}>
                  <Text
                    style={[
                      CommonStyles.subtitle,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    Zone Branches :
                  </Text>
                  <Text
                    style={[
                      CommonStyles.value,
                      { color: theme.colors.secondary },
                    ]}
                  >
                    {item.zoneBranches || 'N/A'}
                  </Text>
                </View>

                {/* Amounts */}
                <View style={CommonStyles.row}>
                  <Text
                    style={[
                      CommonStyles.subtitle,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    Total Outstand :
                  </Text>
                  <Text
                    style={[CommonStyles.value, { color: theme.colors.black }]}
                  >
                    {item?.instTotalAmount || 'N/A'}
                  </Text>
                </View>

                <View style={CommonStyles.row}>
                  <Text
                    style={[
                      CommonStyles.subtitle,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    Total Paid :
                  </Text>
                  <Text
                    style={[
                      CommonStyles.value,
                      { color: theme.colors.success },
                    ]}
                  >
                    {item?.instRecAmount || 'N/A'}
                  </Text>
                </View>

                <View style={CommonStyles.row}>
                  <Text
                    style={[
                      CommonStyles.subtitle,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    Total Due :
                  </Text>
                  <Text
                    style={[
                      CommonStyles.value,
                      { color: theme.colors.warning },
                    ]}
                  >
                    {item?.instDueAmount || 'N/A'}
                  </Text>
                </View>

                <Button
                  title="View Branches"
                  onPress={() => handleZonePress(item.zone)}
                  variant="secondary"
                  size="sm"
                  style={{ marginTop: 22 }}
                />

                <View style={CommonStyles.divider} />
              </View>
            )}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

// const styles = StyleSheet.create({
//   backgroundImage: { flex: 1 },

//   list: {
//     paddingVertical: AppSizes.Margin_Vertical_20,
//     rowGap: AppSizes.Gap_20,
//   },
//   item: {
//     // borderRadius: 12,
//     // padding: 16,
//     // rowGap: AppSizes.Margin_Vertical_10,

//     // elevation: 14,
//     // shadowColor: '#000',
//     // shadowOffset: { width: 0, height: 2 },
//     // shadowOpacity: 0.8,
//     // shadowRadius: 4,
//     marginHorizontal: AppSizes.Margin_Horizontal_20,
//     elevation: 14,
//     backgroundColor: 'white',
//     padding: 16,
//     rowGap: AppSizes.Margin_Vertical_10,
//     borderRadius: 12,
//   },
//   title: { fontSize: AppSizes.Font_20, fontFamily: fonts.semiBold },
//   subtitle: { fontSize: AppSizes.Font_14, fontFamily: fonts.semiBold, flex:1.5 },
//   value: {
//     // fontWeight: 'bold',
//     flex:1.5,
//     fontFamily: fonts.semiBold,
//     // padding: AppSizes.Padding_Horizontal_5,
//     // borderRadius: AppSizes.Radius_15,
//     textAlign:'right'
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     // marginVertical: 2,
//   },
//   divider: {
//     // marginBottom: 12,
//     marginHorizontal: AppSizes.Gap_30,
//     // marginTop: AppSizes.Margin_Vertical_20,
//     borderWidth: 0.5,
//     borderTopColor: '#ccc',
//   },
// });
