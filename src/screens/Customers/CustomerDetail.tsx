// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   Image,
// } from 'react-native';
// import { useRoute } from '@react-navigation/native';
// import { Header } from '../../components/common/Header';
// import { API_Config } from '../../services/apiServices';
// import { fonts } from '../../assets/fonts/Fonts';
// import { AppSizes } from '../../utils/AppSizes';
// import Loader from '../../components/common/Loader';
// import { showMessage } from 'react-native-flash-message';
// import { CommonStyles } from '../../styles/GlobalStyle';
// import { Button } from '../../components/common/Button';
// import { Card } from '../../components/common';
// import { useTheme } from '../../hooks/useTheme';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Ionicons from '@react-native-vector-icons/ionicons';

// export const CustomerDetail: React.FC = () => {
//   const { theme } = useTheme();
//   const route = useRoute<any>();
//   const { CustomerCode } = route.params;

//   const [customerDetails, setCustomerDetails] = useState<any>([]);
//   const [loading, setLoading] = useState(false);
//   const [isExpanded, setIsExpanded] = useState(false);

//   useEffect(() => {
//     getCustomerDetails();
//   }, []);

//   const getCustomerDetails = async () => {
//     try {
//       setLoading(true);
//       const response = await API_Config.getCustomerDetails({
//         docEntry: CustomerCode,
//       });
//       if (response?.success) {
//         setCustomerDetails(response.data.data);
//         console.log('customer detail is: ', response.data.data);
//       } else {
//         showMessage({
//           message: 'Error',
//           description: response.data.message,
//           type: 'danger',
//           style: CommonStyles.error,
//         });
//       }
//     } catch (error) {
//       console.error('Error fetching customer:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderItem = ({ item }: { item: any }) => (
//     <View style={[{ backgroundColor: theme.colors.surface }, styles.item]}>
//       <View
//         style={{
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//           marginBottom: 10,
//         }}
//       >
//         <View style={{ justifyContent: 'center', alignItems: 'center' }}>
//           <Text
//             style={[
//               styles.title,
//               {
//                 color: theme.colors.secondaryDark,
//                 fontFamily: fonts.bold,
//                 // fontSize: AppSizes.Font_20,
//                 // marginVertical: AppSizes.Margin_Vertical_10,
//               },
//             ]}
//           >
//             {item?.customerName || 'N/A'}
//           </Text>
//           <Text
//             style={[
//               // styles.title,
//               {
//                 color: theme.colors.textSecondary,
//                 fontFamily: fonts.bold,
//                 alignSelf: 'center',
//                 // fontSize: AppSizes.Font_20,
//                 // marginVertical: AppSizes.Margin_Vertical_10,
//               },
//             ]}
//           >
//             s/o
//           </Text>
//           <Text
//             style={[
//               styles.title,
//               {
//                 color: theme.colors.secondaryDark,
//                 fontFamily: fonts.bold,
//                 // fontSize: AppSizes.Font_20,
//                 // marginVertical: AppSizes.Margin_Vertical_10,
//               },
//             ]}
//           >
//             {item?.fatrherName || 'N/A'}
//           </Text>
//         </View>

//         <Image
//           height={100}
//           width={100}
//           borderRadius={10}
//           source={{
//             uri: item.custPic
//               ? `data:image/jpeg;base64,${item?.custPic}`
//               : 'https://24newshd.tv/digital_images/large/2023-12-31/chahat-fateh-ali-khan-begs-for-new-laws-after-rejection-of-nomination-papers-1731428057-6778.webp',
//           }}
//           alt="Customer Image"
//           resizeMode="contain"
//         />
//       </View>

//       <View
//         style={{
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//         }}
//       >

//         <View
//           style={{
//             flexDirection: 'row',
//             alignItems: 'center',
//             gap: AppSizes.Gap_10,
//             flexShrink: 1,
//           }}
//         >
//           <Text
//             style={[
//               styles.subtitle,
//               {
//                 color: theme.colors.textSecondary,
//                 fontSize: AppSizes.Font_14,
//                 fontWeight: 'bold',
//               },
//             ]}
//           >
//             Acc No :
//           </Text>
//           <Text
//             style={[
//               styles.subtitle,
//               {
//                 color: theme.colors.black,
//                 fontWeight: 'bold',
//                 paddingHorizontal: AppSizes.Padding_Horizontal_5,
//                 borderRadius: AppSizes.Radius_15,
//               },
//             ]}
//           >
//             {item?.accNo || 'N/A'}
//           </Text>
//         </View>


//         <View
//           style={{
//             flexDirection: 'row',
//             alignItems: 'center',
//             gap: AppSizes.Gap_10,
//             flexShrink: 1,
//           }}
//         >
//           <Text
//             style={[
//               styles.subtitle,
//               {
//                 color: theme.colors.textSecondary,
//                 fontSize: AppSizes.Font_14,
//                 fontWeight: 'bold',
//               },
//             ]}
//           >
//             Acc Date :
//           </Text>
//           <Text
//             style={[
//               styles.subtitle,
//               {
//                 color: theme.colors.black,
//                 fontWeight: 'bold',
//                 paddingHorizontal: AppSizes.Padding_Horizontal_5,
//                 borderRadius: AppSizes.Radius_15,
//               },
//             ]}
//           >
//             {item?.invoiceDate || 'N/A'}
//           </Text>
//         </View>
//       </View>
//       <View
//         style={{
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//         }}
//       >
//         <Text
//           style={[
//             styles.subtitle,
//             {
//               color: theme.colors.textSecondary,
//               fontSize: AppSizes.Font_14,
//               fontWeight: 'bold',
//             },
//           ]}
//         >
//           Customer Code :
//         </Text>
//         <Text
//           style={[
//             styles.subtitle,
//             {
//               color: theme.colors.black,
//               fontWeight: 'bold',
//               //backgroundColor: theme.colors.white,
//               padding: AppSizes.Padding_Horizontal_5,
//               borderRadius: AppSizes.Radius_15,
//             },
//           ]}
//         >
//           {item?.customerCode || 'N/A'}
//         </Text>
//       </View>
//       <View
//         style={{
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//         }}
//       >
//         <Text
//           style={[
//             styles.subtitle,
//             {
//               color: theme.colors.textSecondary,
//               fontSize: AppSizes.Font_14,
//               fontWeight: 'bold',
//             },
//           ]}
//         >
//           Processing No :
//         </Text>
//         <Text
//           style={[
//             styles.subtitle,
//             {
//               color: theme.colors.black,
//               fontWeight: 'bold',
//               //backgroundColor: theme.colors.white,
//               padding: AppSizes.Padding_Horizontal_5,
//               borderRadius: AppSizes.Radius_15,
//             },
//           ]}
//         >
//           {item?.processingNo || 'N/A'}
//         </Text>
//       </View>

