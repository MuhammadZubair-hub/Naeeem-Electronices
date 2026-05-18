import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
  Linking,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Header } from '../../../components/common/Header';
import { API_Config } from '../../services/apiServices';
import { fonts } from '../../../assets/fonts/Fonts';
import { AppSizes } from '../../../utils/AppSizes';
import Loader from '../../../components/common/Loader';
import { showMessage } from 'react-native-flash-message';
import { CommonStyles } from '../../../styles/GlobalStyle';
import { Button } from '../../../components/common/Button';
import { useTheme } from '../../../hooks/useTheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import { set } from 'lodash';
import BaseModal from '../../../components/common/BaseModal';

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

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPhone, setSelectedPhone] = useState('');
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
        console.log(data);

        perviousInsatllment = data.map((item: any) => ({
          receiptDate: item.receiptDate,
          receiptAmnt: item.receiptAmnt,
        }));
        setInstallments(perviousInsatllment);
        //console.log('perviousInsatllment', perviousInsatllment);

        let length = data.length;
        //console.log('lenght is : ', length);
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

  const InfoRow = ({ label, value, onPress }: any) => (
    <View style={CommonStyles.row}>
      <Text style={[CommonStyles.label, { color: theme.colors.textSecondary }]}>
        {label}
      </Text>
      {onPress ? (
        <TouchableOpacity onPress={onPress}>
          <Text
            style={[
              CommonStyles.value,
              {
                color: theme.colors.black,
                flex: 1.7,
                textDecorationLine: 'underline',
              },
            ]}
          >
            {value || 'N/A'}
          </Text>
        </TouchableOpacity>
      ) : (
        <Text
          style={[CommonStyles.value, { color: theme.colors.black, flex: 1.7 }]}
        >
          {value || 'N/A'}
        </Text>
      )}
    </View>
  );

  const renderItem = ({ item }: { item: any }) => (
    <View
      style={[{ backgroundColor: theme.colors.surface }, CommonStyles.item]}
    >
      <View style={CommonStyles.row}>
        <View style={[styles.centered, { flex: 2 }]}>
          <Text
            style={[
              CommonStyles.title,
              { color: theme.colors.secondaryDark, fontFamily: fonts.bold },
            ]}
          >
            {item?.customerName || 'N/A'}
          </Text>
          <Text
            style={[
              CommonStyles.subtitle,
              {
                color: theme.colors.textSecondary,
                fontFamily: fonts.medium,
                alignSelf: 'auto',
              },
            ]}
          >
            S/O
          </Text>
          <Text
            style={[
              CommonStyles.title,
              { color: theme.colors.secondaryDark, fontFamily: fonts.bold },
            ]}
          >
            {item?.fatrherName || 'N/A'}
          </Text>
        </View>

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
      <InfoRow label="Invoice Date :" value={item?.invoiceDate} />
      <InfoRow label="Customer Code :" value={item?.customerCode} />
      <InfoRow label="Processing No :" value={item?.processingNo} />
      <InfoRow label="Invoice No :" value={item?.invoiceNo} />
      <InfoRow label="Sold By :" value={item?.salePerson} />
      <InfoRow label="Verified By :" value={item?.inqPerson} />
      <InfoRow label="Delivered By :" value={item?.avMs} />

      {!isExpanded ? (
        <Button
          title="Customer Detail"
          textStyle={{ color: theme.colors.white }}
          onPress={() => setIsExpanded(true)}
          style={{
            paddingVertical: 6,
            backgroundColor: theme.colors.secondaryDark,
            borderRadius: AppSizes.Radius_10,
          }}
        />
      ) : (
        <View style={{ rowGap: AppSizes.Margin_Vertical_10 }}>
          <View
            style={[
              CommonStyles.divider,
              { marginHorizontal: AppSizes.Gap_10 },
            ]}
          />

          <InfoRow label="Model :" value={item?.u_Model} />
          <InfoRow label="Company :" value={item?.company} />
          <InfoRow label="Item Name :" value={item?.itemName} />
          <InfoRow label="Serial No. :" value={item?.serial} />
          <InfoRow label="Price :" value={item?.price} />
          <InfoRow label="Installment Amount :" value={item?.installment} />
          <InfoRow label="Due Amount :" value={item?.due} />
          <InfoRow label="Balance :" value={item?.balance} />
          <InfoRow label="Duration :" value={item?.duration} />
          <InfoRow label="CNIC :" value={item?.cnic} />
          <InfoRow label="Occupation :" value={item?.u_Occupation} />
          <InfoRow label="Married :" value={item?.u_Mstatus} />
          <InfoRow label="House Owner :" value={item?.u_Howner} />
          <InfoRow
            label="Phone No. 1 :"
            value={item?.phone}
            onPress={() => showPhoneOptions(item.phone)}
          />
          <InfoRow
            label="Phone No. 2 :"
            value={item?.phone2}
            onPress={() => showPhoneOptions(item.phone2)}
          />
          <InfoRow label="Location Res :" value={item?.u_Raddress} />
          <InfoRow label="Location Offc :" value={item?.u_Offaddress} />

          <View>
            <View
              style={[
                CommonStyles.divider,
                { marginVertical: 5, marginHorizontal: AppSizes.Gap_10 },
              ]}
            />
            <Text
              style={[
                styles.sectionHeader,
                { color: theme.colors.secondaryDark },
              ]}
            >
              G1 Details
            </Text>
            <View
              style={[
                CommonStyles.divider,
                { marginVertical: 5, marginHorizontal: AppSizes.Gap_10 },
              ]}
            />
          </View>

          <Text
            style={[
              CommonStyles.label,
              {
                color: theme.colors.secondaryDark,
                fontSize: AppSizes.Font_16,
                fontFamily: fonts.semiBold,
              },
            ]}
          >
            {item.u_G1Name} s/o {item.u_G1FName}
          </Text>

          <InfoRow label="CNIC :" value={item?.u_G1CNIC} />
          <InfoRow label="Occupation :" value={item?.u_G1Occup} />
          <InfoRow
            label="Phone 1 :"
            value={item?.u_G1Restel}
            onPress={() => showPhoneOptions(item.u_G1Restel)}
          />
          <InfoRow
            label="Phone 2 :"
            value={item?.u_G1Offtel}
            onPress={() => showPhoneOptions(item.u_G1Offtel)}
          />
          <InfoRow label="Location Res :" value={item?.u_G1ResAdd} />
          <InfoRow label="Location Offc :" value={item?.u_G1OffAdd} />

          <View>
            <View
              style={[
                CommonStyles.divider,
                { marginVertical: 5, marginHorizontal: AppSizes.Gap_10 },
              ]}
            />
            <Text
              style={[
                styles.sectionHeader,
                { color: theme.colors.secondaryDark },
              ]}
            >
              G2 Details
            </Text>
            <View
              style={[
                CommonStyles.divider,
                { marginVertical: 5, marginHorizontal: AppSizes.Gap_10 },
              ]}
            />
          </View>

          <Text
            style={[
              CommonStyles.label,
              {
                color: theme.colors.secondaryDark,
                fontSize: AppSizes.Font_16,
                fontFamily: fonts.semiBold,
              },
            ]}
          >
            {item.u_G2Name} s/o {item.u_G2FName}
          </Text>

          <InfoRow label="CNIC :" value={item?.u_G2CNIC} />
          <InfoRow label="Occupation :" value={item?.u_G2Occup} />
          <InfoRow
            label="Phone 1 :"
            value={item?.u_G2Restel}
            onPress={() => showPhoneOptions(item.u_G2Restel)}
          />
          <InfoRow
            label="Phone 2 :"
            value={item?.u_G2Offtel}
            onPress={() => showPhoneOptions(item.u_G2Offtel)}
          />
          <InfoRow label="Location Res :" value={item?.u_G2ResAdd} />
          <InfoRow label="Location Offc :" value={item?.u_G2OffAdd} />

          <Button
            title="View Installments"
            textStyle={{ color: theme.colors.secondaryDark }}
            onPress={() => setShowPervious(true)}
            variant="outline"
            style={CommonStyles.viewButtonStyle}
          />

          <Ionicons
            name="chevron-up"
            size={22}
            color={theme.colors.secondaryDark}
            style={{ alignSelf: 'center' }}
            onPress={() => setIsExpanded(false)}
          />
        </View>
      )}
    </View>
  );

  const PhoneOptionsModal = ({
    visible,
    phoneNumber,
    onClose,
    onCall,
    onWhatsApp,
    theme,
  }: {
    visible: boolean;
    phoneNumber: string;
    onClose: () => void;
    onCall: () => void;
    onWhatsApp: () => void;
    theme: any;
  }) => (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContainer,
            {
              backgroundColor: theme.colors.white,
              borderColor: theme.colors.secondaryDark,
              maxHeight: '40%',
            },
          ]}
        >
          <View style={styles.headerContainer}>
            <Text
              style={[
                styles.headerText,
                {
                  color: theme.colors.secondaryDark,
                },
              ]}
            >
              {/* {phoneNumber} */}
              Choose Contact Option
            </Text>
            <Ionicons
              name="close"
              onPress={onClose}
              color={'red'}
              size={AppSizes.Icon_Height_30}
            />
          </View>

          <ScrollView style={styles.contentContainer}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                {
                  borderBottomColor: theme.colors.border,
                },
              ]}
              onPress={() => {
                onClose();
                onCall();
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: AppSizes.Gap_20,
                  alignItems: 'center',
                }}
              >
                <Ionicons
                  name="call-outline"
                  onPress={onClose}
                  color={'black'}
                  size={AppSizes.Icon_Height_30}
                />

                <Text
                  style={[
                    styles.optionText,
                    {
                      color: theme.colors.black,
                    },
                  ]}
                >
                  Phone Call
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                {
                  borderBottomColor: theme.colors.border,
                },
              ]}
              onPress={() => {
                onClose();
                onWhatsApp();
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: AppSizes.Gap_20,
                  alignItems: 'center',
                }}
              >
                <Ionicons
                  name="logo-whatsapp"
                  onPress={onClose}
                  color={'green'}
                  size={AppSizes.Icon_Height_30}
                />

                <Text
                  style={[
                    styles.optionText,
                    {
                      color: theme.colors.black,
                    },
                  ]}
                >
                  WhatsApp
                </Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );

  const showPhoneOptions = (phoneNumber: string) => {
    if (!phoneNumber) return;
    setSelectedPhone(phoneNumber);
    setModalVisible(true);
  };

  const makeCall = (phoneNumber: string) => {
    if (phoneNumber) {
      const cleanNumber = phoneNumber.replace(/[^\d+]/g, '');
      const phoneUrl = `tel:${cleanNumber}`;

      Linking.openURL(phoneUrl).catch(err =>
        console.error('Error making call:', err),
      );
    }
  };

  const openWhatsApp = (phoneNumber: string) => {
    if (phoneNumber) {
      let cleanNumber = phoneNumber.replace(/[^\d+]/g, '');

      if (!cleanNumber.startsWith('+')) {
        cleanNumber = cleanNumber.startsWith('0')
          ? '+92' + cleanNumber.substring(1)
          : '+92' + cleanNumber;
      }

      const whatsappNumber = cleanNumber.replace('+', '');
      const whatsappUrl = `whatsapp://send?phone=${whatsappNumber}`;

      Linking.openURL(whatsappUrl).catch(err => {
        console.error('Error opening WhatsApp:', err);
        Alert.alert(
          'Error',
          'Could not open WhatsApp. Please make sure it is installed.',
        );
      });
    }
  };
  const renderPreviousItem = ({
    item,
    index,
  }: {
    item: any;
    index: number;
  }) => {
    console.log('Rendering item:', item);

    if (!item?.receiptDate || item?.receiptDate === 'N/A') {
      return null;
    }

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
    <SafeAreaView edges={['top']} style={styles.background}>
      <Header title="Customer" subtitle="Customer Information" showBackButton />

      {loading ? (
        <Loader title="Loading Customer detail" />
      ) : (
        <>
          <FlatList
            data={[customerDetails]}
            keyExtractor={(item, index) =>
              item.id?.toString() ?? index.toString()
            }
            refreshing={loading}
            onRefresh={getCustomerDetails}
            contentContainerStyle={CommonStyles.list}
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

          <PhoneOptionsModal
            visible={modalVisible}
            phoneNumber={selectedPhone}
            onClose={() => setModalVisible(false)}
            onCall={() => makeCall(selectedPhone)}
            onWhatsApp={() => openWhatsApp(selectedPhone)}
            theme={theme}
          />

          {showpervious && (
            <BaseModal
              visible
              onClose={() => setShowPervious(prev => !prev)}
              headerText=" Previous Months Installment Detail"
            >
              <FlatList
                // data={installments}
                // keyExtractor={item => item?.receiptDate}

                data={installments.filter(
                  item => item.receiptDate && item.receiptDate !== 'N/A',
                )}
                keyExtractor={(item, index) => `${item?.receiptDate}-${index}`}
                scrollEnabled
                showsVerticalScrollIndicator
                renderItem={renderPreviousItem}
                ListEmptyComponent={
                  <View style={styles.center}>
                    <Text
                      style={[styles.errorText, { color: theme.colors.black }]}
                    >
                      Not found
                    </Text>
                    {/* <Button title="Retry" onPress={getCustomerDetails} /> */}
                  </View>
                }
              />
            </BaseModal>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },

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
  value: {
    fontSize: AppSizes.Font_14,
    fontFamily: fonts.semiBold,
    flex: 1.7,
    textAlign: 'right',
  },
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

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: AppSizes.Radius_20,
    borderTopRightRadius: AppSizes.Radius_20,
    padding: AppSizes.Padding_Horizontal_10,
    width: '100%',
  },
  headerContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 5,
    alignItems: 'center',
  },
  headerText: {
    fontSize: AppSizes.Font_16,
    fontFamily: fonts.semiBold,
    flex: 1,
    textAlign: 'center',
  },
  contentContainer: {
    width: '100%',
  },
  optionButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 16,
    textAlign: 'center',
    fontFamily: fonts.medium,
  },
  cancelButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    marginTop: 8,
  },
  cancelText: {
    fontSize: 16,
    textAlign: 'center',
    fontFamily: fonts.medium,
    fontWeight: '500',
  },
});
