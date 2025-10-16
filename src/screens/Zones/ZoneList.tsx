import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  Alert,
} from 'react-native';
import { Button } from '../../components/common/Button';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import { Header } from '../../components/common/Header';
import { screenName } from '../../navigation/ScreenName';
import { API_Config } from '../../services/apiServices';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { AppSizes } from '../../utils/AppSizes';
import Loader from '../../components/common/Loader';
import { fonts } from '../../assets/fonts/Fonts';
import { Card } from '../../components/common';
import { SafeAreaView } from 'react-native-safe-area-context';
import { showMessage } from 'react-native-flash-message';
import { CommonStyles } from '../../styles/GlobalStyle';

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

export const ZoneList: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { data } = route.params;

  const [zoneData, setZoneData] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(false);

  const Id = useSelector((state: RootState) => state.auth.user?.empId);

  useEffect(() => {
    getAllZones();
  }, []);

  const getAllZones = async () => {
    try {
      setLoading(true);
      const response = await API_Config.getZones({ ID: Id, Region: data });
      if (response?.success) {
        if (response?.success) {
          setZoneData(response.data.data);
        }
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
    navigation.navigate(screenName.BranchList, { zoneId: zone });
  };

  return (
    <SafeAreaView style={styles.backgroundImage}>
      {/* Overlay for dark shade */}
      {/* <View style={styles.overlay} /> */}

      {/* Main Screen Content */}
      <View style={styles.safeArea}>
        <Header title="Zones" subtitle="Region's Zones" showBackButton />

        {loading ? (
          <Loader title={'Loading Zones...'} />
        ) : (
          <FlatList
            data={zoneData}
            onRefresh={() => getAllZones()}
            refreshing={loading}
            keyExtractor={item => item.id}
            ListEmptyComponent={() => (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 20,
                }}
              >
                <Text
                  style={{
                    color: theme.colors.white,
                    fontFamily: fonts.extraBoldItalic,
                    fontSize: AppSizes.Font_16,
                  }}
                >
                  No Item Found ...
                </Text>
              </View>
            )}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <View
                style={[{ backgroundColor: theme.colors.surface }, styles.item]}
              >
                <Text
                  style={[
                    styles.title,
                    {
                      color: theme.colors.secondaryDark,
                      fontFamily: fonts.bold,
                      fontSize: AppSizes.Font_20,
                      // marginVertical: AppSizes.Margin_Vertical_10,
                    },
                  ]}
                >
                  {item.zmName || 'N/A'}
                </Text>

                <View style={styles.row}>
                  <Text
                    style={[
                      styles.subtitle,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    Zone Branches :
                  </Text>
                  <Text
                    style={[styles.value, { color: theme.colors.secondary }]}
                  >
                    {item.zoneBranches || 'N/A'}
                  </Text>
                </View>

                {/* Amounts */}
                <View style={styles.row}>
                  <Text
                    style={[
                      styles.subtitle,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    Total Outstand :
                  </Text>
                  <Text style={[styles.value, { color: theme.colors.black }]}>
                    {item?.instTotalAmount || 'N/A'}
                  </Text>
                </View>

                <View style={styles.row}>
                  <Text
                    style={[
                      styles.subtitle,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    Total Paid :
                  </Text>
                  <Text style={[styles.value, { color: theme.colors.success }]}>
                    {item?.instRecAmount || 'N/A'}
                  </Text>
                </View>

                <View style={styles.row}>
                  <Text
                    style={[
                      styles.subtitle,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    Total Due :
                  </Text>
                  <Text style={[styles.value, { color: theme.colors.warning }]}>
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

                <View style={styles.divider} />
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  backgroundImage: { flex: 1 },
  overlay: {
    // ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
  },
  safeArea: { flex: 1 },
  list: {
    paddingVertical: AppSizes.Margin_Vertical_20,
    rowGap: AppSizes.Gap_20,
  },
  item: {
    // borderRadius: 12,
    // padding: 16,
    // rowGap: AppSizes.Margin_Vertical_10,

    // elevation: 14,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.8,
    // shadowRadius: 4,
    marginHorizontal: AppSizes.Margin_Horizontal_20,
    elevation: 14,
    backgroundColor: 'white',
    padding: 16,
    rowGap: AppSizes.Margin_Vertical_10,
    borderRadius: 12,
  },
  title: { fontSize: AppSizes.Font_20, fontFamily: fonts.semiBold },
  subtitle: { fontSize: AppSizes.Font_14, fontFamily: fonts.semiBold, flex:1.5 },
  value: {
    // fontWeight: 'bold',
    flex:1.5,
    fontFamily: fonts.semiBold,
    // padding: AppSizes.Padding_Horizontal_5,
    // borderRadius: AppSizes.Radius_15,
    textAlign:'right'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginVertical: 2,
  },
  divider: {
    // marginBottom: 12,
    marginHorizontal: AppSizes.Gap_30,
    // marginTop: AppSizes.Margin_Vertical_20,
    borderWidth: 0.5,
    // borderTopColor: theme.colors.secondary,
  },
});