//       <View
//         style={{
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//         }}
//       >
//         <Text
//           style={[
//             styles.subtitle,
//             {
//               color: theme.colors.textSecondary,
//               fontSize: AppSizes.Font_14,
//               fontWeight: 'bold',
//             },
//           ]}
//         >
//           Invoice No :
//         </Text>
//         <Text
//           style={[
//             styles.subtitle,
//             {
//               color: theme.colors.black,
//               fontWeight: 'bold',
//               //backgroundColor: 'rgba(109, 207, 18, 0.12)',
//               padding: AppSizes.Padding_Horizontal_5,
//               borderRadius: AppSizes.Radius_15,
//             },
//           ]}
//         >
//           {item?.invoiceNo || 'N/A'}
//         </Text>
//       </View>

//       <View
//         style={{
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//         }}
//       >
//         <Text
//           style={[
//             styles.subtitle,
//             {
//               color: theme.colors.textSecondary,
//               fontSize: AppSizes.Font_14,
//               fontWeight: 'bold',
//             },
//           ]}
//         >
//           Sold By :
//         </Text>
//         <Text
//           style={[
//             styles.subtitle,
//             {
//               color: theme.colors.black,
//               fontWeight: 'bold',
//               //backgroundColor: theme.colors.white,
//               padding: AppSizes.Padding_Horizontal_5,
//               borderRadius: AppSizes.Radius_15,
//             },
//           ]}
//         >
//           {item?.salePerson || 'N/A'}
//         </Text>
//       </View>


//       <View
//         style={{
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//         }}
//       >
//         <Text
//           style={[
//             styles.subtitle,
//             {
//               color: theme.colors.textSecondary,
//               fontSize: AppSizes.Font_14,
//               fontWeight: 'bold',
//             },
//           ]}
//         >
//           Verified By :
//         </Text>
//         <Text
//           style={[
//             styles.subtitle,
//             {
//               color: theme.colors.black,
//               fontWeight: 'bold',
//               //backgroundColor: theme.colors.white,
//               padding: AppSizes.Padding_Horizontal_5,
//               borderRadius: AppSizes.Radius_15,
//             },
//           ]}
//         >
//           {item?.inqPerson || 'N/A'}
//         </Text>
//       </View>


//       <View
//         style={{
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//         }}
//       >
//         <Text
//           style={[
//             styles.subtitle,
//             {
//               color: theme.colors.textSecondary,
//               fontSize: AppSizes.Font_14,
//               fontWeight: 'bold',
//             },
//           ]}
//         >
//           Delivered By :
//         </Text>
//         <Text
//           style={[
//             styles.subtitle,
//             {
//               flex: 2,
//               color: theme.colors.black,
//               fontWeight: 'bold',
//               //backgroundColor: theme.colors.white,
//               padding: AppSizes.Padding_Horizontal_5,
//               borderRadius: AppSizes.Radius_15,
//             },
//           ]}
//         >
//           {item?.avMs || 'N/A'}
//         </Text>
//       </View>

// {/* modal  */}


//       <View style={styles.separator} />



//       {/* COLLAPSED STATE BUTTON */}
//       {!isExpanded ? (
//         <Button
//           title="Customer Detail"
//           textStyle={{ color: theme.colors.secondaryDark, padding: 0 }}
//           onPress={() => setIsExpanded(true)}
//           style={{
//             paddingHorizontal: theme.spacing.md,
//             paddingVertical: 6,
//             minHeight: 22,
//             marginTop: 10,
//             backgroundColor: theme.colors.surface,
//             borderColor: theme.colors.secondaryDark,
//             borderWidth: 1,
//           }}
//         />
//       ) : (
//         <View>

//              <View
//         style={{
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//         }}
//       >
//         <Text
//           style={[
//             styles.subtitle,
//             {
//               flex: 1,
//               color: theme.colors.textSecondary,
//               fontSize: AppSizes.Font_14,
//               fontWeight: 'bold',
//             },
//           ]}
//         >
//           Model :
//         </Text>
//         <Text
//           style={[
//             styles.subtitle,
//             {
//               flex: 2,
//               color: theme.colors.black,
//               fontWeight: 'bold',
//               //backgroundColor: theme.colors.white,
//               padding: AppSizes.Padding_Horizontal_5,
//               borderRadius: AppSizes.Radius_15,
//             },
//           ]}
//         >
//           {item?.u_Model || 'N/A'}
//         </Text>
//       </View>

//       <View
//         style={{
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//         }}
//       >
//         <Text
//           style={[
//             styles.subtitle,
//             {
//               flex: 1,
//               color: theme.colors.textSecondary,
//               fontSize: AppSizes.Font_14,
//               fontWeight: 'bold',
//             },
//           ]}
//         >
//           Duration :
//         </Text>
//         <Text
//           style={[
//             styles.subtitle,
//             {
//               flex: 2,
//               color: theme.colors.black,
//               fontWeight: 'bold',
//               //backgroundColor: theme.colors.white,
//               padding: AppSizes.Padding_Horizontal_5,
//               borderRadius: AppSizes.Radius_15,
//             },
//           ]}
//         >
//           {item?.duration || 'N/A'}
//         </Text>
//       </View>


//       <View
//         style={{
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//         }}
//       >
//         <Text
//           style={[
//             styles.subtitle,
//             {
//               flex: 1,
//               color: theme.colors.textSecondary,
//               fontSize: AppSizes.Font_14,
//               fontWeight: 'bold',
//             },
//           ]}
//         >
//           Item Name :
//         </Text>
//         <Text
//           style={[
//             styles.subtitle,
//             {
//               flex: 2,
//               color: theme.colors.black,
//               fontWeight: 'bold',
//               //backgroundColor: theme.colors.white,
//               padding: AppSizes.Padding_Horizontal_5,
//               borderRadius: AppSizes.Radius_15,
//             },
//           ]}
//         >
//           {item?.itemName || 'N/A'}
//         </Text>
//       </View>


//       <View
//         style={{
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//         }}
//       >
//         <Text
//           style={[
//             styles.subtitle,
//             {
//               flex: 1,
//               color: theme.colors.textSecondary,
//               fontSize: AppSizes.Font_14,
//               fontWeight: 'bold',
//             },
//           ]}
//         >
//           Company :
//         </Text>
//         <Text
//           style={[
//             styles.subtitle,
//             {
//               flex: 2,
//               color: theme.colors.black,
//               fontWeight: 'bold',
//               //backgroundColor: theme.colors.white,
//               padding: AppSizes.Padding_Horizontal_5,
//               borderRadius: AppSizes.Radius_15,
//             },
//           ]}
//         >
//           {item?.company || 'N/A'}
//         </Text>
//       </View>

