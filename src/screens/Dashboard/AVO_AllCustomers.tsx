import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  BackHandler,
  Alert,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { showMessage } from 'react-native-flash-message';
import { useTheme } from '../../hooks/useTheme';
import { Header } from '../../components/common/Header';
import { Button } from '../../components/common/Button';
import { API_Config } from '../../services/apiServices';
import { fonts } from '../../assets/fonts/Fonts';
import { AppSizes } from '../../utils/AppSizes';
import { CommonStyles } from '../../styles/GlobalStyle';
import Loader from '../../components/common/Loader';
import { screenName } from '../../navigation/ScreenName';
import { debounce } from 'lodash';
import Ionicons from '@react-native-vector-icons/ionicons';
import EmptyComponents from '../../components/common/EmptyComponents';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import MainHeader from '../../components/common/MainHeader';
import { HorizontalStackedBarGraph } from '../../components/charts/BarGraphHorizontal';
import { Card } from '../../components/common';
import { AvosData } from '../AVOs/AVOsList';
import { AvosCoustomerData } from '../Customers/CustomerList';



interface Region {
  region: string;
  total: number;
  paid: number;
  due: number;

}

export const AVO_AllCustomers: React.FC = () => {
  const { theme } = useTheme();
  const users = useSelector((state: RootState) => state.auth.user);
  const route = useRoute<any>();
  const AvoId = route?.params?.AvoId ?? users?.assignedId;

  const [customers, setCustomers] = useState<any[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  const [AvoCountData, setAvoCountData] = useState<{
    total: number;
    due: number;
    paid: number;
  }>({ total: 0, due: 0, paid: 0 });
  const [allZonesTotal, setAllZoneTotal] = useState<Region[]>([]);





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



  const getAVOCount = useCallback(async () => {

    const res = await API_Config.getAvoCountDetails({
      AssignedID: AvoId,
    });


    if (res.success) {
      const data = res.data.data;
      console.log('this is is', data);
      const countData = res.data.data[0];
      setAvoCountData(prev => ({
        ...prev,
        total: countData?.instTotalAmount,
        due: countData?.instDueAmount,
        paid: countData?.instRecAmount
      }))


    }

  }, [AvoId])

  const getAllCustomers = useCallback(async () => {
    try {
      // setLoading(true);
      const response = await API_Config.getAllCustomers({ AssignedID: AvoId });
      if (response?.success) {
        const data = response?.data?.data || [];
        console.log('All customers are : ', data);
        setCustomers(data);
        setFilteredCustomers(data);

        //  const formatted = data.map((item: any, index: number) => ({
        //   region: item.customerName,
        //   total: parseInt(String(item.instTotalAmount).replace(/,/g, ''), 10),

        //   paid: parseInt(String(item.balance).replace(/,/g, ''), 10),
        //   due: parseInt(String(item.instDueAmount).replace(/,/g, ''), 10),
        //   // total: parseInt(item.instTotalAmount),
        //   // paid: parseInt(item.instRecAmount),
        //   // due: parseInt(item.instDueAmount),
        // }));

        // setAllZoneTotal(formatted);
        // console.log(formatted,'all zons total is ');

      } else {
        showMessage({
          message: 'Error',
          description: response?.data?.message || 'Failed to load customers',
          type: 'danger',
          style: CommonStyles.error,
        });
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  }, [AvoId]);

  const getAllAvoDetials = useCallback(async () => {
    try {
      setLoading(true);
      await Promise.all([getAVOCount(), getAllCustomers()])

    } catch (error) {
      showMessage({
        message: 'Error',
        description: `${error}`,
        type: 'danger',
        style: CommonStyles.error
      })
    } finally {
      setLoading(false);
    }
  }, [getAVOCount, getAllCustomers]);



  useEffect(() => {
    getAllAvoDetials();
  }, [getAllAvoDetials])


  useEffect(() => {

  }, [allZonesTotal])

  return (
    <SafeAreaView edges={['top']} style={CommonStyles.mainContainer}>
      <StatusBar
        backgroundColor={'#140958'}
        barStyle="light-content"
      />
      <MainHeader title={users?.firstName} subTitle={users?.designation} />

      {loading ? (
        <Loader title="Loading Customers" />
      ) : (
        < >

          {/* <HorizontalStackedBarGraph
            title={'AVOs stats'}
            data={allZonesTotal}
          /> */}

          <Card
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginHorizontal: AppSizes.Margin_Horizontal_20,
              elevation: 12,
              marginTop: AppSizes.Margin_Horizontal_20
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
                {AvoCountData.total}
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
                {AvoCountData.paid}
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
                {AvoCountData.due}
              </Text>
            </View>
          </Card>



          {/* Search Box */}


          {AvoCountData.due == 0 ? (


            <Text
              style={{
                flex: 1,
                marginTop: AppSizes.Margin_Vertical_100,
                justifyContent: 'center',
                textAlign: 'center',
                color: theme.colors.secondaryDark,
                fontFamily: fonts.semiBold,
                fontSize: AppSizes.Font_18
              }}
            > This AVO has no outstanding  amounts against customers. </Text>

          ) : (
            <>
              {/* <View style={styles.searchContainer}>
                <TextInput
                  placeholder="Search Customers"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={searchQuery}
                  onChangeText={handleSearchChange}
                  style={[
                    styles.searchInput,
                    {
                      backgroundColor: theme.colors.surface,
                      color: theme.colors.textPrimary,
                    },
                  ]}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={() => {
                      setSearchQuery('');
                      debouncedSearch('');
                    }}
                  >
                    <Ionicons
                      name="close-circle-outline"
                      size={24}
                      color={theme.colors.secondaryDark}
                    />
                  </TouchableOpacity>
                )}
              </View>



              <FlatList
                data={filteredCustomers}
                keyExtractor={item => item.customerCode.toString()}
                renderItem={renderItem}
                refreshing={loading}
                onRefresh={getAllCustomers}
                contentContainerStyle={{
                  paddingBottom: AppSizes.Padding_Horizontal_20,
                  rowGap: AppSizes.Margin_Vertical_20,
                }}
                ListEmptyComponent={() => (
                  <EmptyComponents 
                  emptyMessage="Not any customer found"
                  emptySubMessage=''
                  />
                )}
                initialNumToRender={15}
                maxToRenderPerBatch={30}
                windowSize={15}
                removeClippedSubviews
                showsVerticalScrollIndicator={false}
              /> */}

              <AvosCoustomerData

                coustomerData={customers}
                refreshing={loading}
                onRefresh={() => getAllAvoDetials()}
              />
            </>
          )



          }

        </>
      )}
    </SafeAreaView>
  );
};

