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
  const branch = route?.params?.branch ?? users?.branch;
  const [avos, setAvos] = React.useState<any[]>([]);
  const [loading, setLoading] = useState(false);


  
  useEffect(() => {
    getAVos();
  }, []);



  const getAVos = async () => {
    setLoading(true);
    const response = await API_Config.getBranchesAVOs({
      ID: users?.empId,
      BranchID: branch,
    });

    if (response.success) {
      //console.log(response.data.data);
      setAvos(response.data.data);
      console.log('data is : ', response.data.data);

      const data = response.data.data;



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

  

  return (
    <SafeAreaView edges={['top']} style={CommonStyles.mainContainer}>

      <Header title="AVO's" subtitle="Branch's AVOs" showBackButton />

      {loading ? (
        <Loader title={'Loading AVOs'} />
      ) : (
       

              <AvosData
              avos={avos}
              onRefresh={()=>getAVos()}
              refreshing={loading}
              />

      )}
    </SafeAreaView>
  );
};


interface AvoDataProps {
  avos: any,
  refreshing: any,
  onRefresh?: any
}

export const AvosData = ({
  avos,
  refreshing,
  onRefresh

}: AvoDataProps) => {


  const { theme } = useTheme();
  const navigation = useNavigation<any>();

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
    <FlatList
      data={avos}
      keyExtractor={item => item.id}
      onRefresh={() => onRefresh()}
      refreshing={refreshing}
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
  )

}