//       <View
//         style={{
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//         }}
//       >
//         <Text
//           style={[
//             styles.subtitle,
//             {
//               flex: 1,
//               color: theme.colors.textSecondary,
//               fontSize: AppSizes.Font_14,
//               fontWeight: 'bold',
//             },
//           ]}
//         >
//           Serial No. :
//         </Text>
//         <Text
//           style={[
//             styles.subtitle,
//             {
//               flex: 2,
//               color: theme.colors.black,
//               fontWeight: 'bold',
//               //backgroundColor: theme.colors.white,
//               padding: AppSizes.Padding_Horizontal_5,
//               borderRadius: AppSizes.Radius_15,
//             },
//           ]}
//         >
//           {item?.serial || 'N/A'}
//         </Text>
//       </View>

//       <View
//         style={{
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//         }}
//       >
//         <Text
//           style={[
//             styles.subtitle,
//             {
//               flex: 1,
//               color: theme.colors.textSecondary,
//               fontSize: AppSizes.Font_14,
//               fontWeight: 'bold',
//             },
//           ]}
//         >
//           Price :
//         </Text>
//         <Text
//           style={[
//             styles.subtitle,
//             {
//               flex: 2,
//               color: theme.colors.black,
//               fontWeight: 'bold',
//               //backgroundColor: theme.colors.white,
//               padding: AppSizes.Padding_Horizontal_5,
//               borderRadius: AppSizes.Radius_15,
//             },
//           ]}
//         >
//           {item?.price || 'N/A'}
//         </Text>
//       </View>


//       <View
//         style={{
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//         }}
//       >
//         <Text
//           style={[
//             styles.subtitle,
//             {
//               color: theme.colors.textSecondary,
//               fontSize: AppSizes.Font_14,
//               fontWeight: 'bold',
//             },
//           ]}
//         >
//           CNIC :
//         </Text>
//         <Text
//           style={[
//             styles.subtitle,
//             {
//               color: theme.colors.black,
//               fontWeight: 'bold',
//               //backgroundColor: 'rgba(109, 207, 18, 0.12)',
//               padding: AppSizes.Padding_Horizontal_5,
//               borderRadius: AppSizes.Radius_15,
//             },
//           ]}
//         >
//           {item?.cnic || 'N/A'}
//         </Text>
//       </View>
//       {/* <View
//         style={{
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//         }}
//       >
//         <Text
//           style={[
//             styles.subtitle,
//             {
//               color: theme.colors.textSecondary,
//               fontSize: AppSizes.Font_14,
//               fontWeight: 'bold',
//             },
//           ]}
//         >
//           Product :
//         </Text>
//         <Text
//           style={[
//             styles.subtitle,
//             {
//               color: theme.colors.black,
//               fontWeight: 'bold',
//               //backgroundColor: 'rgba(109, 207, 18, 0.12)',
//               padding: AppSizes.Padding_Horizontal_5,
//               borderRadius: AppSizes.Radius_15,
//             },
//           ]}
//         >
//           {item?.product || 'N/A'}
//         </Text>
//       </View> */}


//       <View
//         style={{
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//         }}
//       >
//         <Text
//           style={[
//             styles.subtitle,
//             {
//               color: theme.colors.textSecondary,
//               fontSize: AppSizes.Font_14,
//               fontWeight: 'bold',
//             },
//           ]}
//         >
//           Installment Amount :
//         </Text>
//         <Text
//           style={[
//             styles.subtitle,
//             {
//               color: theme.colors.black,
//               fontWeight: 'bold',
//               //backgroundColor: 'rgba(109, 207, 18, 0.12)',
//               padding: AppSizes.Padding_Horizontal_5,
//               borderRadius: AppSizes.Radius_15,
//             },
//           ]}
//         >
//           {item?.installment || 'N/A'}
//         </Text>
//       </View>
//       <View
//         style={{
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//         }}
//       >
//         <Text
//           style={[
//             styles.subtitle,
//             {
//               color: theme.colors.textSecondary,
//               fontSize: AppSizes.Font_14,
//               fontWeight: 'bold',
//             },
//           ]}
//         >
//           Due Amount :
//         </Text>
//         <Text
//           style={[
//             styles.subtitle,
//             {
//               color: theme.colors.black,
//               fontWeight: 'bold',
//               //backgroundColor: 'rgba(109, 207, 18, 0.12)',
//               padding: AppSizes.Padding_Horizontal_5,
//               borderRadius: AppSizes.Radius_15,
//             },
//           ]}
//         >
//           {item?.due || 'N/A'}
//         </Text>
//       </View>
//       <View
//         style={{
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//         }}
//       >
//         <Text
//           style={[
//             styles.subtitle,
//             {
//               color: theme.colors.textSecondary,
//               fontSize: AppSizes.Font_14,
//               fontWeight: 'bold',
//             },
//           ]}
//         >
//           Balance :
//         </Text>
//         <Text
//           style={[
//             styles.subtitle,
//             {
//               color: theme.colors.black,
//               fontWeight: 'bold',
//               padding: AppSizes.Padding_Horizontal_5,
//               borderRadius: AppSizes.Radius_15,
//             },
//           ]}
//         >
//           {item?.balance || 'N/A'}
//         </Text>
//       </View>
//       <View
//         style={{
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//         }}
//       >
//         <Text
//           style={[
//             styles.subtitle,
//             {
//               color: theme.colors.textSecondary,
//               fontSize: AppSizes.Font_14,
//               fontWeight: 'bold',
//             },
//           ]}
//         >
//           Occupation :
//         </Text>
//         <Text
//           style={[
//             styles.subtitle,
//             {
//               color: theme.colors.black,
//               fontWeight: 'bold',
//               //backgroundColor: 'rgba(109, 207, 18, 0.12)',
//               padding: AppSizes.Padding_Horizontal_5,
//               borderRadius: AppSizes.Radius_15,
//             },
//           ]}
//         >
//           {item?.u_Occupation || 'N/A'}
//         </Text>
//       </View>




//       <View
//         style={{
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//         }}
//       >

//         <View
//           style={{
//             flexDirection: 'row',
//             alignItems: 'center',
//             gap: AppSizes.Gap_10,
//             flexShrink: 1,
//           }}
//         >
//           <Text
//             style={[
//               styles.subtitle,
//               {
//                 color: theme.colors.textSecondary,
//                 fontSize: AppSizes.Font_14,
//                 fontWeight: 'bold',
//               },
//             ]}
//           >
//             Married :
//           </Text>
//           <Text
//             style={[
//               styles.subtitle,
//               {
//                 color: theme.colors.black,
//                 fontWeight: 'bold',
//                 paddingHorizontal: AppSizes.Padding_Horizontal_5,
//                 borderRadius: AppSizes.Radius_15,
//               },
//             ]}
//           >
//             {item?.u_Mstatus || 'N/A'}
//           </Text>
//         </View>


