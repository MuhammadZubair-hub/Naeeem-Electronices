import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ImageBackground,
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

  const [zoneData, setZoneData] = useState([]);
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
        setZoneData(response.data.data);
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
    <ImageBackground
      blurRadius={10}
      source={require('../../assets/images/loginbackground.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      {/* Overlay for dark shade */}
      <View style={styles.overlay} />

      {/* Main Screen Content */}
      <View style={styles.safeArea}>
        <Header title="Zones" subtitle="Zonal Managers" showBackButton />

        {loading ? (
          <Loader />
        ) : (
          <FlatList
            data={zoneData}
            keyExtractor={item => item.id}
            ListEmptyComponent={() => (
              <View style={{ alignItems: 'center', marginTop: 20 }}>
                <Text style={{ color: theme.colors.white }}>No Item Found</Text>
              </View>
            )}
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

                {/* Amounts */}
                <View style={styles.row}>
                  <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                    Total Amount :
                  </Text>
                  <Text style={[styles.value, { color: theme.colors.white }]}>
                    {parseFloat(item.instTotalAmount).toFixed(2)|| 'N/A'}
                  </Text>
                </View>

                <View style={styles.row}>
                  <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                    Paid Amount :
                  </Text>
                  <Text style={[styles.value, { color: theme.colors.success,  }]}>
                    {parseFloat(item.instRecAmount).toFixed(2) || 'N/A'}
                  </Text>
                </View>


                <View style={styles.row}>
                  <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                    Due Amount :
                  </Text>
                  <Text style={[styles.value, { color: theme.colors.warning,  }]}>
                    {parseFloat(item.instDueAmount).toFixed(2)|| 'N/A'}
                  </Text>
                </View>

                <View style={styles.row}>
                  <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                    Zone Branches :
                  </Text>
                  <Text style={[styles.value, { color: theme.colors.secondary, }]}>
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

                <View style={styles.divider} />
              </View>
            )}
            contentContainerStyle={styles.list}
          />
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: { flex: 1, width: '100%', height: '100%' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  safeArea: { flex: 1, paddingBottom: 20 },
  list: { padding: AppSizes.Padding_Vertical_15, rowGap: AppSizes.Gap_20 },
  item: {
    borderRadius: 12,
    padding: 16,
    elevation: 2,
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
