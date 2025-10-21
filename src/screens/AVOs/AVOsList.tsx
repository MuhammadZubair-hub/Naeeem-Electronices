import React, { use, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  Alert,
  ScrollView,
  BackHandler,
} from 'react-native';
import { Button } from '../../components/common/Button';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import { Header } from '../../components/common/Header';
import { screenName } from '../../navigation/ScreenName';
import { API_Config } from '../../services/apiServices';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { fonts } from '../../assets/fonts/Fonts';
import { AppSizes } from '../../utils/AppSizes';
import Loader from '../../components/common/Loader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { showMessage } from 'react-native-flash-message';
import { CommonStyles } from '../../styles/GlobalStyle';
import EmptyComponents from '../../components/common/EmptyComponents';
import { HorizontalStackedBarGraph } from '../../components/charts/BarGraphHorizontal';
import { Card } from '../../components/common';
import MainHeader from '../../components/common/MainHeader';

interface AVO {
  region: string;
  total: number;
  paid: number;
  due: number;
}

export const AVOsList: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const users = useSelector((state: RootState) => state.auth.user);
  const  branch  = route?.params?.branch ?? users?.branch;

  const Id = useSelector((state: RootState) => state.auth.user?.empId);

  

  const [avos, setAvos] = React.useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [allAVOsTotal, setAlAVOTotal] = useState<AVO[]>([]);
  const [ZonesCountData, setZonesCountData] = useState<{
    totalCount: number;
    dueCount: number;
    paidCount: number;
  }>({ totalCount: 0, dueCount: 0, paidCount: 0 });


  if (users?.designation == "AVM") {
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

  useEffect(() => {
    console.log('id is ', Id, 'branch is is ', branch);

    getAVos();
  }, []);



  const getAVos = async () => {
    setLoading(true);
    const response = await API_Config.getBranchesAVOs({
      ID: Id,
      BranchID: branch,
    });

    if (response.success) {
      //console.log(response.data.data);
      setAvos(response.data.data);
      console.log('data is : ', response.data.data);

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

      setAlAVOTotal(formatted);

      setLoading(false);
    } else {
      setLoading(false);
      showMessage({
        message: 'Error',
        description: response.data.message,
        type: 'danger',
        style: CommonStyles.error,
      });

      //console.log('the error is : ', response.message);
      return;
    }
  };

  const handleAVOPress = (item: any) => {
    // navigation.navigate(screenName.BranchList, { zoneId: zone.id });
    // console.log('navigating items are', item);
    if (item?.assigenedId == '') {
      showMessage({
        message: 'Error',
        description: 'Please Assign data to AVO',
        type: 'danger',
        style: CommonStyles.error,
      });
      return;
    }

    if (item?.instDueAmount == '0') {
      showMessage({
        message: 'Error',
        description: 'No dues are pending against this AVO.',
        type: 'danger',
        style: CommonStyles.error,
      });
      return;
    }

    //console.log('navigating to the customers list', item?.assigenedId);

    navigation.navigate(screenName.CustomerList, { AvoId: item?.assigenedId });
  };

  return (
    <SafeAreaView edges={['top']} style={CommonStyles.mainContainer}>
     
     {users?.designation =='AVM' ?  (<MainHeader title={users.firstName} subTitle={users.designation} />
      ) : (
      <Header title="AVO's" subtitle="Branch's AVOs" showBackButton />
      )}
      {loading ? (
        <Loader title={'Loading AVOs...'} />
      ) : (
        <ScrollView>
          {users?.designation =='AVM' && (
            <>
              <HorizontalStackedBarGraph
                title={'AVOs stats'}
                data={allAVOsTotal}
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
            data={avos}
            keyExtractor={item => item.id}
            onRefresh={() => getAVos()}
            refreshing={loading}
            ListEmptyComponent={() => (
              <EmptyComponents emptyMessage="Not any AVO found..." />
            )}
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
                    },
                  ]}
                >
                  {item.assignedName || 'N/A'}
                </Text>

                <View style={CommonStyles.row}>
                  <Text
                    style={[
                      CommonStyles.subtitle,
                      {
                        color: theme.colors.textSecondary,
                      },
                    ]}
                  >
                    Total Outstand :
                  </Text>
                  <Text
                    style={[
                      CommonStyles.value,
                      {
                        color: theme.colors.black,
                      },
                    ]}
                  >
                    {item.instTotalAmount || 'N/A'}
                  </Text>
                </View>

                <View style={CommonStyles.row}>
                  <Text
                    style={[
                      CommonStyles.subtitle,
                      {
                        color: theme.colors.textSecondary,
                      },
                    ]}
                  >
                    Total Paid :
                  </Text>
                  <Text
                    style={[
                      CommonStyles.value,
                      {
                        color: theme.colors.success,
                      },
                    ]}
                  >
                    {item.instRecAmount || 'N/A'}
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
                    {item.instDueAmount || 'N/A'}
                  </Text>
                </View>

                <Button
                  title="View AVO"
                  onPress={() => handleAVOPress(item)}
                  variant="secondary"
                  size="sm"
                  style={{ marginTop: 22 }}
                />
                <View style={CommonStyles.divider}></View>
              </View>
            )}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

// const styles = StyleSheet.create({
//   backgroundImage: { flex: 1, width: '100%', height: '100%' },
//   overlay: {
//     // ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'white',
//   },
//   safeArea: { flex: 1, paddingBottom: 20 },
//   list: {
//     paddingVertical: AppSizes.Margin_Vertical_20,
//     rowGap: AppSizes.Gap_20,
//   },
//   item: {
//     marginHorizontal: AppSizes.Margin_Horizontal_20,
//     elevation: 14,
//     backgroundColor: 'white',
//     padding: 16,
//     rowGap: AppSizes.Margin_Vertical_10,
//     borderRadius: 12,
//   },
//   title: { fontSize: AppSizes.Font_20, fontFamily: fonts.semiBold },
//   subtitle: { fontSize: AppSizes.Font_14, fontFamily: fonts.semiBold },
// });