//         <View
//           style={{
//             flexDirection: 'row',
//             alignItems: 'center',
//             gap: AppSizes.Gap_10,
//             flexShrink: 1,
//           }}
//         >
//           <Text
//             style={[
//               styles.subtitle,
//               {
//                 color: theme.colors.textSecondary,
//                 fontSize: AppSizes.Font_14,
//                 fontWeight: 'bold',
//               },
//             ]}
//           >
//             House Owner :
//           </Text>
//           <Text
//             style={[
//               styles.subtitle,
//               {
//                 color: theme.colors.black,
//                 fontWeight: 'bold',
//                 paddingHorizontal: AppSizes.Padding_Horizontal_5,
//                 borderRadius: AppSizes.Radius_15,
//               },
//             ]}
//           >
//             {item?.u_Howner || 'N/A'}
//           </Text>
//         </View>
//       </View>


//       <View
//         style={{
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//         }}
//       >
//         <Text
//           style={[
//             styles.subtitle,
//             {
//               color: theme.colors.textSecondary,
//               fontSize: AppSizes.Font_14,
//               fontWeight: 'bold',
//             },
//           ]}
//         >
//           Phone No. 1 :
//         </Text>
//         <Text
//           style={[
//             styles.subtitle,
//             {
//               color: theme.colors.black,
//               fontWeight: 'bold',
//               //backgroundColor: 'rgba(109, 207, 18, 0.12)',
//               padding: AppSizes.Padding_Horizontal_5,
//               borderRadius: AppSizes.Radius_15,
//             },
//           ]}
//         >
//           {item?.phone || 'N/A'}
//         </Text>
//       </View>
//       <View
//         style={{
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//         }}
//       >
//         <Text
//           style={[
//             styles.subtitle,
//             {
//               color: theme.colors.textSecondary,
//               fontSize: AppSizes.Font_14,
//               fontWeight: 'bold',
//             },
//           ]}
//         >
//           Phone No. 2 :
//         </Text>
//         <Text
//           style={[
//             styles.subtitle,
//             {
//               color: theme.colors.black,
//               fontWeight: 'bold',
//               //backgroundColor: 'rgba(109, 207, 18, 0.12)',
//               padding: AppSizes.Padding_Horizontal_5,
//               borderRadius: AppSizes.Radius_15,
//             },
//           ]}
//         >
//           {item?.phone2 || 'N/A'}
//         </Text>
//       </View>

//       <View
//         style={{
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//         }}
//       >
//         <Text
//           style={[
//             styles.subtitle,
//             {
//               flex: 1,
//               color: theme.colors.textSecondary,
//               fontSize: AppSizes.Font_14,
//               fontWeight: 'bold',
//             },
//           ]}
//         >
//           Location Res :
//         </Text>
//         <Text
//           style={[
//             styles.subtitle,
//             {
//               flex: 2,
//               color: theme.colors.black,
//               fontWeight: 'bold',
//               //backgroundColor: 'rgba(109, 207, 18, 0.12)',
//               padding: AppSizes.Padding_Horizontal_5,
//               borderRadius: AppSizes.Radius_15,
//             },
//           ]}
//         >
//           {item?.u_Raddress || item?.u_ResLoc || 'N/A'}
//         </Text>
//       </View>

//       <View
//         style={{
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//         }}
//       >
//         <Text
//           style={[
//             styles.subtitle,
//             {
//               flex: 1,
//               color: theme.colors.textSecondary,
//               fontSize: AppSizes.Font_14,
//               fontWeight: 'bold',
//             },
//           ]}
//         >
//           Location Offc :
//         </Text>
//         <Text
//           style={[
//             styles.subtitle,
//             {
//               flex: 2,
//               color: theme.colors.black,
//               fontWeight: 'bold',
//               //backgroundColor: 'rgba(109, 207, 18, 0.12)',
//               padding: AppSizes.Padding_Horizontal_5,
//               borderRadius: AppSizes.Radius_15,
//             },
//           ]}
//         >
//           {item?.u_Offaddress || item?.u_OffLoc || 'N/A'}
//         </Text>
//       </View>

//           <View
//             style={{
//               paddingHorizontal: theme.spacing.md,

