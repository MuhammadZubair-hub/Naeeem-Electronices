import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { showMessage } from 'react-native-flash-message';
import { useTheme } from '../../hooks/useTheme';
import { Header } from '../../components/common/Header';
import { Button } from '../../components/common/Button';
import { API_Config } from '../../services/apiServices';
import { fonts } from '../../assets/fonts/Fonts';
import { AppSizes } from '../../utils/AppSizes';
import { CommonStyles } from '../../styles/GlobalStyle';
import Loader from '../../components/common/Loader';
import { screenName } from '../../navigation/ScreenName';
import { debounce } from 'lodash';
import Ionicons from '@react-native-vector-icons/ionicons';
import EmptyComponents from '../../components/common/EmptyComponents';

const InfoRow = ({
  label,
  value,
  color,
  secondaryColor,
  labelFlex,
}: {
  label: string;
  value: any;
  color: string;
  secondaryColor: string;
  labelFlex?: number;
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
    <Text style={[CommonStyles.value, { color }]}>{value || 'N/A'}</Text>
  </View>
);

export const CustomerList: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { AvoId } = route.params;

  const [customers, setCustomers] = useState<any[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  /** ------------------ Fetch Customers ------------------ **/
  const getAllCustomers = useCallback(async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  }, [AvoId]);

  useEffect(() => {
    getAllCustomers();
  }, [getAllCustomers]);

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
      navigation.navigate(screenName.CustomerDetail, {
        CustomerCode: item?.invDocEntry,
      });
    },
    [navigation],
  );

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
        />
        <InfoRow
          label="Phone No. 2 :"
          value={item.phone2}
          color={theme.colors.black}
          secondaryColor={theme.colors.textSecondary}
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

  return (
    <SafeAreaView
    edges={['top']}
    style={CommonStyles.mainContainer}>
      <Header title="Customers" subtitle="AVO's Customers" showBackButton />

      {loading ? (
        <Loader title="Loading Customers..." />
      ) : (
        <>
          {/* Search Box */}
          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Search Customers..."
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

          {/* Customer List */}
          <FlatList
            data={filteredCustomers}
            keyExtractor={item => item.customerCode.toString()}
            renderItem={renderItem}
            refreshing={loading}
            onRefresh={getAllCustomers}
            contentContainerStyle={{
              paddingBottom:AppSizes.Padding_Horizontal_20,
              rowGap:AppSizes.Margin_Vertical_20
            }}
            ListEmptyComponent={() => (
              <EmptyComponents emptyMessage="Not any customer found..." />
            )}
            initialNumToRender={15}
            maxToRenderPerBatch={30}
            windowSize={15}
            removeClippedSubviews
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
    </SafeAreaView>
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
});
