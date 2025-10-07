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

export const CustomerList: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { AvoId } = route.params;

  const [customers, setCustomers] = useState<any[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandedCustomerCode, setExpandedCustomerCode] = useState<
    string | null
  >(null);

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
        // setSearchQuery('');
        // debouncedSearch('');
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

  /** ------------------ Search Optimization ------------------ **/
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
        const filtered = customers.filter(customer =>
          customer?.customerName?.toLowerCase().includes(lowerText),
        );
        setFilteredCustomers(filtered);
      }, 300),
    [customers],
  );

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    debouncedSearch(text);
  };

  /** ------------------ Customer Navigation ------------------ **/
  const handleCustomerPress = useCallback(
    (item: any) => {
      navigation.navigate(screenName.CustomerDetail, {
        CustomerCode: item?.invDocEntry,
      });
    },
    [navigation],
  );

  const handleToggle = useCallback((code: string) => {
    setExpandedCustomerCode(prev => (prev === code ? null : code));
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: any }) => {
      const isExpanded = expandedCustomerCode === item.customerCode;

      return (
        <TouchableOpacity
          key={item.customerCode}
          onPress={() => handleCustomerPress(item)}
          activeOpacity={0.9}
          style={[styles.item, { backgroundColor: theme.colors.surface }]}
        >
          <Text
            style={[
              styles.title,
              {
                color: theme.colors.secondaryDark,
                fontFamily: fonts.bold,
                marginVertical: AppSizes.Margin_Vertical_10,
              },
            ]}
          >
            {item.customerName || 'N/A'}
          </Text>

          {/* BASIC INFO */}
          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Customer Code :
            </Text>
            <Text style={[styles.value, { color: theme.colors.black }]}>
              {item.customerCode || 'N/A'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Customer Status :
            </Text>
            <Text style={[styles.value, { color: theme.colors.warning }]}>
              {item.instStatus || 'N/A'}
            </Text>
          </View>

          <View style={styles.separator} />

          {/* EXPANDED VIEW */}
          {isExpanded && (
            <View style={{ marginTop: 10 }}>
              <View style={styles.row}>
                <Text
                  style={[styles.label, { color: theme.colors.textSecondary }]}
                >
                  Invoice No :
                </Text>
                <Text style={[styles.value, { color: theme.colors.black }]}>
                  {item.invoiceNo || 'N/A'}
                </Text>
              </View>

              <View style={styles.row}>
                <Text
                  style={[styles.label, { color: theme.colors.textSecondary }]}
                >
                  Product :
                </Text>
                <Text style={[styles.value, { color: theme.colors.black }]}>
                  {item.product || 'N/A'}
                </Text>
              </View>

              <View style={styles.row}>
                <Text
                  style={[styles.label, { color: theme.colors.textSecondary }]}
                >
                  Installment Amount :
                </Text>
                <Text style={[styles.value, { color: theme.colors.black }]}>
                  {item.installment || 'N/A'}
                </Text>
              </View>

              <Ionicons
                name="chevron-up"
                size={22}
                color={theme.colors.secondaryDark}
                style={{ alignSelf: 'center', marginTop: 8 }}
                onPress={() => handleToggle(item.customerCode)}
              />
            </View>
          )}

          {/* COLLAPSED STATE BUTTON */}
          {!isExpanded && (
            <Button
              title="View Detail"
              textStyle={{ color: theme.colors.secondaryDark, padding: 0 }}
              onPress={() => handleToggle(item.customerCode)}
              style={{
                paddingHorizontal: theme.spacing.md,
                paddingVertical: 6,
                minHeight: 22,
                marginTop: 10,
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.secondaryDark,
                borderWidth: 1,
              }}
            />
          )}
        </TouchableOpacity>
      );
    },
    [theme, expandedCustomerCode, handleToggle],
  );

  /** ------------------ Key Extractor ------------------ **/
  const keyExtractor = useCallback(
    (item: any) => String(item.id || item.invDocEntry),
    [],
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Customers" subtitle="AVO's Customers" showBackButton />

      {loading ? (
        <Loader title="Loading Customers..." />
      ) : (
        <>
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

            {searchQuery.length > 0 ? (
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  right: AppSizes.Margin_Horizontal_10,
                  marginTop: AppSizes.Margin_Vertical_10,
                }}
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
            ) : null}
          </View>

          <FlatList
            data={filteredCustomers}
            keyExtractor={item => item.customerCode.toString()}
            renderItem={renderItem}
            refreshing={loading}
            onRefresh={getAllCustomers}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text
                  style={{
                    color: theme.colors.textSecondary,
                    fontFamily: fonts.extraBoldItalic,
                  }}
                >
                  No Customers Found
                </Text>
              </View>
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
  container: { flex: 1 },
  searchContainer: {
    marginHorizontal: AppSizes.Margin_Horizontal_20,
    marginVertical: AppSizes.Margin_Vertical_20,
  },
  searchInput: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: AppSizes.Font_16,
    elevation: 3,
  },
  listContainer: {
    padding: 20,
    rowGap: AppSizes.Padding_Horizontal_20,
  },
  item: {
    borderRadius: 12,
    padding: 16,
    elevation: 5,
    marginBottom: 12,
  },
  title: { fontSize: AppSizes.Font_18 },
  subtitle: { fontSize: AppSizes.Font_14, marginTop: 4 },
  label: { fontSize: AppSizes.Font_14, fontWeight: 'bold' },
  value: { fontSize: AppSizes.Font_14, fontWeight: 'bold' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  separator: {
    marginVertical: 12,
    // marginHorizontal: AppSizes.Gap_30,
    borderWidth: 0.5,
    borderTopColor: '#ccc',
  },
  emptyContainer: { flex: 1, alignItems: 'center', marginTop: 40 },
});