//               paddingVertical: 6,
//               minHeight: 22,
//               marginTop: 10,
//               backgroundColor: theme.colors.surface,
//               borderColor: theme.colors.secondaryDark,
//               borderRadius: AppSizes.Radius_10,
//               marginBottom: AppSizes.Margin_Vertical_10,
//               borderWidth: 1,
//             }}
//           >
//             <Text
//               style={{
//                 alignSelf: 'center',
//                 color: theme.colors.secondaryDark,
//                 fontFamily: fonts.medium,
//               }}
//             >
//               G1 Details
//             </Text>
//           </View>
//           <View
//             style={{
//               flexDirection: 'row',
//               justifyContent: 'space-between',
//             }}
//           >
//             <Text
//               style={[
//                 styles.subtitle,
//                 {
//                   color: theme.colors.secondaryDark,
//                   fontSize: AppSizes.Font_14,
//                   fontWeight: 'bold',
//                 },
//               ]}
//             >
//               {item.u_G1Name}   s/o   {item.u_G1FName}
//             </Text>
//             {/* <Text
//               style={[
//                 styles.subtitle,
//                 {
//                   color: theme.colors.black,
//                   fontWeight: 'bold',
//                   //backgroundColor: 'rgba(109, 207, 18, 0.12)',
//                   padding: AppSizes.Padding_Horizontal_5,
//                   borderRadius: AppSizes.Radius_15,
//                 },
//               ]}
//             >
//               {item?.phone || 'N/A'}
//             </Text> */}
//           </View>
//           <View
//             style={{
//               flexDirection: 'row',
//               justifyContent: 'space-between',
//             }}
//           >
//             <Text
//               style={[
//                 styles.subtitle,
//                 {
//                   color: theme.colors.textSecondary,
//                   fontSize: AppSizes.Font_14,
//                   fontWeight: 'bold',
//                 },
//               ]}
//             >
//               CNIC :
//             </Text>
//             <Text
//               style={[
//                 styles.subtitle,
//                 {
//                   color: theme.colors.black,
//                   fontWeight: 'bold',
//                   //backgroundColor: 'rgba(109, 207, 18, 0.12)',
//                   padding: AppSizes.Padding_Horizontal_5,
//                   borderRadius: AppSizes.Radius_15,
//                 },
//               ]}
//             >
//               {item?.u_G1CNIC || 'N/A'}
//             </Text>
//           </View>
//           <View
//             style={{
//               flexDirection: 'row',
//               justifyContent: 'space-between',
//             }}
//           >
//             <Text
//               style={[
//                 styles.subtitle,
//                 {
//                   color: theme.colors.textSecondary,
//                   fontSize: AppSizes.Font_14,
//                   fontWeight: 'bold',
//                 },
//               ]}
//             >
//               Occupation :
//             </Text>
//             <Text
//               style={[
//                 styles.subtitle,
//                 {
//                   color: theme.colors.black,
//                   fontWeight: 'bold',
//                   //backgroundColor: 'rgba(109, 207, 18, 0.12)',
//                   padding: AppSizes.Padding_Horizontal_5,
//                   borderRadius: AppSizes.Radius_15,
//                 },
//               ]}
//             >
//               {item?.u_G1Occup || 'N/A'}
//             </Text>
//           </View>
//           <View
//             style={{
//               flexDirection: 'row',
//               justifyContent: 'space-between',
//             }}
//           >
//             <Text
//               style={[
//                 styles.subtitle,
//                 {
//                   flex: 1,
//                   color: theme.colors.textSecondary,
//                   fontSize: AppSizes.Font_14,
//                   fontWeight: 'bold',
//                 },
//               ]}
//             >
//               Location Res :
//             </Text>
//             <Text
//               style={[
//                 styles.subtitle,
//                 {
//                   flex: 2,
//                   color: theme.colors.black,
//                   fontWeight: 'bold',
//                   //backgroundColor: 'rgba(109, 207, 18, 0.12)',
//                   padding: AppSizes.Padding_Horizontal_5,
//                   borderRadius: AppSizes.Radius_15,
//                 },
//               ]}
//             >
//               {item?.u_G1ResAdd || item?.u_G1ResLoc || 'N/A'}
//             </Text>
//           </View>
//           <View
//             style={{
//               flexDirection: 'row',
//               justifyContent: 'space-between',
//             }}
//           >
//             <Text
//               style={[
//                 styles.subtitle,
//                 {
//                   flex: 1,
//                   color: theme.colors.textSecondary,
//                   fontSize: AppSizes.Font_14,
//                   fontWeight: 'bold',
//                 },
//               ]}
//             >
//               Location Offc :
//             </Text>
//             <Text
//               style={[
//                 styles.subtitle,
//                 {
//                   flex: 2,
//                   color: theme.colors.black,
//                   fontWeight: 'bold',
//                   //backgroundColor: 'rgba(109, 207, 18, 0.12)',
//                   padding: AppSizes.Padding_Horizontal_5,
//                   borderRadius: AppSizes.Radius_15,
//                 },
//               ]}
//             >
//               {item?.u_G1OffAdd || item?.u_G1OffLoc || 'N/A'}
//             </Text>
//           </View>
//           <View
//             style={{
//               flexDirection: 'row',
//               justifyContent: 'space-between',
//             }}
//           >
//             <Text
//               style={[
//                 styles.subtitle,
//                 {
//                   color: theme.colors.textSecondary,
//                   fontSize: AppSizes.Font_14,
//                   fontWeight: 'bold',
//                 },
//               ]}
//             >
//               Phone 1 :
//             </Text>
//             <Text
//               style={[
//                 styles.subtitle,
//                 {
//                   color: theme.colors.black,
//                   fontWeight: 'bold',
//                   //backgroundColor: 'rgba(109, 207, 18, 0.12)',
//                   padding: AppSizes.Padding_Horizontal_5,
//                   borderRadius: AppSizes.Radius_15,
//                 },
//               ]}
//             >
//               {item?.u_G1Restel || 'N/A'}
//             </Text>
//           </View>
//           <View
//             style={{
//               flexDirection: 'row',
//               justifyContent: 'space-between',
//             }}
//           >
//             <Text
//               style={[
//                 styles.subtitle,
//                 {
//                   color: theme.colors.textSecondary,
//                   fontSize: AppSizes.Font_14,
//                   fontWeight: 'bold',
//                 },
//               ]}
//             >
//               Phone 2 :
//             </Text>
//             <Text
//               style={[
//                 styles.subtitle,
//                 {
//                   color: theme.colors.black,
//                   fontWeight: 'bold',
//                   //backgroundColor: 'rgba(109, 207, 18, 0.12)',
//                   padding: AppSizes.Padding_Horizontal_5,
//                   borderRadius: AppSizes.Radius_15,
//                 },
//               ]}
//             >
//               {item?.u_G1Offtel || 'N/A'}
//             </Text>
//           </View>
//           {/* // G1 ending */}
//           <View
//             style={{
//               paddingHorizontal: theme.spacing.md,

//               paddingVertical: 6,
//               minHeight: 22,
//               marginTop: 10,
//               backgroundColor: theme.colors.surface,
//               borderColor: theme.colors.secondaryDark,
//               borderRadius: AppSizes.Radius_10,
//               marginBottom: AppSizes.Margin_Vertical_10,
//               borderWidth: 1,
//             }}
//           >
//             <Text
//               style={{
//                 alignSelf: 'center',
//                 color: theme.colors.secondaryDark,
//                 fontFamily: fonts.medium,
//               }}
//             >
//               G2 Details
//             </Text>
//           </View>
//           <View
//             style={{
//               flexDirection: 'row',
//               justifyContent: 'space-between',
//             }}
//           >
//             <Text
//               style={[
//                 styles.subtitle,
//                 {
//                   color: theme.colors.secondaryDark,
//                   fontSize: AppSizes.Font_14,
//                   fontWeight: 'bold',
//                 },
//               ]}
//             >
//               {item.u_G2Name} s/o {item.u_G2FName}
//             </Text>

//           </View>
//           <View
//             style={{
//               flexDirection: 'row',
//               justifyContent: 'space-between',
//             }}
//           >
//             <Text
//               style={[
//                 styles.subtitle,
//                 {
//                   color: theme.colors.textSecondary,
//                   fontSize: AppSizes.Font_14,
//                   fontWeight: 'bold',
//                 },
//               ]}
//             >
//               CNIC :
//             </Text>
//             <Text
//               style={[
//                 styles.subtitle,
//                 {
//                   color: theme.colors.black,
//                   fontWeight: 'bold',
//                   //backgroundColor: 'rgba(109, 207, 18, 0.12)',
//                   padding: AppSizes.Padding_Horizontal_5,
//                   borderRadius: AppSizes.Radius_15,
//                 },
//               ]}
//             >
//               {item?.u_G2CNIC || 'N/A'}
//             </Text>
//           </View>
//           <View
//             style={{
//               flexDirection: 'row',
//               justifyContent: 'space-between',
//             }}
//           >
//             <Text
//               style={[
//                 styles.subtitle,
//                 {
//                   color: theme.colors.textSecondary,
//                   fontSize: AppSizes.Font_14,
//                   fontWeight: 'bold',
//                 },
//               ]}
//             >
//               Occupation :
//             </Text>
//             <Text
//               style={[
//                 styles.subtitle,
//                 {
//                   color: theme.colors.black,
//                   fontWeight: 'bold',
//                   //backgroundColor: 'rgba(109, 207, 18, 0.12)',
//                   padding: AppSizes.Padding_Horizontal_5,
//                   borderRadius: AppSizes.Radius_15,
//                 },
//               ]}
//             >
//               {item?.u_G2Occup || 'N/A'}
//             </Text>
//           </View>
//           <View
//             style={{
//               flexDirection: 'row',
//               justifyContent: 'space-between',
//             }}
//           >
//             <Text
//               style={[
//                 styles.subtitle,
//                 {
//                   flex: 1,
//                   color: theme.colors.textSecondary,
//                   fontSize: AppSizes.Font_14,
//                   fontWeight: 'bold',
//                 },
//               ]}
//             >
//               Location Res :
//             </Text>
//             <Text
//               style={[
//                 styles.subtitle,
//                 {
//                   flex: 2,
//                   color: theme.colors.black,
//                   fontWeight: 'bold',
//                   //backgroundColor: 'rgba(109, 207, 18, 0.12)',
//                   padding: AppSizes.Padding_Horizontal_5,
//                   borderRadius: AppSizes.Radius_15,
//                 },
//               ]}
//             >
//               {item?.u_G2ResLoc || item?.u_G2ResAdd || 'N/A'}
//             </Text>
//           </View>
//           <View
//             style={{
//               flexDirection: 'row',
//               justifyContent: 'space-between',

