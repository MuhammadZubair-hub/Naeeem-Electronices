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
  Alert,
  BackHandler,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
  NavigationProp,
} from '@react-navigation/native';
import { RootState } from '../../redux/store';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../../components/common/Button';
import { Header } from '../../components/common/Header';
import { API_Config } from '../../services/apiServices';
import { fonts } from '../../assets/fonts/Fonts';
import { AppSizes } from '../../utils/AppSizes';
import Loader from '../../components/common/Loader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { showMessage } from 'react-native-flash-message';
import { CommonStyles } from '../../styles/GlobalStyle';
import EmptyComponents from '../../components/common/EmptyComponents';
import MainHeader from '../../components/common/MainHeader';
import { Card } from '../../components/common';
import { HorizontalStackedBarGraph } from '../../components/charts/BarGraphHorizontal';

const { width } = Dimensions.get('window');

// Branch interface is now imported from mockDataService
type RootStackParamList = {
  AVOsList: { branch: string };
};

interface Branch {
  region: string;
  total: number;
  paid: number;
  due: number;
}

export const BranchList: React.FC = () => {
  const route = useRoute();

  const users = useSelector((state: RootState) => state.auth.user);

  const zoneId = route?.params?.zoneId ?? users?.zone;
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false);

  const [branches, setBranches] = useState();

  const [allZonesTotal, setAllZoneTotal] = useState<Branch[]>([]);
  const [branchCountData, setBranchCountData] = useState<{
    totalCount: number;
    dueCount: number;
    paidCount: number;
  }>({ totalCount: 0, dueCount: 0, paidCount: 0 });

  const Id = useSelector((state: RootState) => state.auth.user?.empId);

  console.log('emp id :', Id),
    useEffect(() => {
      getAllBranches();
    }, []);

if (users?.designation == "ZM") {
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

  const getAllBranches = async () => {
    setLoading(true);
    const response = await API_Config.getZoneBranches({ ID: Id, Zone: zoneId });

    if (response.success) {
      //console.log('braches are  : ', response.data.data);
      setBranches(response.data.data);

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

        setBranchCountData(count);
      }

      console.log(data, 'horizontal data fetched');
      const formatted = data.map((item: any, index: number) => ({
        region: item.branchCode,
        total: parseInt(String(item.instTotalAmount).replace(/,/g, ''), 10),

        paid: parseInt(String(item.instRecAmount).replace(/,/g, ''), 10),
        due: parseInt(String(item.instDueAmount).replace(/,/g, ''), 10),
        // total: parseFloat(item.instTotalAmount),
        // paid: parseFloat(item.instRecAmount),
        // due: parseFloat(item.instDueAmount),
      }));

      setAllZoneTotal(formatted);

      setLoading(false);
    } else {
      setLoading(false);
      showMessage({
        message: 'Error',
        description: response.data.message,
        type: 'danger',
        style: CommonStyles.error,
      });
      //console.log('response erro', response.message);
    }
  };

  const handleBranchPress = (item: any) => {
    console.log('iam presss');
    //console.log('itme passsing is ', item);
    navigation.navigate('AVOsList', { branch: item?.branchCode });
  };




  return (
    <SafeAreaView edges={['top']} style={CommonStyles.mainContainer}>
      {users?.designation == 'ZM' ? (
        <MainHeader title={users.firstName} subTitle={users.designation} />
      ) : (
        <Header title="Branches" subtitle="Zone's Branches" showBackButton />
      )}

      {loading ? (
        <Loader title={'Loading Branches...'} />
      ) : (
        <ScrollView>
          {users?.designation == 'ZM' && (
            <>
              <HorizontalStackedBarGraph
                title={'Branches stats'}
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
                    {branchCountData.totalCount.toLocaleString()}
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
                    {branchCountData.paidCount.toLocaleString()}
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
                    {branchCountData.dueCount.toLocaleString()}
                  </Text>
                </View>
              </Card>
            </>
          )}

          <FlatList
            data={branches}
            keyExtractor={item => item.id}
            contentContainerStyle={CommonStyles.list}
            onRefresh={() => getAllBranches()}
            refreshing={loading}
            ListEmptyComponent={() => (
              <EmptyComponents emptyMessage="No Branche found..." />
            )}
            renderItem={({ item }) => (
              <View
                style={[
                  { backgroundColor: theme.colors.surface },
                  CommonStyles.item,
                ]}
              >
                <View style={CommonStyles.row}>
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
                    {item.branchName}
                  </Text>
                  <Text
                    style={[
                      CommonStyles.subtitle,
                      { color: theme.colors.secondary, flex: 0 },
                    ]}
                  >
                    ( {item?.branchCode || 'N/A'})
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
                    {item.instTotalAmount || 'N/A'}
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
                  title="View Branch AVO's"
                  onPress={() => handleBranchPress(item)}
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
//   container: { flex: 1 },
//   backgroundImage: { flex: 1, width: '100%', height: '100%' },

//   safeArea: { flex: 1 },
//   list: {
//     paddingVertical: AppSizes.Padding_Vertical_20,
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

//   value: {
//     fontFamily: fonts.semiBold,
//     fontSize: AppSizes.Font_14,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems:'center'
//   },
//   divider: {
//     // marginVertical: 12,
//     marginHorizontal: AppSizes.Gap_30,
//     borderWidth: 0.5,
//     borderTopColor: '#ccc',
//   },
// });
