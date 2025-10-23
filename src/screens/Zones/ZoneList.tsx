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
  const route = useRoute<any>();
  const users = useSelector((state: RootState) => state.auth.user);
  const data = route?.params?.data ?? users?.region;
  const [zoneData, setZoneData] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(false);

  const Id = useSelector((state: RootState) => state.auth.user?.empId);
  const [showGraph, setShowGraph] = useState(false);

  useEffect(() => {
    getAllZones();
  }, []);

  const getAllZones = async () => {
    try {
      setLoading(true);
      //console.log('the data is : ', Id, data);
      const response = await API_Config.getZones({ ID: Id, Region: data });
      // console.log('zones are ', response);
      if (response?.success) {
        setZoneData(response.data.data);

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

  return (
    <SafeAreaView edges={['top']} style={CommonStyles.mainContainer}>
      <Header title="Zones" subtitle="Region's Zones" showBackButton />
      {loading ? (
        <Loader title={'Loading Zones'} />
      ) : (
        <ZonesData
          zoneData={zoneData}
          refreshing={loading}
          onRefresh={() => getAllZones()}
        />
      )}
    </SafeAreaView>
  );
};

interface ZoneDataProps {
  zoneData: any;
  refreshing: any;
  onRefresh?: any;
}

export const ZonesData = ({
  zoneData,
  refreshing,
  onRefresh,
}: ZoneDataProps) => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();

  const handleZonePress = (zone: any) => {
    navigation.navigate(screenName.BranchList, { Zone: zone });
    //  navigation.navigate(screenName.BranchList,);
  };

  return (
    <FlatList
      data={zoneData}
      nestedScrollEnabled={false}
      scrollEnabled
      onRefresh={onRefresh}
      refreshing={refreshing}
      keyExtractor={item => item.id}
      ListEmptyComponent={() => <EmptyComponents />}
      contentContainerStyle={CommonStyles.list}
      renderItem={({ item }) => (
        <View
          style={[{ backgroundColor: theme.colors.surface }, CommonStyles.item]}
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
              style={[CommonStyles.value, { color: theme.colors.secondary }]}
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
            <Text style={[CommonStyles.value, { color: theme.colors.black }]}>
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
            <Text style={[CommonStyles.value, { color: theme.colors.success }]}>
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
            <Text style={[CommonStyles.value, { color: theme.colors.warning }]}>
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
  );
};