//             }}
//           >
//             <Text
//               style={[
//                 styles.subtitle,
//                 {
//                   flex: 1,
//                   color: theme.colors.textSecondary,
//                   fontSize: AppSizes.Font_14,
//                   fontWeight: 'bold',
//                 },
//               ]}
//             >
//               Location Offc :
//             </Text>
//             <Text
//               style={[
//                 styles.subtitle,
//                 {
//                   flex: 2,
//                   // width:'65%',
//                   color: theme.colors.black,
//                   fontWeight: 'bold',
//                   //backgroundColor: 'rgba(109, 207, 18, 0.12)',
//                   padding: AppSizes.Padding_Horizontal_5,
//                   borderRadius: AppSizes.Radius_15,
//                 },
//               ]}
//             >
//               {item?.u_G2OffLoc || item?.u_G2OffAdd || 'N/A'}
//             </Text>
//           </View>
//           <View
//             style={{
//               flexDirection: 'row',
//               justifyContent: 'space-between',
//             }}
//           >
//             <Text
//               style={[
//                 styles.subtitle,
//                 {
//                   color: theme.colors.textSecondary,
//                   fontSize: AppSizes.Font_14,
//                   fontWeight: 'bold',
//                 },
//               ]}
//             >
//               Phone 1 :
//             </Text>
//             <Text
//               style={[
//                 styles.subtitle,
//                 {
//                   color: theme.colors.black,
//                   fontWeight: 'bold',
//                   //backgroundColor: 'rgba(109, 207, 18, 0.12)',
//                   padding: AppSizes.Padding_Horizontal_5,
//                   borderRadius: AppSizes.Radius_15,
//                 },
//               ]}
//             >
//               {item?.u_G2Restel || 'N/A'}
//             </Text>
//           </View>
//           <View
//             style={{
//               flexDirection: 'row',
//               justifyContent: 'space-between',
//               flexWrap: 'wrap'
//             }}
//           >
//             <Text
//               style={[
//                 styles.subtitle,
//                 {
//                   color: theme.colors.textSecondary,
//                   fontSize: AppSizes.Font_14,
//                   fontWeight: 'bold',
//                 },
//               ]}
//             >
//               Phone 2 :
//             </Text>
//             <Text
//               style={[
//                 styles.subtitle,
//                 {
//                   color: theme.colors.black,
//                   fontWeight: 'bold',
//                   //backgroundColor: 'rgba(109, 207, 18, 0.12)',
//                   padding: AppSizes.Padding_Horizontal_5,
//                   borderRadius: AppSizes.Radius_15,
//                 },
//               ]}
//             >
//               {item?.u_G2Offtel || 'N/A'}
//             </Text>
//           </View>
//           <Ionicons
//             name="chevron-up"
//             size={22}
//             color={theme.colors.secondaryDark}
//             style={{ alignSelf: 'center', marginTop: 8 }}
//             onPress={() => setIsExpanded(false)}
//           />
//         </View>
//       )}
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.background}>
//       <View style={styles.overlay} />
//       <View style={styles.safeArea}>
//         <Header
//           title="Customer"
//           subtitle="Customer Information"
//           showBackButton
//         />

//         {loading ? (
//           <Loader title="Loading Customer details..." />
//         ) : (
//           <FlatList
//             data={customerDetails}
//             keyExtractor={item => item.id}
//             refreshing={loading}
//             onRefresh={() => getCustomerDetails()}
//             contentContainerStyle={styles.list}
//             renderItem={item => renderItem(item)}
//             ListEmptyComponent={
//               <View style={styles.center}>
//                 <Text
//                   style={[
//                     styles.errorText,
//                     {
//                       color: theme.colors.black,
//                     },
//                   ]}
//                 >
//                   Customer data not available
//                 </Text>
//                 <Button title="Retry" onPress={getCustomerDetails} />
//               </View>
//             }
//           />
//         )}
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   background: { flex: 1, width: '100%', height: '100%' },
//   overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'white' },
//   safeArea: { flex: 1, paddingBottom: 20 },
//   list: { padding: 20, rowGap: AppSizes.Padding_Horizontal_20 },
//   item: { borderRadius: 12, padding: 16, elevation: 5 },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginVertical: 4,
//   },
//   label: { fontSize: AppSizes.Font_14, fontFamily: fonts.regular },
//   value: { fontSize: AppSizes.Font_14, fontFamily: fonts.bold },
//   center: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     alignSelf: 'center',
//   },
//   errorText: {
//     fontSize: 16,
//     fontFamily: fonts.extraBoldItalic,
//     marginBottom: 12,
//   },
//   subtitle: { fontSize: 14, marginTop: 4 },
//   title: { fontSize: AppSizes.Font_18 },
//   separator: {
//     marginVertical: 12,
//     // marginHorizontal: AppSizes.Gap_30,
//     borderWidth: 0.5,
//     borderTopColor: '#ccc',
//   },
// });








// 🔹 CustomerDetail.tsx
// This screen displays detailed information about a selected customer,
// including account info, purchase details, guarantor (G1 & G2) info, and personal details.

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Header } from '../../components/common/Header';
import { API_Config } from '../../services/apiServices';
import { fonts } from '../../assets/fonts/Fonts';
import { AppSizes } from '../../utils/AppSizes';
import Loader from '../../components/common/Loader';
import { showMessage } from 'react-native-flash-message';
import { CommonStyles } from '../../styles/GlobalStyle';
import { Button } from '../../components/common/Button';
import { useTheme } from '../../hooks/useTheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';

