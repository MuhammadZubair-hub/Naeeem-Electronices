import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  BackHandler,
  Alert,
  ScrollView,
  Linking,
  Modal,
} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { showMessage } from 'react-native-flash-message';
import { useTheme } from '../../../hooks/useTheme';
import { Header } from '../../../components/common/Header';
import { Button } from '../../../components/common/Button';
import { API_Config } from '../../services/apiServices';
import { fonts } from '../../../assets/fonts/Fonts';
import { AppSizes } from '../../../utils/AppSizes';
import { CommonStyles } from '../../../styles/GlobalStyle';
import Loader from '../../../components/common/Loader';
import { screenName } from '../../navigation/ScreenName';
import { debounce } from 'lodash';
import Ionicons from '@react-native-vector-icons/ionicons';
import EmptyComponents from '../../../components/common/EmptyComponents';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/store';
import { logout } from '../../../redux/slices/authSlice';
import MainHeader from '../../../components/common/MainHeader';
import { HorizontalStackedBarGraph } from '../../../components/charts/BarGraphHorizontal';
import { Card } from '../../../components/common';
import BaseModal from '../../../components/common/BaseModal';

const InfoRow = ({
  label,
  value,
  color,
  secondaryColor,
  labelFlex,
  onPress,
}: {
  label: string;
  value: any;
  color: string;
  secondaryColor: string;
  labelFlex?: number;
  onPress?: () => void;
}) => (
  <View style={CommonStyles.row}>
    <Text
      style={[
        CommonStyles.subtitle,
        { color: secondaryColor, flex: labelFlex || undefined },
      ]}
    >
      {label}
    </Text>
    {onPress ? (
      <TouchableOpacity onPress={onPress}>
        <Text
          style={[
            CommonStyles.value,
            { color, textDecorationLine: 'underline' },
          ]}
        >
          {value || 'N/A'}
        </Text>
      </TouchableOpacity>
    ) : (
      <Text style={[CommonStyles.value, { color }]}>{value || 'N/A'}</Text>
    )}
  </View>
);

interface Region {
  region: string;
  total: number;
  paid: number;
  due: number;
}

