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

const { width } = Dimensions.get('window');

// Branch interface is now imported from mockDataService
type RootStackParamList = {
  AVOsList: { branch: string };
};

export const BranchList: React.FC = () => {
  const route = useRoute();
  const { zoneId } = route?.params as { zoneId: any} ;
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false);

  const [branches, setBranches] = useState();
  const Id = useSelector((state: RootState) => state.auth.user?.empId);
  const zoneCode = "";

  useEffect(() => {
    getAllBranches();
  }, []);

  // useEffect(()=>{

  //   if()
  // },[])

  const getAllBranches = async () => {
    setLoading(true);
    const response = await API_Config.getZoneBranches({ ID: Id, Zone: zoneId });

    if (response.success) {
      //console.log('braches are  : ', response.data.data);
      setBranches(response.data.data);
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
    //console.log('itme passsing is ', item);
    navigation.navigate('AVOsList', { branch: item?.branchCode });
  };

  return (
    <SafeAreaView 
    edges={['top']}
    style={CommonStyles.mainContainer}>

      {zoneCode && <Text> i am intial screen</Text>}
    
        {zoneCode ?(
         <MainHeader
         title='you'
         subTitle='YOus'
         />
        ):(
           <Header title="Branches" subtitle="Zone's Branches" showBackButton />
        )}

        {loading ? (
          <Loader title={'Loading Branches...'} />
        ) : (
          <FlatList
            data={branches}
            keyExtractor={item => item.id}
            contentContainerStyle={CommonStyles.list}
            onRefresh={() => getAllBranches()}
            refreshing={loading}
            ListEmptyComponent={() => (<EmptyComponents emptyMessage='No Branche found...'/>)}       
            renderItem={({ item }) => (
              <View
                style={[{ backgroundColor: theme.colors.surface }, CommonStyles.item]}
              >
                <View
                  style={CommonStyles.row}
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
                    {item.branchName}
                  </Text>
                  <Text
                    style={[CommonStyles.subtitle, { color: theme.colors.secondary ,flex:0}]}
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
                  <Text style={[CommonStyles.value, { color: theme.colors.black }]}>
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
                  <Text style={[CommonStyles.value, { color: theme.colors.success }]}>
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
                  <Text style={[CommonStyles.value, { color: theme.colors.warning }]}>
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
