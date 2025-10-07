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
      <View style={styles.overlay} />

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
                      fontFamily: fonts.extraBoldItalic,
                      fontSize: AppSizes.Font_20,
                      marginVertical: AppSizes.Margin_Vertical_10,
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

                {/* <View style={styles.row}>
                  <Text
                    style={[
                      styles.subtitle,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    Manager :
                  </Text>
                  <Text
                    style={[styles.value, { color: theme.colors.secondary }]}
                  >
                    {item.zmName || 'N/A'}
                  </Text>
                </View> */}

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
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
  },
  safeArea: { flex: 1, paddingBottom: 20 },
  list: { padding: AppSizes.Padding_Vertical_15, rowGap: AppSizes.Gap_20 },
  item: {
    borderRadius: 12,
    padding: 16,
    elevation: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  subtitle: { fontSize: 14, fontWeight: 'bold' },
  value: {
    fontWeight: 'bold',
    padding: AppSizes.Padding_Horizontal_5,
    borderRadius: AppSizes.Radius_15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  divider: {
    marginVertical: 12,
    marginHorizontal: AppSizes.Gap_30,
    borderWidth: 0.5,
    borderTopColor: '#ccc',
  },
});

// export const ZoneList: React.FC = () => {
//   const { theme } = useTheme();
//   const navigation = useNavigation<any>();
//   const route = useRoute<any>();
//   const { data } = route.params;
//   // const zones = mockDataService.getZonesByRegion(regionId);

//   const [zoneData, setZoneData] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const Id = useSelector((state: RootState) => state.auth.user?.empId);
//   useEffect(() => {
//     getAllZones();
//   }, []);

//   const getAllZones = async () => {
//     try {
//       setLoading(true);
//       console.log('user id is: ', Id);
//       console.log('user id is: ', data);
//       const response = await API_Config.getZones({ ID: Id, Region: data });
//       console.log('Zone API Response:', response);
//       if (response?.success) {
//         setZoneData(response.data.data);
//         console.log('Regions data:', response.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching regions:', error);
//     } finally {
//       // setIsLoading(false);
//       setLoading(false);
//     }
//   };

//   const handleZonePress = (zone: any) => {
//     console.log('id is : ', zone);
//     navigation.navigate(screenName.BranchList, { zoneId: zone });
//     //navigation.navigate(screenName.AVOsList, { zoneId: zone.id });
//   };

//   return (
//     <View style={styles.container}>
//       {/* Background Image + Overlay */}
//       <ImageBackground

//         blurRadius={10}
//         source={require('../../assets/images/loginbackground.jpg')}
//         style={styles.backgroundImage}
//         resizeMode="cover"
//       >
//         <View style={styles.overlay} />

//         <View
//       style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
//     >
//       <Header title="Zones" subtitle="Zonal Managers" showBackButton />
//       {loading ? (
//         <Loader />
//       ) : (
//         <View style={{ margin: AppSizes.Margin_Vertical_10 }}>
//           <>

//             <FlatList
//               data={zoneData}
//               keyExtractor={item => item.id}
//               ListEmptyComponent={() => {
//                 <View>
//                   <Text>No Item Found</Text>
//                 </View>;
//               }}
//               renderItem={({ item }) => (
//                 <View
//                   style={[
//                     { backgroundColor: theme.colors.surface },
//                     styles.item,
//                   ]}
//                 >
//                   <Text
//                     style={[
//                       styles.title,
//                       {
//                         color: theme.colors.secondary,
//                         fontFamily: fonts.extraBoldItalic,
//                         fontSize: AppSizes.Font_20,
//                         marginVertical: AppSizes.Margin_Vertical_10,
//                       },
//                     ]}
//                   >
//                     {item.zone}
//                   </Text>

//                   <View
//                     style={{
//                       flexDirection: 'row',
//                       justifyContent: 'space-between',
//                     }}
//                   >
//                     <Text
//                       style={[
//                         styles.subtitle,
//                         {
//                           color: theme.colors.textSecondary,
//                           fontSize: AppSizes.Font_14,
//                           fontWeight: 'bold',
//                         },
//                       ]}
//                     >
//                       Total Amount :
//                     </Text>
//                     <Text
//                       style={[
//                         styles.subtitle,
//                         {
//                           color: theme.colors.black,
//                           fontWeight: 'bold',
//                           backgroundColor: theme.colors.white,
//                           padding: AppSizes.Padding_Horizontal_5,
//                           borderRadius: AppSizes.Radius_15,
//                         },
//                       ]}
//                     >
//                       {item.instTotalAmount || 'N/A'}
//                     </Text>
//                   </View>

