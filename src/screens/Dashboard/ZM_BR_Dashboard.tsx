import React, { use, useEffect, useState } from 'react';
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
import { BranchesData } from '../Branch/BranchList';


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

export const ZM_BR_Dashboard: React.FC = () => {
  const route = useRoute<any>();

  const users = useSelector((state: RootState) => state.auth.user);
  const zoneId = route?.params?.Zone ?? users?.zone;
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

  const Id = users?.empId;

  console.log('emp id :', Id),
    useEffect(() => {
      getAllBranches();
    }, []);

 

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


  const getAllBranches = async () => {
    setLoading(true);
    console.log('user data is ' ,users);
    console.log(zoneId);
    const response = await API_Config.getZoneBranches({ ID: Id, Zone: zoneId });
    console.log('response is : ', response);

    if (response.data?.status) {
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

 

  return (
    <SafeAreaView edges={['top']} style={CommonStyles.mainContainer}>
      <MainHeader title={users?.firstName} subTitle={users?.designation} />

      {loading ? (
        <Loader title={'Loading Branches'} />
      ) : (
        <ScrollView  
        
        refreshControl={
          <RefreshControl
          refreshing={loading}
            onRefresh={() => getAllBranches()}
          />
        }
        >
        
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
           

          <BranchesData branchdata={branches} refreshing={loading} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};