export const CustomerDetail: React.FC = () => {
  const { theme } = useTheme();
  const route = useRoute<any>();
  const { CustomerCode } = route.params;

  const [customerDetails, setCustomerDetails] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // 🔹 Fetch customer details on component mount
  useEffect(() => {
    getCustomerDetails();
  }, []);

  // 🔹 API call to fetch customer details
  const getCustomerDetails = async () => {
    try {
      setLoading(true);
      const response = await API_Config.getCustomerDetails({
        docEntry: CustomerCode,
      });
      if (response?.success) {
        setCustomerDetails(response.data.data[0]);
      } else {
        showMessage({
          message: 'Error',
          description: response.data.message,
          type: 'danger',
          style: CommonStyles.error,
        });
      }
    } catch (error) {
      console.error('Error fetching customer:', error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Render each customer item
  const renderItem = ({ item }: { item: any }) => (
    <View style={[{ backgroundColor: theme.colors.surface }, styles.item]}>

      {/* 🔹 Customer Name and Father Name */}
      <View style={styles.rowBetween}>
        <View style={styles.centered}>
          {/* Customer Name */}
          <Text style={[styles.title, { color: theme.colors.secondaryDark, fontFamily: fonts.bold }]}>
            {item?.customerName || 'N/A'}
          </Text>

          {/* Static text “s/o” */}
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary, fontFamily: fonts.bold }]}>
            s/o
          </Text>

          {/* Father Name */}
          <Text style={[styles.title, { color: theme.colors.secondaryDark, fontFamily: fonts.bold }]}>
            {item?.fatrherName || 'N/A'}
          </Text>
        </View>

        {/* 🔹 Customer Image */}
        <Image
          height={100}
          width={100}
          borderRadius={AppSizes.Radius_20}
          source={{
            uri: item.custPic
              ? `data:image/jpeg;base64,${item?.custPic}`
              : 'https://24newshd.tv/digital_images/large/2023-12-31/chahat-fateh-ali-khan-begs-for-new-laws-after-rejection-of-nomination-papers-1731428057-6778.webp',
          }}
          resizeMode="contain"
        />
      </View>

      {/* 🔹 Account Information */}

      {/* Account Number */}
      <View style={styles.rowBetween}>
        <Text style={[styles.label, { color: theme.colors.textSecondary, }]}>Acc No :</Text>
        <Text style={[styles.value, { color: theme.colors.black, }]}>{item?.accNo || 'N/A'}</Text>
      </View>

      {/* Account Date */}
      <View style={styles.rowBetween}>
        <Text style={[styles.label, { color: theme.colors.textSecondary, }]}>Acc Date :</Text>
        <Text style={[styles.value, { color: theme.colors.black, }]}>{item?.invoiceDate || 'N/A'}</Text>
      </View>




      {/* 🔹 Customer Code */}
      <View style={styles.rowBetween}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Customer Code :</Text>
        <Text style={[styles.value, { color: theme.colors.black }]}>{item?.customerCode || 'N/A'}</Text>
      </View>

      {/* 🔹 Processing Number */}
      <View style={styles.rowBetween}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Processing No :</Text>
        <Text style={[styles.value, { color: theme.colors.black }]}>{item?.processingNo || 'N/A'}</Text>
      </View>

      {/* 🔹 Invoice Number */}
      <View style={styles.rowBetween}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Invoice No :</Text>
        <Text style={[styles.value, { color: theme.colors.black }]}>{item?.invoiceNo || 'N/A'}</Text>
      </View>

      {/* 🔹 Salesperson */}
      <View style={styles.rowBetween}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Sold By :</Text>
        <Text style={[styles.value, { color: theme.colors.black }]}>{item?.salePerson || 'N/A'}</Text>
      </View>

      {/* 🔹 Verified By */}
      <View style={styles.rowBetween}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Verified By :</Text>
        <Text style={[styles.value, { color: theme.colors.black }]}>{item?.inqPerson || 'N/A'}</Text>
      </View>

      {/* 🔹 Delivered By */}
      <View style={styles.rowBetween}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Delivered By :</Text>
        <Text style={[styles.value, { color: theme.colors.black, flex: 2 }]}>{item?.avMs || 'N/A'}</Text>
      </View>

      <View style={styles.separator} />

      {/* 🔹 Expandable Details Button */}
      {!isExpanded ? (
        <Button

          title="Customer Detail"
          textStyle={{ color: theme.colors.secondaryDark }}
          onPress={() => setIsExpanded(true)}
          style={{
            paddingVertical: 6,
            marginTop: 10,
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.secondaryDark,
            borderWidth: 1,
            borderRadius: AppSizes.Radius_10,
          }}
        />
      ) : (
        <View>

          {/* 🔹 Product Information */}
          {/* <Text style={styles.sectionHeader(theme)}>Product Details</Text> */}

          {/* Model */}
          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Model :</Text>
            <Text style={[styles.value, { color: theme.colors.black }]}>{item?.u_Model || 'N/A'}</Text>
          </View>

          {/* Company */}
          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Company :</Text>
            <Text style={[styles.value, { color: theme.colors.black }]}>{item?.company || 'N/A'}</Text>
          </View>

          {/* Item Name */}
          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Item Name :</Text>
            <Text style={[styles.value, { color: theme.colors.black }]}>{item?.itemName || 'N/A'}</Text>
          </View>

          {/* Serial Number */}
          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Serial No. :</Text>
            <Text style={[styles.value, { color: theme.colors.black }]}>{item?.serial || 'N/A'}</Text>
          </View>

          {/* Price */}
          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Price :</Text>
            <Text style={[styles.value, { color: theme.colors.black }]}>{item?.price || 'N/A'}</Text>
          </View>

          {/* 🔹 Installment and Due Info */}
          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Installment Amount :</Text>
            <Text style={[styles.value, { color: theme.colors.black }]}>{item?.installment || 'N/A'}</Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Due Amount :</Text>
            <Text style={[styles.value, { color: theme.colors.black }]}>{item?.due || 'N/A'}</Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Balance :</Text>
            <Text style={[styles.value, { color: theme.colors.black }]}>{item?.balance || 'N/A'}</Text>
          </View>




          {/* Duration */}
          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Duration :</Text>
            <Text style={[styles.value, { color: theme.colors.black }]}>{item?.duration || 'N/A'}</Text>
          </View>



          {/* 🔹 CNIC */}
          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>CNIC :</Text>
            <Text style={[styles.value, { color: theme.colors.black }]}>{item?.cnic || 'N/A'}</Text>
          </View>


          {/* 🔹 Personal Info */}
          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Occupation :</Text>
            <Text style={[styles.value, { color: theme.colors.black }]}>{item?.u_Occupation || 'N/A'}</Text>
          </View>

          {/* Married and House Owner */}

          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Married :</Text>
            <Text style={[styles.value, { color: theme.colors.black }]}>{item?.u_Mstatus || 'N/A'}</Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>House Owner :</Text>
            <Text style={[styles.value, { color: theme.colors.black }]}>{item?.u_Howner || 'N/A'}</Text>
          </View>


          {/* 🔹 Phone Numbers */}
          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Phone No. 1 :</Text>
            <Text style={[styles.value, { color: theme.colors.black }]}>{item?.phone || 'N/A'}</Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Phone No. 2 :</Text>
            <Text style={[styles.value, { color: theme.colors.black }]}>{item?.phone2 || 'N/A'}</Text>
          </View>

          {/* 🔹 Address Info */}
          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Location Res :</Text>
            <Text style={[styles.value, { color: theme.colors.black, flex: 2 }]}>{item?.u_Raddress || item?.u_ResLoc || 'N/A'}</Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Location Offc :</Text>
            <Text style={[styles.value, { color: theme.colors.black, flex: 2 }]}>{item?.u_Offaddress || item?.u_OffLoc || 'N/A'}</Text>
          </View>

          <View style={[styles.separator, { marginVertical: 5 }]} />

          {/* 🔹 G1 Details */}
          <Text style={[styles.sectionHeader, { color: theme.colors.secondaryDark }]}>G1 Details</Text>

          <View style={[styles.separator, { marginVertical: 5 }]} />
          <Text style={[styles.value, { color: theme.colors.secondaryDark, fontSize: AppSizes.Font_14, fontFamily: fonts.semiBold }]}>
            {item.u_G1Name} s/o {item.u_G1FName}
          </Text>

          {/* G1 CNIC */}
          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>CNIC :</Text>
            <Text style={[styles.value, { color: theme.colors.black }]}>{item?.u_G1CNIC || 'N/A'}</Text>
          </View>

          {/* G1 Occupation */}
          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Occupation :</Text>
            <Text style={[styles.value, { color: theme.colors.black }]}>{item?.u_G1Occup || 'N/A'}</Text>
          </View>

          {/* G1 Phones */}
          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Phone 1 :</Text>
            <Text style={[styles.value, { color: theme.colors.black }]}>{item?.u_G1Restel || 'N/A'}</Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Phone 2 :</Text>
            <Text style={[styles.value, { color: theme.colors.black }]}>{item?.u_G1Offtel || 'N/A'}</Text>
          </View>

          {/* G1 Addresses */}
          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary, flex: 1 }]}>Location Res :</Text>
            <Text style={[styles.value, { color: theme.colors.black, flex: 2 }]}>{item?.u_G1ResAdd || item?.u_G1ResLoc || 'N/A'}</Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary, flex: 1 }]}>Location Offc :</Text>
            <Text style={[styles.value, { color: theme.colors.black, flex: 2 }]}>{item?.u_G1OffAdd || item?.u_G1OffLoc || 'N/A'}</Text>
          </View>



          {/* 🔹 G2 Details */}
          <View style={[styles.separator, { marginVertical: 5 }]} />

          <Text style={[styles.sectionHeader, { color: theme.colors.secondaryDark }]}>G2 Details</Text>

          <View style={[styles.separator, { marginVertical: 5 }]} />

          <Text style={[styles.value, { color: theme.colors.secondaryDark, fontSize: AppSizes.Font_14, fontFamily: fonts.semiBold }]}>
            {item.u_G2Name} s/o {item.u_G2FName}
          </Text>

          {/* G2 CNIC */}
          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>CNIC :</Text>
            <Text style={[styles.value, { color: theme.colors.black }]}>{item?.u_G2CNIC || 'N/A'}</Text>
          </View>

          {/* G2 Occupation */}
          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Occupation :</Text>
            <Text style={[styles.value, { color: theme.colors.black }]}>{item?.u_G2Occup || 'N/A'}</Text>
          </View>


          {/* G2 Phones */}
          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Phone 1 :</Text>
            <Text style={[styles.value, { color: theme.colors.black }]}>{item?.u_G2Restel || 'N/A'}</Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Phone 2 :</Text>
            <Text style={[styles.value, { color: theme.colors.black }]}>{item?.u_G2Offtel || 'N/A'}</Text>
          </View>

          {/* G2 Addresses */}
          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary, flex: 1 }]}>Location Res :</Text>
            <Text style={[styles.value, { color: theme.colors.black, flex: 2 }]}>{item?.u_G2ResLoc || item?.u_G2ResAdd || 'N/A'}</Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary, flex: 1 }]}>Location Offc :</Text>
            <Text style={[styles.value, { color: theme.colors.black, flex: 2 }]}>{item?.u_G2OffLoc || item?.u_G2OffAdd || 'N/A'}</Text>
          </View>



          {/* Collapse Button */}
          <Ionicons
            name="chevron-up"
            size={22}
            color={theme.colors.secondaryDark}
            style={{ alignSelf: 'center', marginTop: 8 }}
            onPress={() => setIsExpanded(false)}
          />
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.overlay} />
      <View style={styles.safeArea}>
        {/* 🔹 Screen Header */}
        <Header title="Customer" subtitle="Customer Information" showBackButton />

        {/* 🔹 Loading or List Display */}
        {loading ? (
          <Loader title="Loading Customer details..." />
        ) : (
          <FlatList
            data={[customerDetails]}
            keyExtractor={item => item.id}
            refreshing={loading}
            onRefresh={getCustomerDetails}
            contentContainerStyle={styles.list}
            renderItem={renderItem}
            ListEmptyComponent={
              <View style={styles.center}>
                <Text style={[styles.errorText, { color: theme.colors.black }]}>
                  Customer data not available
                </Text>
                <Button title="Retry" onPress={getCustomerDetails} />
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

// 🔹 Styles
const styles = StyleSheet.create({
  background: { flex: 1, width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'white' },
  safeArea: { flex: 1, paddingBottom: 20 },
  list: { padding: 20, rowGap: AppSizes.Padding_Horizontal_20 },
  item: { borderRadius: 12, padding: 16, elevation: 5 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4, alignItems: 'center' },
  inlineField: { flexDirection: 'row', alignItems: 'center', gap: AppSizes.Gap_10, },
  centered: { justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: AppSizes.Font_18 },
  subtitle: { fontSize: AppSizes.Font_16, marginTop: 4 },
  label: { fontSize: AppSizes.Font_14, fontFamily: fonts.semiBold, flex: 1 },
  value: { fontSize: AppSizes.Font_12, fontFamily: fonts.medium, flex: 2 },
  separator: { marginVertical: 12, borderWidth: 0.5, borderTopColor: '#ccc' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 16, fontFamily: fonts.extraBoldItalic, marginBottom: 12 },
  sectionHeader: {
    alignSelf: 'center',
    //color: theme.colors.secondaryDark,
    fontFamily: fonts.medium,
    //marginVertical: AppSizes.Margin_Vertical_10,
  },
  expandButton: {

    paddingVertical: 6,
    marginTop: 10,
    // backgroundColor: theme.colors.surface,
    // borderColor: theme.colors.secondaryDark,
    borderWidth: 1,
    borderRadius: AppSizes.Radius_10,
  },
});