//                   <View
//                     style={{
//                       flexDirection: 'row',
//                       justifyContent: 'space-between',
//                     }}
//                   >
//                     <Text
//                       style={[
//                         styles.subtitle,
//                         {
//                           color: theme.colors.textSecondary,
//                           fontSize: AppSizes.Font_14,
//                           fontWeight: 'bold',
//                         },
//                       ]}
//                     >
//                       Paid Amount :
//                     </Text>
//                     <Text
//                       style={[
//                         styles.subtitle,
//                         {
//                           color: theme.colors.success,
//                           fontWeight: 'bold',
//                           backgroundColor: 'rgba(109, 207, 18, 0.12)',
//                           padding: AppSizes.Padding_Horizontal_5,
//                           borderRadius: AppSizes.Radius_15,
//                         },
//                       ]}
//                     >
//                       {item.instRecAmount || 'N/A'}
//                     </Text>
//                   </View>

//                   <View
//                     style={{
//                       flexDirection: 'row',
//                       justifyContent: 'space-between',
//                     }}
//                   >
//                     <Text
//                       style={[
//                         styles.subtitle,
//                         {
//                           color: theme.colors.textSecondary,
//                           fontSize: AppSizes.Font_14,
//                           fontWeight: 'bold',
//                         },
//                       ]}
//                     >
//                       Due Amount :
//                     </Text>
//                     <Text
//                       style={[
//                         styles.subtitle,
//                         {
//                           color: theme.colors.warning,
//                           fontWeight: 'bold',
//                           backgroundColor: 'rgba(109, 207, 18, 0.12)',
//                           padding: AppSizes.Padding_Horizontal_5,
//                           borderRadius: AppSizes.Radius_15,
//                         },
//                       ]}
//                     >
//                       {item.instDueAmount || 'N/A'}
//                     </Text>
//                   </View>

//                   <View
//                     style={{
//                       flexDirection: 'row',
//                       justifyContent: 'space-between',
//                     }}
//                   >
//                     <Text
//                       style={[
//                         styles.subtitle,
//                         {
//                           color: theme.colors.textSecondary,
//                           fontSize: AppSizes.Font_14,
//                           fontWeight: 'bold',
//                         },
//                       ]}
//                     >
//                       Zone Branches :
//                     </Text>
//                     <Text
//                       style={[
//                         styles.subtitle,
//                         {
//                           color: theme.colors.secondary,
//                           fontWeight: 'bold',
//                           backgroundColor: 'rgba(7, 7, 7, 0.12)',
//                           padding: AppSizes.Padding_Horizontal_5,
//                           borderRadius: AppSizes.Radius_15,
//                         },
//                       ]}
//                     >
//                       {item.zoneBranches || 'N/A'}
//                     </Text>
//                   </View>

//                   <Button
//                     title="View Zones"
//                     onPress={() => handleZonePress(item.zone)}
//                     variant="secondary"
//                     size="sm"
//                     style={{ marginTop: 22 }}
//                   />
//                   <View
//                     style={{
//                       marginVertical: 12,
//                       marginTop: AppSizes.Margin_Vertical_20,
//                       borderWidth: 0.5,
//                       borderTopColor: theme.colors.secondary,
//                     }}
//                   ></View>
//                 </View>
//               )}
//               contentContainerStyle={styles.list}
//             />
//           </>
//         </View>
//       )}
//     </View>
//       </ImageBackground>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, paddingBottom: 100 },
//   backgroundImage: { flex: 1, width: "100%", height: "100%" },
//   safeArea: { flex: 1, backgroundColor: "transparent", zIndex: 2 },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: "rgba(0,0,0,0.4)",
//     zIndex: 1,
//   },
//   list: { padding: AppSizes.Padding_Vertical_15, rowGap: AppSizes.Gap_20 },
//   item: {
//     borderRadius: 12,
//     padding: 16,
//     // marginBottom: 16,
//     elevation: 2,
//   },
//   title: { fontSize: 18, fontWeight: 'bold' },
//   subtitle: { fontSize: 14, marginTop: 4 },

//   summaryCard: {
//     marginHorizontal: 20,
//     marginBottom: 20,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontFamily: 'Poppins-SemiBold',
//     marginBottom: 16,
//   },
//   summaryGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   summaryItem: {
//     width: '48%',
//     marginBottom: 16,
//   },
//   summaryValue: {
//     fontSize: 20,
//     fontFamily: 'Poppins-Bold',
//     marginBottom: 4,
//   },
//   summaryLabel: {
//     fontSize: 12,
//     fontFamily: 'Poppins-Regular',
//   },
//   branchList: {
//     paddingHorizontal: 20,
//     marginBottom: 20,
//   },
// });
