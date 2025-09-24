import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Button } from '../../components/common/Button';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import { Header } from '../../components/common/Header';
import { mockDataService } from '../../services/mock/mockDataService';
import { screenName } from '../../navigation/ScreenName';
import { API_Config } from '../../services/apiServices';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { AppSizes } from '../../utils/AppSizes';
import Loader from '../../components/common/Loader';
import { fonts } from '../../assets/fonts/Fonts';
import { Card } from '../../components/common';

export const ZoneList: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { data } = route.params;
  // const zones = mockDataService.getZonesByRegion(regionId);

  const [zoneData, setZoneData] = useState([]);
  const [loading, setLoading] = useState(false);

  const Id = useSelector((state: RootState) => state.auth.user?.empId);
  useEffect(() => {
    getAllZones();
  }, []);

  const getAllZones = async () => {
    try {
      setLoading(true);
      console.log('user id is: ', Id);
      console.log('user id is: ', data);
      const response = await API_Config.getZones({ ID: Id, Region: data });
      console.log('Zone API Response:', response);
      if (response?.success) {
        setZoneData(response.data.data);
        console.log('Regions data:', response.data.data);
      }
    } catch (error) {
      console.error('Error fetching regions:', error);
    } finally {
      // setIsLoading(false);
      setLoading(false);
    }
  };

  const handleZonePress = (zone: any) => {
    console.log('id is : ', zone);
    navigation.navigate(screenName.BranchList, { zoneId: zone });
    //navigation.navigate(screenName.AVOsList, { zoneId: zone.id });
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Header title="Zones" subtitle="Zonal Managers" showBackButton />
      {loading ? (
        <Loader />
      ) : (
        <View style={{ margin: AppSizes.Margin_Vertical_10 }}>
          <>
            {/* Summary Stats */}
            {/* <Card style={styles.summaryCard} padding="lg">
              <Text
                style={[
                  styles.sectionTitle,
                  { color: theme.colors.textPrimary },
                ]}
              >
                Branch Overview
              </Text>
              <View style={styles.summaryGrid}>
                <View style={styles.summaryItem}>
                  <Text
                    style={[
                      styles.summaryValue,
                      { color: theme.colors.primary },
                    ]}
                  >
                    29
                  </Text>
                  <Text
                    style={[
                      styles.summaryLabel,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    Total Branches
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text
                    style={[
                      styles.summaryValue,
                      { color: theme.colors.success },
                    ]}
                  >
                   9
                  </Text>
                  <Text
                    style={[
                      styles.summaryLabel,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    Total Revenue
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text
                    style={[
                      styles.summaryValue,
                      { color: theme.colors.warning },
                    ]}
                  >
                   10
                  </Text>
                  <Text
                    style={[
                      styles.summaryLabel,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    Total Customers
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text
                    style={[styles.summaryValue, { color: theme.colors.error }]}
                  >
                    10
                  </Text>
                  <Text
                    style={[
                      styles.summaryLabel,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    Total Staff
                  </Text>
                </View>
              </View>
            </Card> */}
            <FlatList
              data={zoneData}
              keyExtractor={item => item.id}
              ListEmptyComponent={() => {
                <View>
                  <Text>No Item Found</Text>
                </View>;
              }}
              renderItem={({ item }) => (
                <View
                  style={[
                    { backgroundColor: theme.colors.surface },
                    styles.item,
                  ]}
                >
                  <Text
                    style={[
                      styles.title,
                      {
                        color: theme.colors.secondary,
                        fontFamily: fonts.extraBoldItalic,
                        fontSize: AppSizes.Font_20,
                        marginVertical: AppSizes.Margin_Vertical_10,
                      },
                    ]}
                  >
                    {item.zone}
                  </Text>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text
                      style={[
                        styles.subtitle,
                        {
                          color: theme.colors.textSecondary,
                          fontSize: AppSizes.Font_14,
                          fontWeight: 'bold',
                        },
                      ]}
                    >
                      Total Amount :
                    </Text>
                    <Text
                      style={[
                        styles.subtitle,
                        {
                          color: theme.colors.black,
                          fontWeight: 'bold',
                          backgroundColor: theme.colors.white,
                          padding: AppSizes.Padding_Horizontal_5,
                          borderRadius: AppSizes.Radius_15,
                        },
                      ]}
                    >
                      {item.instTotalAmount || 'N/A'}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text
                      style={[
                        styles.subtitle,
                        {
                          color: theme.colors.textSecondary,
                          fontSize: AppSizes.Font_14,
                          fontWeight: 'bold',
                        },
                      ]}
                    >
                      Paid Amount :
                    </Text>
                    <Text
                      style={[
                        styles.subtitle,
                        {
                          color: theme.colors.success,
                          fontWeight: 'bold',
                          backgroundColor: 'rgba(109, 207, 18, 0.12)',
                          padding: AppSizes.Padding_Horizontal_5,
                          borderRadius: AppSizes.Radius_15,
                        },
                      ]}
                    >
                      {item.instRecAmount || 'N/A'}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text
                      style={[
                        styles.subtitle,
                        {
                          color: theme.colors.textSecondary,
                          fontSize: AppSizes.Font_14,
                          fontWeight: 'bold',
                        },
                      ]}
                    >
                      Due Amount :
                    </Text>
                    <Text
                      style={[
                        styles.subtitle,
                        {
                          color: theme.colors.error,
                          fontWeight: 'bold',
                          backgroundColor: 'rgba(255, 0, 0, 0.12)',
                          padding: AppSizes.Padding_Horizontal_5,
                          borderRadius: AppSizes.Radius_15,
                        },
                      ]}
                    >
                      {item.instDueAmount || 'N/A'}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text
                      style={[
                        styles.subtitle,
                        {
                          color: theme.colors.textSecondary,
                          fontSize: AppSizes.Font_14,
                          fontWeight: 'bold',
                        },
                      ]}
                    >
                      Zone Branches :
                    </Text>
                    <Text
                      style={[
                        styles.subtitle,
                        {
                          color: theme.colors.secondary,
                          fontWeight: 'bold',
                          backgroundColor: 'rgba(7, 7, 7, 0.12)',
                          padding: AppSizes.Padding_Horizontal_5,
                          borderRadius: AppSizes.Radius_15,
                        },
                      ]}
                    >
                      {item.zoneBranches || 'N/A'}
                    </Text>
                  </View>

                  <Button
                    title="View Zones"
                    onPress={() => handleZonePress(item.zone)}
                    variant="secondary"
                    size="sm"
                    style={{ marginTop: 22 }}
                  />
                  <View
                    style={{
                      marginVertical: 12,
                      marginTop: AppSizes.Margin_Vertical_20,
                      borderWidth: 0.5,
                      borderTopColor: theme.colors.secondary,
                    }}
                  ></View>
                </View>
              )}
              contentContainerStyle={styles.list}
            />
          </>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingBottom: 100 },
  list: { padding: AppSizes.Padding_Vertical_15, rowGap: AppSizes.Gap_20 },
  item: {
    borderRadius: 12,
    padding: 16,
    // marginBottom: 16,
    elevation: 2,
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  subtitle: { fontSize: 14, marginTop: 4 },

  summaryCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryItem: {
    width: '48%',
    marginBottom: 16,
  },
  summaryValue: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  branchList: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
});