export const CustomerList: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const users = useSelector((state: RootState) => state.auth.user);
  const route = useRoute<any>();
  const AvoId = route?.params?.AvoId ?? users?.assignedId;

  const [customers, setCustomers] = useState<any[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const [AvoCountData, setAvoCountData] = useState<{
    total: number;
    due: number;
    paid: number;
  }>({ total: 0, due: 0, paid: 0 });
  const [allZonesTotal, setAllZoneTotal] = useState<Region[]>([]);

  if (users?.designation == 'AVO') {
    useFocusEffect(
      React.useCallback(() => {
        const backAction = () => {
          Alert.alert(
            'Hold On',
            'Do you want to exit the app?',
            [
              {
                text: 'Cancel',
                onPress: () => null,
                style: 'cancel',
              },
              {
                text: 'YES',
                onPress: () => {
                  dispatch(logout());
                  BackHandler.exitApp();
                },
              },
            ],
            { cancelable: true },
          );
          return true;
        };

        const backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          backAction,
        );

        return () => backHandler.remove();
      }, []),
    );
  }

  const getAVOCount = useCallback(async () => {
      console.log("🚀 ~ :142 ~ CustomerList ~ AvoId:", AvoId)
    const res = await API_Config.getAvoCountDetails({
      AssignedID: AvoId,
    });

    if (res.success) {
      const data = res.data.data;
      console.log('this is is', data);
      const countData = res.data.data[0];
      setAvoCountData(prev => ({
        ...prev,
        total: countData?.instTotalAmount,
        due: countData?.instDueAmount,
        paid: countData?.instRecAmount,
      }));
    }
  }, [AvoId]);

  const getAllCustomers = useCallback(async () => {
    try {
      const response = await API_Config.getAllCustomers({ AssignedID: AvoId });
      if (response?.success) {
        const data = response?.data?.data || [];
        console.log('All customers are : ', data);
        setCustomers(data);
        setFilteredCustomers(data);
      } else {
        showMessage({
          message: 'Error',
          description: response?.data?.message || 'Failed to load customers',
          type: 'danger',
          style: CommonStyles.error,
        });
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  }, [AvoId]);

  const getAllAvoDetials = useCallback(async () => {
    try {
      setLoading(true);
      await Promise.all([getAVOCount(), getAllCustomers()]);
    } catch (error) {
      showMessage({
        message: 'Error',
        description: `${error}`,
        type: 'danger',
        style: CommonStyles.error,
      });
    } finally {
      setLoading(false);
    }
  }, [getAVOCount, getAllCustomers]);

  useEffect(() => {
    getAllAvoDetials();
  }, [getAllAvoDetials]);

  useEffect(() => {}, [allZonesTotal]);

  return (
    <SafeAreaView edges={['top']} style={CommonStyles.mainContainer}>
      <Header title="Customers" subtitle="AVO's Customers" showBackButton />

      {loading ? (
        <Loader title="Loading Customers" />
      ) : (
        <>
          {AvoCountData.due == 0 ? (
            <Text
              style={{
                flex: 1,
                marginTop: AppSizes.Margin_Vertical_100,
                justifyContent: 'center',
                textAlign: 'center',
                color: theme.colors.secondaryDark,
                fontFamily: fonts.semiBold,
                fontSize: AppSizes.Font_18,
              }}
            >
              This AVO has no outstanding amounts against any customer.
            </Text>
          ) : (
            <>
              <AvosCoustomerData
                coustomerData={customers}
                refreshing={loading}
                onRefresh={() => getAllAvoDetials()}
              />
            </>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

interface AvosCoustomerDataProps {
  coustomerData: any;
  refreshing: any;
  onRefresh: any;
}

export const AvosCoustomerData = ({
  coustomerData,
  refreshing,
  onRefresh,
}: AvosCoustomerDataProps) => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();

  const [customers, setCustomers] = useState<any[]>(coustomerData || []);
  const [filteredCustomers, setFilteredCustomers] = useState<any[]>(
    coustomerData || [],
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPhone, setSelectedPhone] = useState('');

  const debouncedSearch = useMemo(
    () =>
      debounce((text: string) => {
        if (!Array.isArray(customers) || customers.length === 0) {
          setFilteredCustomers([]);
          return;
        }

        if (!text) {
          setFilteredCustomers(customers);
          return;
        }

        const lowerText = text.toLowerCase();
        const filtered = customers.filter(
          customer =>
            customer?.customerName?.toLowerCase().includes(lowerText) ||
            customer?.customerCode?.toLowerCase().includes(lowerText) ||
            customer?.invDocNo?.toLowerCase().includes(lowerText) ||
            customer?.product?.toLowerCase().includes(lowerText) ||
            customer?.phone1?.toLowerCase().includes(lowerText) ||
            customer?.phone2?.toLowerCase().includes(lowerText) ||
            customer?.cnic?.toLowerCase().includes(lowerText),
        );
        setFilteredCustomers(filtered);
      }, 300),
    [customers],
  );

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    debouncedSearch(text);
  };

  const handleCustomerPress = useCallback(
    (item: any) => {
      console.log('i am ', item);
      navigation.navigate(screenName.CustomerDetail, {
        CustomerCode: item?.invDocEntry,
      });
    },
    [navigation],
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
      let clean = phoneNumber.replace(/[^\d]/g, '');
      if (clean.startsWith('92') && clean.length >= 12) {
        // already has country code, use as-is
      } else if (clean.startsWith('0')) {
        clean = '92' + clean.substring(1);
      } else {
        clean = '92' + clean;
      }
      console.log('nbr: ', clean);
      const whatsappUrl = `https://wa.me/${clean}`;

      Linking.openURL(whatsappUrl).catch(err => {
        console.error('Error opening WhatsApp:', err);
        Alert.alert(
          'Error',
          'Could not open WhatsApp. Please make sure it is installed.',
        );
      });
    }
  };

  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <View
        key={item.customerCode}
        style={[CommonStyles.item, { backgroundColor: theme.colors.surface }]}
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
          {item.customerName || 'N/A'}
        </Text>

        <InfoRow
          label="Customer Code :"
          value={item.customerCode}
          color={theme.colors.black}
          secondaryColor={theme.colors.textSecondary}
        />
        <InfoRow
          label="CNIC No. :"
          value={item.cnic}
          color={theme.colors.black}
          secondaryColor={theme.colors.textSecondary}
        />
        <InfoRow
          label="Phone No. 1 :"
          value={item.phone1}
          color={theme.colors.black}
          secondaryColor={theme.colors.textSecondary}
          onPress={() => showPhoneOptions(item.phone1)}
        />
        <InfoRow
          label="Phone No. 2 :"
          value={item.phone2}
          color={theme.colors.black}
          secondaryColor={theme.colors.textSecondary}
          onPress={() => showPhoneOptions(item.phone2)}
        />
        <InfoRow
          label="Invoice No :"
          value={item.invDocNo}
          color={theme.colors.black}
          secondaryColor={theme.colors.textSecondary}
        />
        <InfoRow
          label="Invoice Date :"
          value={item.invDocDate}
          color={theme.colors.black}
          secondaryColor={theme.colors.textSecondary}
        />
        <InfoRow
          label="Product :"
          value={item.product}
          color={theme.colors.black}
          secondaryColor={theme.colors.textSecondary}
        />
        <InfoRow
          label="Installment Amount :"
          value={item.instTotalAmount}
          color={theme.colors.black}
          secondaryColor={theme.colors.textSecondary}
          labelFlex={1.5}
        />
        <InfoRow
          label="Due Amount :"
          value={item.instDueAmount}
          color={theme.colors.black}
          secondaryColor={theme.colors.textSecondary}
        />
        <InfoRow
          label="Balance :"
          value={item.balance}
          color={theme.colors.black}
          secondaryColor={theme.colors.textSecondary}
        />

        <Button
          title="View Detail"
          onPress={() => handleCustomerPress(item)}
          style={{
            paddingHorizontal: theme.spacing.md,
            paddingVertical: 6,
            minHeight: 22,
            marginTop: 10,
            backgroundColor: theme.colors.secondaryDark,
            borderColor: theme.colors.secondaryDark,
            borderWidth: 1,
          }}
        />

        <View style={CommonStyles.divider} />
      </View>
    ),
    [theme, handleCustomerPress],
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
  return (
    <>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search Customers"
          placeholderTextColor={theme.colors.textSecondary}
          value={searchQuery}
          onChangeText={handleSearchChange}
          style={[
            styles.searchInput,
            {
              backgroundColor: theme.colors.surface,
              color: theme.colors.textPrimary,
            },
          ]}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => {
              setSearchQuery('');
              debouncedSearch('');
            }}
          >
            <Ionicons
              name="close-circle-outline"
              size={24}
              color={theme.colors.secondaryDark}
            />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredCustomers}
        keyExtractor={(item, index) => item.id?.toString() ?? index.toString()}
        renderItem={renderItem}
        refreshing={refreshing}
        onRefresh={onRefresh}
        contentContainerStyle={{
          paddingBottom: AppSizes.Padding_Horizontal_20,
          rowGap: AppSizes.Margin_Vertical_20,
        }}
        ListEmptyComponent={() => (
          <EmptyComponents
            emptyMessage="Not any customer found"
            emptySubMessage=""
          />
        )}
        initialNumToRender={15}
        maxToRenderPerBatch={30}
        windowSize={15}
        removeClippedSubviews
        showsVerticalScrollIndicator={false}
      />

      <PhoneOptionsModal
        visible={modalVisible}
        phoneNumber={selectedPhone}
        onClose={() => setModalVisible(false)}
        onCall={() => makeCall(selectedPhone)}
        onWhatsApp={() => openWhatsApp(selectedPhone)}
        theme={theme}
      />
    </>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    marginHorizontal: AppSizes.Margin_Horizontal_20,
    marginVertical: AppSizes.Margin_Vertical_20,
  },
  searchInput: {
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: AppSizes.Font_14,
    elevation: 3,
    fontFamily: fonts.medium,
  },
  clearButton: {
    position: 'absolute',
    right: AppSizes.Margin_Horizontal_10,
    marginTop: AppSizes.Margin_Vertical_10,
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
