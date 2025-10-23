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
  const route = useRoute<any>();

  const users = useSelector((state: RootState) => state.auth.user);

  const zoneId = route?.params?.Zone ?? users?.zone;
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState();

  useEffect(() => {
    getAllBranches();
  }, []);

  const getAllBranches = async () => {
    setLoading(true);
    console.log('user data is ', users);
    console.log(zoneId);
    const response = await API_Config.getZoneBranches({
      ID: users?.empId,
      Zone: zoneId,
    });
    console.log('response is : ', response);

    if (response.data?.status) {
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
    console.log('iam presss');
    //console.log('itme passsing is ', item);
    navigation.navigate('AVOsList', { branch: item?.branchCode });
  };

  return (
    <SafeAreaView edges={['top']} style={CommonStyles.mainContainer}>
      <Header title="Branches" subtitle="Zone's Branches" showBackButton />
      {loading ? (
        <Loader title={'Loading Branches'} />
      ) : (
        // <FlatList
        //   data={branches}
        //   keyExtractor={item => item.id}
        //   contentContainerStyle={CommonStyles.list}
        //   onRefresh={() => getAllBranches()}
        //   refreshing={loading}
        //   ListEmptyComponent={() => (
        //     <EmptyComponents emptyMessage="Something went wrong " />
        //   )}
        //   renderItem={({ item }) => (
        //     <View
        //       style={[
        //         { backgroundColor: theme.colors.surface },
        //         CommonStyles.item,
        //       ]}
        //     >
        //       <View style={CommonStyles.row}>
        //         <Text
        //           style={[
        //             CommonStyles.title,
        //             {
        //               color: theme.colors.secondaryDark,
        //               fontFamily: fonts.bold,
        //               fontSize: AppSizes.Font_20,
        //             },
        //           ]}
        //         >
        //           {item.branchName}
        //         </Text>
        //         <Text
        //           style={[
        //             CommonStyles.subtitle,
        //             { color: theme.colors.secondary, flex: 0 },
        //           ]}
        //         >
        //           ( {item?.branchCode || 'N/A'})
        //         </Text>
        //       </View>

        //       {/* Amounts */}
        //       <View style={CommonStyles.row}>
        //         <Text
        //           style={[
        //             CommonStyles.subtitle,
        //             { color: theme.colors.textSecondary },
        //           ]}
        //         >
        //           Total Outstand :
        //         </Text>
        //         <Text
        //           style={[CommonStyles.value, { color: theme.colors.black }]}
        //         >
        //           {item.instTotalAmount || 'N/A'}
        //         </Text>
        //       </View>

        //       <View style={CommonStyles.row}>
        //         <Text
        //           style={[
        //             CommonStyles.subtitle,
        //             { color: theme.colors.textSecondary },
        //           ]}
        //         >
        //           Total Paid :
        //         </Text>
        //         <Text
        //           style={[CommonStyles.value, { color: theme.colors.success }]}
        //         >
        //           {item.instRecAmount || 'N/A'}
        //         </Text>
        //       </View>

        //       <View style={CommonStyles.row}>
        //         <Text
        //           style={[
        //             CommonStyles.subtitle,
        //             { color: theme.colors.textSecondary },
        //           ]}
        //         >
        //           Total Due :
        //         </Text>
        //         <Text
        //           style={[CommonStyles.value, { color: theme.colors.warning }]}
        //         >
        //           {item.instDueAmount || 'N/A'}
        //         </Text>
        //       </View>

        //       <Button
        //         title="View Branch AVO's"
        //         onPress={() => handleBranchPress(item)}
        //         variant="secondary"
        //         size="sm"
        //         style={{ marginTop: 22 }}
        //       />
        //       <View style={CommonStyles.divider} />
        //     </View>
        //   )}
        // />

        <BranchesData
          branchdata={branches}
          onRefresh={getAllBranches}
          refreshing={loading}
        />
      )}
    </SafeAreaView>
  );
};

interface BranchesDataProps {
  branchdata: any;
  onRefresh?: any;
  refreshing: boolean;
}

export const BranchesData = ({
  branchdata,
  onRefresh,
  refreshing,
}: BranchesDataProps) => {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleBranchPress = (item: any) => {
    console.log('iam presss');
    //console.log('itme passsing is ', item);
    navigation.navigate('AVOsList', { branch: item?.branchCode });
  };

  return (
    <FlatList
      data={branchdata}
      keyExtractor={item => item.id}
      contentContainerStyle={CommonStyles.list}
      onRefresh={() => onRefresh()}
      refreshing={refreshing}
      ListEmptyComponent={() => (
        <EmptyComponents emptyMessage="Something went wrong " />
      )}
      renderItem={({ item }) => (
        <View
          style={[{ backgroundColor: theme.colors.surface }, CommonStyles.item]}
        >
          <View style={CommonStyles.row}>
            <Text
              style={[
                CommonStyles.title,
                {
                  color: theme.colors.secondaryDark,
                  fontFamily: fonts.bold,
                  fontSize: AppSizes.Font_20,
                  flex: 0.7,
                },
              ]}
            >
              {item.branchName}
            </Text>
            <Text
              style={[
                CommonStyles.subtitle,
                {
                  color: theme.colors.secondary,
                  textAlign: 'right',
                  flex: 0.3,
                },
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
  );
};
