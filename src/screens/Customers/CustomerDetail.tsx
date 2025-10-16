import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
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
import { Modal } from '../../components/common';
import { set } from 'lodash';
import { colors } from '@/styles/theme';

export const CustomerDetail: React.FC = () => {
  const { theme } = useTheme();
  const route = useRoute<any>();
  const { CustomerCode } = route.params;

  const [customerDetails, setCustomerDetails] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showpervious, setShowPervious] = useState(false);
  const [installments, setInstallments] = useState([
    { receiptDate: '', receiptAmnt: '' },
  ]);
  let perviousInsatllment = [{ receiptDate: '', receiptAmnt: '' }];

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
        const data = response.data.data;

        perviousInsatllment = data.map((item: any) => ({
          receiptDate: item.receiptDate,
          receiptAmnt: item.receiptAmnt,
        }));
        setInstallments(perviousInsatllment);
        console.log('perviousInsatllment', perviousInsatllment);

        let length = data.length;
        console.log('lenght is : ', length);
        setCustomerDetails(data[length - 1]);
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
        <View style={[styles.centered, { flex: 2 }]}>
          {/* Customer Name */}
          <Text
            style={[
              styles.title,
              { color: theme.colors.secondaryDark, fontFamily: fonts.bold },
            ]}
          >
            {item?.customerName || 'N/A'}
          </Text>

          {/* Static text “s/o” */}
          <Text
            style={[
              styles.subtitle,
              {
                color: theme.colors.textSecondary,
                fontFamily: fonts.medium,
                alignSelf: 'auto',
              },
            ]}
          >
            S/O
          </Text>

          {/* Father Name */}
          <Text
            style={[
              styles.title,
              { color: theme.colors.secondaryDark, fontFamily: fonts.bold },
            ]}
          >
            {item?.fatrherName || 'N/A'}
          </Text>
        </View>

        {/* 🔹 Customer Image */}
        <Image
          height={AppSizes.Margin_Vertical_90}
          width={AppSizes.Margin_Vertical_90}
          borderRadius={10}
          style={{ flex: 1 }}
          source={{
            uri: item.custPic
              ? `data:image/jpeg;base64,${item?.custPic}`
              : 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg',
          }}
          resizeMode="cover"
        />
      </View>

      {/* 🔹 Account Information */}

      {/* Account Number 
      <View style={styles.rowBetween}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
          Acc No :
        </Text>
        <Text style={[styles.value, { color: theme.colors.black }]}>
          {item?.accNo || 'N/A'}
        </Text>
      </View>*/}

      {/* Account Date */}
      <View style={styles.rowBetween}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
          Invoice Date :
        </Text>
        <Text style={[styles.value, { color: theme.colors.black }]}>
          {item?.invoiceDate || 'N/A'}
        </Text>
      </View>

      {/* 🔹 Customer Code */}
      <View style={styles.rowBetween}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
          Customer Code :
        </Text>
        <Text style={[styles.value, { color: theme.colors.black }]}>
          {item?.customerCode || 'N/A'}
        </Text>
      </View>

      {/* 🔹 Processing Number */}
      <View style={styles.rowBetween}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
          Processing No :
        </Text>
        <Text style={[styles.value, { color: theme.colors.black }]}>
          {item?.processingNo || 'N/A'}
        </Text>
      </View>

      {/* 🔹 Invoice Number */}
      <View style={styles.rowBetween}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
          Invoice No :
        </Text>
        <Text style={[styles.value, { color: theme.colors.black }]}>
          {item?.invoiceNo || 'N/A'}
        </Text>
      </View>

      {/* 🔹 Salesperson */}
      <View style={styles.rowBetween}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
          Sold By :
        </Text>
        <Text style={[styles.value, { color: theme.colors.black }]}>
          {item?.salePerson || 'N/A'}
        </Text>
      </View>

      {/* 🔹 Verified By */}
      <View style={styles.rowBetween}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
          Verified By :
        </Text>
        <Text style={[styles.value, { color: theme.colors.black }]}>
          {item?.inqPerson || 'N/A'}
        </Text>
      </View>

      {/* 🔹 Delivered By */}
      <View style={styles.rowBetween}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
          Delivered By :
        </Text>
        <Text style={[styles.value, { color: theme.colors.black }]}>
          {item?.avMs || 'N/A'}
        </Text>
      </View>

      {/* <View style={styles.separator} /> */}

      {/* 🔹 Expandable Details Button */}
      {!isExpanded ? (
        <Button
          title="Customer Detail"
          textStyle={{ color: theme.colors.white }}
          onPress={() => setIsExpanded(true)}
          style={{
            paddingVertical: 6,
            // marginTop: 10,
            backgroundColor: theme.colors.secondaryDark,
            // borderColor: theme.colors.secondaryDark,
            // borderWidth: 1,
            borderRadius: AppSizes.Radius_10,
          }}
        />
      ) : (
        <View style={{ rowGap: AppSizes.Margin_Vertical_10 }}>
          {/* 🔹 Product Information */}
          {/* <Text style={styles.sectionHeader(theme)}>Product Details</Text> */}

          {/* Model */}
          <View style={styles.separator} />
          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Model :
            </Text>
            <Text style={[styles.value, { color: theme.colors.black }]}>
              {item?.u_Model || 'N/A'}
            </Text>
          </View>

          {/* Company */}
          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Company :
            </Text>
            <Text style={[styles.value, { color: theme.colors.black }]}>
              {item?.company || 'N/A'}
            </Text>
          </View>

          {/* Item Name */}
          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Item Name :
            </Text>
            <Text style={[styles.value, { color: theme.colors.black }]}>
              {item?.itemName || 'N/A'}
            </Text>
          </View>

          {/* Serial Number */}
          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Serial No. :
            </Text>
            <Text style={[styles.value, { color: theme.colors.black }]}>
              {item?.serial || 'N/A'}
            </Text>
          </View>

          {/* Price */}
          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Price :
            </Text>
            <Text style={[styles.value, { color: theme.colors.black }]}>
              {item?.price || 'N/A'}
            </Text>
          </View>

          {/* 🔹 Installment and Due Info */}
          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Installment Amount :
            </Text>
            <Text style={[styles.value, { color: theme.colors.black }]}>
              {item?.installment || 'N/A'}
            </Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Due Amount :
            </Text>
            <Text style={[styles.value, { color: theme.colors.black }]}>
              {item?.due || 'N/A'}
            </Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Balance :
            </Text>
            <Text style={[styles.value, { color: theme.colors.black }]}>
              {item?.balance || 'N/A'}
            </Text>
          </View>

          {/* Duration */}
          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Duration :
            </Text>
            <Text style={[styles.value, { color: theme.colors.black }]}>
              {item?.duration || 'N/A'}
            </Text>
          </View>

          {/*  CNIC */}
          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              CNIC :
            </Text>
            <Text style={[styles.value, { color: theme.colors.black }]}>
              {item?.cnic || 'N/A'}
            </Text>
          </View>

          {/*  Personal Info */}
          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Occupation :
            </Text>
            <Text style={[styles.value, { color: theme.colors.black }]}>
              {item?.u_Occupation || 'N/A'}
            </Text>
          </View>

          {/* Married and House Owner */}

          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Married :
            </Text>
            <Text style={[styles.value, { color: theme.colors.black }]}>
              {item?.u_Mstatus || 'N/A'}
            </Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              House Owner :
            </Text>
            <Text style={[styles.value, { color: theme.colors.black }]}>
              {item?.u_Howner || 'N/A'}
            </Text>
          </View>

          {/*  Phone Numbers */}
          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Phone No. 1 :
            </Text>
            <Text style={[styles.value, { color: theme.colors.black }]}>
              {item?.phone || 'N/A'}
            </Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Phone No. 2 :
            </Text>
            <Text style={[styles.value, { color: theme.colors.black }]}>
              {item?.phone2 || 'N/A'}
            </Text>
          </View>

          {/*  Address Info */}
          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Location Res :
            </Text>
            <Text style={[styles.value, { color: theme.colors.black }]}>
              {item?.u_Raddress || item?.u_ResLoc || 'N/A'}
            </Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Location Offc :
            </Text>
            <Text style={[styles.value, { color: theme.colors.black }]}>
              {item?.u_Offaddress || item?.u_OffLoc || 'N/A'}
            </Text>
          </View>

          <View>
            <View style={[styles.separator, { marginVertical: 5 }]} />

            {/*  G1 Details */}
            <Text
              style={[
                styles.sectionHeader,
                { color: theme.colors.secondaryDark },
              ]}
            >
              G1 Details
            </Text>

            <View style={[styles.separator, { marginVertical: 5 }]} />
          </View>
          <Text
            style={[
              styles.label,
              {
                color: theme.colors.secondaryDark,
                fontSize: AppSizes.Font_16,
                fontFamily: fonts.semiBold,
                //marginVertical: AppSizes.Gap_10,
                
              },
            ]}
          >
            {item.u_G1Name} s/o {item.u_G1FName}
          </Text>

          {/* G1 CNIC */}
          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              CNIC :
            </Text>
            <Text style={[styles.value, { color: theme.colors.black }]}>
              {item?.u_G1CNIC || 'N/A'}
            </Text>
          </View>

          {/* G1 Occupation */}
          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Occupation :
            </Text>
            <Text style={[styles.value, { color: theme.colors.black }]}>
              {item?.u_G1Occup || 'N/A'}
            </Text>
          </View>

          {/* G1 Phones */}
          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Phone 1 :
            </Text>
            <Text style={[styles.value, { color: theme.colors.black }]}>
              {item?.u_G1Restel || 'N/A'}
            </Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Phone 2 :
            </Text>
            <Text style={[styles.value, { color: theme.colors.black }]}>
              {item?.u_G1Offtel || 'N/A'}
            </Text>
          </View>

          {/* G1 Addresses */}
          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Location Res :
            </Text>
            <Text style={[styles.value, { color: theme.colors.black }]}>
              {item?.u_G1ResAdd || item?.u_G1ResLoc || 'N/A'}
            </Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Location Offc :
            </Text>
            <Text style={[styles.value, { color: theme.colors.black }]}>
              {item?.u_G1OffAdd || item?.u_G1OffLoc || 'N/A'}
            </Text>
          </View>

          {/*  G2 Details */}
          <View>
            <View style={[styles.separator, { marginVertical: 5 }]} />

            <Text
              style={[
                styles.sectionHeader,
                { color: theme.colors.secondaryDark },
              ]}
            >
              G2 Details
            </Text>

            <View style={[styles.separator, { marginVertical: 5 }]} />
          </View>

          <Text
            style={[
              styles.label,
              {
                color: theme.colors.secondaryDark,
                fontSize: AppSizes.Font_16,
                fontFamily: fonts.semiBold,
              },
            ]}
          >
            {item.u_G2Name} s/o {item.u_G2FName}
          </Text>

          {/* G2 CNIC */}
          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              CNIC :
            </Text>
            <Text style={[styles.value, { color: theme.colors.black }]}>
              {item?.u_G2CNIC || 'N/A'}
            </Text>
          </View>

          {/* G2 Occupation */}
          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Occupation :
            </Text>
            <Text style={[styles.value, { color: theme.colors.black }]}>
              {item?.u_G2Occup || 'N/A'}
            </Text>
          </View>

          {/* G2 Phones */}
          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Phone 1 :
            </Text>
            <Text style={[styles.value, { color: theme.colors.black }]}>
              {item?.u_G2Restel || 'N/A'}
            </Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Phone 2 :
            </Text>
            <Text style={[styles.value, { color: theme.colors.black }]}>
              {item?.u_G2Offtel || 'N/A'}
            </Text>
          </View>

          {/* G2 Addresses */}
          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Location Res :
            </Text>
            <Text style={[styles.value, { color: theme.colors.black }]}>
              {item?.u_G2ResLoc || item?.u_G2ResAdd || 'N/A'}
            </Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Location Offc :
            </Text>
            <Text style={[styles.value, { color: theme.colors.black }]}>
              {item?.u_G2OffLoc || item?.u_G2OffAdd || 'N/A'}
            </Text>
          </View>

          <Button
            title="View Installment"
            textStyle={{ color: theme.colors.secondaryDark }}
            onPress={() => setShowPervious(true)}
            style={{
              alignSelf: 'center',
              width: '70%',
              paddingVertical: 6,
              marginTop: 10,
              backgroundColor: theme.colors.white,
              borderColor: theme.colors.secondaryDark,
              borderWidth: 1,
              borderRadius: AppSizes.Radius_10,
            }}
          />

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

  const renderPreviousItem = ({
    item,
    index,
  }: {
    item: any;
    index: number;
  }) => {
    console.log('Rendering item:', item);

    return (
      <View
        key={index}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#f9f9f9',
          paddingVertical: 10,
          paddingHorizontal: 15,
          marginHorizontal: 15,
          borderRadius: 8,
          marginVertical: 5,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 2,
        }}
      >
        <Text
          style={{
            // flex: 1,
            color: theme.colors.black,
            fontSize: AppSizes.Font_14,
            fontFamily: fonts.medium,
          }}
        >
          {index + 1}.
        </Text>

        <Text
          style={{
            // flex: 1,
            color: theme.colors.black,
            fontSize: AppSizes.Font_14,
            fontFamily: fonts.medium,
          }}
        >
          {item?.receiptDate || 'N/A'}
        </Text>

        <Text
          style={{
            // flex: 1,
            color: theme.colors.black,
            fontSize: AppSizes.Font_14,
            fontFamily: fonts.medium,
          }}
        >
          {item?.receiptAmnt || 'N/A'}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.overlay} />
      <View style={styles.safeArea}>
        {/*  Screen Header */}
        <Header
          title="Customer"
          subtitle="Customer Information"
          showBackButton
        />

        {/*  Loading or List Display */}
        {loading ? (
          <Loader title="Loading Customer details..." />
        ) : (
          <>
            <FlatList
              data={[customerDetails]}
              keyExtractor={item => item.id}
              refreshing={loading}
              // nestedScrollEnabled
              // scrollEnabled={false}
              onRefresh={getCustomerDetails}
              contentContainerStyle={styles.list}
              renderItem={renderItem}
              ListEmptyComponent={
                <View style={styles.center}>
                  <Text
                    style={[styles.errorText, { color: theme.colors.black }]}
                  >
                    Customer data not available
                  </Text>
                  <Button title="Retry" onPress={getCustomerDetails} />
                </View>
              }
            />

            {showpervious && (
              <Modal visible onClose={() => setShowPervious(false)}>
                <View style={{ marginBottom: 20 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: AppSizes.Margin_Vertical_10,
                      // height:AppSizes.Margin_Vertical_40
                    }}
                  >
                    <Text
                      style={{
                        color: theme.colors.secondaryDark,
                        fontFamily: fonts.bold,
                        fontSize: AppSizes.Font_16,
                        //padding: AppSizes.Padding_Horizontal_10,
                        textAlign: 'left',
                        //backgroundColor: theme.colors.secondaryDark,
                        borderRadius: AppSizes.Gap_10,
                        //marginBottom: AppSizes.Margin_Horizontal_20,
                      }}
                    >
                      Previous Months Installment Detail
                    </Text>
                    <Ionicons
                      name={'close'}
                      size={AppSizes.Icon_Height_30}
                      color={'red'}
                      onPress={() => setShowPervious(false)}
                      //style={{ marginBottom: AppSizes.Margin_Vertical_10}}
                    />
                  </View>

                  <FlatList
                    data={installments}
                    keyExtractor={item => item?.index}
                    scrollEnabled
                    showsVerticalScrollIndicator
                    renderItem={renderPreviousItem}
                    ListEmptyComponent={
                      <View style={styles.center}>
                        <Text
                          style={[
                            styles.errorText,
                            { color: theme.colors.black },
                          ]}
                        >
                          Customer data not available
                        </Text>
                        <Button title="Retry" onPress={getCustomerDetails} />
                      </View>
                    }
                  />
                </View>
              </Modal>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

// 🔹 Styles
const styles = StyleSheet.create({
  background: { flex: 1, width: '100%', height: '100%' },
  overlay: { backgroundColor: 'white' },
  safeArea: { flex: 1, paddingBottom: 20 },
  list: { padding: 20, rowGap: AppSizes.Padding_Horizontal_20 },
  item: {
    borderRadius: 12,
    padding: 16,
    elevation: 14,
    rowGap: AppSizes.Margin_Vertical_10,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginVertical:  AppSizes.Margin_Vertical_10,
    alignItems: 'center',
  },
  inlineField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AppSizes.Gap_10,
  },
  centered: { justifyContent: 'center', alignItems: 'flex-start' },
  title: { fontSize: AppSizes.Font_18 },
  subtitle: { fontSize: AppSizes.Font_16 },
  label: { fontSize: AppSizes.Font_14, fontFamily: fonts.semiBold, flex: 1.3 },
  value: { fontSize: AppSizes.Font_14, fontFamily: fonts.semiBold, flex: 1.7 ,textAlign:'right'},
  separator: { marginVertical: 10, borderWidth: 0.5, borderTopColor: '#ccc' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: {
    fontSize: 16,
    fontFamily: fonts.extraBoldItalic,
    marginBottom: 12,
  },
  sectionHeader: {
    alignSelf: 'center',
    //color: theme.colors.secondaryDark,
    fontFamily: fonts.medium,
    //marginVertical: AppSizes.Margin_Vertical_10,
  },
});
