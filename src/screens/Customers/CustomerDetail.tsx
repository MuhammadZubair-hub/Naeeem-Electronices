import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Header } from '../../components/common/Header';
import { API_Config } from '../../services/apiServices';
import { fonts } from '../../assets/fonts/Fonts';
import { AppSizes } from '../../utils/AppSizes';
import Loader from '../../components/common/Loader';
import { showMessage } from 'react-native-flash-message';
import { CommonStyles } from '../../styles/GlobalStyle';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common';
import { useTheme } from '../../hooks/useTheme';
import { SafeAreaView } from 'react-native-safe-area-context';

export const CustomerDetail: React.FC = () => {
  const { theme } = useTheme();
  const route = useRoute<any>();
  const { CustomerCode } = route.params;

  const [customerDetails, setCustomerDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCustomerDetails();
  }, []);

  const getCustomerDetails = async () => {
    try {
      setLoading(true);
      const response = await API_Config.getCustomerDetails({
        docEntry: CustomerCode,
      });
      if (response?.success) {
        setCustomerDetails(response.data.data[0]);
        console.log('customer detail is: ', response.data.data[0]);
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

  const renderItem = ({ item }: { item: any }) => (
    <View style={[{ backgroundColor: theme.colors.surface }, styles.item]}>
      <Text
        style={[
          styles.title,
          {
            color: theme.colors.secondaryDark,
            fontFamily: fonts.bold,
            // fontSize: AppSizes.Font_20,
            marginVertical: AppSizes.Margin_Vertical_10,
          },
        ]}
      >
        {item?.customerName || 'N/A'}
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
          Customer Code :
        </Text>
        <Text
          style={[
            styles.subtitle,
            {
              color: theme.colors.black,
              fontWeight: 'bold',
              //backgroundColor: theme.colors.white,
              padding: AppSizes.Padding_Horizontal_5,
              borderRadius: AppSizes.Radius_15,
            },
          ]}
        >
          {item?.customerCode || 'N/A'}
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
          Invoice No :
        </Text>
        <Text
          style={[
            styles.subtitle,
            {
              color: theme.colors.black,
              fontWeight: 'bold',
              //backgroundColor: 'rgba(109, 207, 18, 0.12)',
              padding: AppSizes.Padding_Horizontal_5,
              borderRadius: AppSizes.Radius_15,
            },
          ]}
        >
          {item?.invoiceNo || 'N/A'}
        </Text>
      </View>
      
       {/* <View
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
          Married :
        </Text>
        <Text
          style={[
            styles.subtitle,
            {
              color: theme.colors.black,
              fontWeight: 'bold',
              //backgroundColor: 'rgba(109, 207, 18, 0.12)',
              padding: AppSizes.Padding_Horizontal_5,
              borderRadius: AppSizes.Radius_15,
            },
          ]}
        >
          {item?.u_Mstatus || 'N/A'}
        </Text>
      </View> */}

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
          Product :
        </Text>
        <Text
          style={[
            styles.subtitle,
            {
              color: theme.colors.black,
              fontWeight: 'bold',
              //backgroundColor: 'rgba(109, 207, 18, 0.12)',
              padding: AppSizes.Padding_Horizontal_5,
              borderRadius: AppSizes.Radius_15,
            },
          ]}
        >
          {item?.product || 'N/A'}
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
          Installment Amount :
        </Text>
        <Text
          style={[
            styles.subtitle,
            {
              color: theme.colors.black,
              fontWeight: 'bold',
              //backgroundColor: 'rgba(109, 207, 18, 0.12)',
              padding: AppSizes.Padding_Horizontal_5,
              borderRadius: AppSizes.Radius_15,
            },
          ]}
        >
          {item?.installment || 'N/A'}
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
              color: theme.colors.black,
              fontWeight: 'bold',
              //backgroundColor: 'rgba(109, 207, 18, 0.12)',
              padding: AppSizes.Padding_Horizontal_5,
              borderRadius: AppSizes.Radius_15,
            },
          ]}
        >
          {item?.due || 'N/A'}
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
          Balance :
        </Text>
        <Text
          style={[
            styles.subtitle,
            {
              color: theme.colors.black,
              fontWeight: 'bold',
              padding: AppSizes.Padding_Horizontal_5,
              borderRadius: AppSizes.Radius_15,
            },
          ]}
        >
          {item?.balance || 'N/A'}
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
          Phone No. 1 :
        </Text>
        <Text
          style={[
            styles.subtitle,
            {
              color: theme.colors.black,
              fontWeight: 'bold',
              //backgroundColor: 'rgba(109, 207, 18, 0.12)',
              padding: AppSizes.Padding_Horizontal_5,
              borderRadius: AppSizes.Radius_15,
            },
          ]}
        >
          {item?.phone || 'N/A'}
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
          Phone No. 2 :
        </Text>
        <Text
          style={[
            styles.subtitle,
            {
              color: theme.colors.black,
              fontWeight: 'bold',
              //backgroundColor: 'rgba(109, 207, 18, 0.12)',
              padding: AppSizes.Padding_Horizontal_5,
              borderRadius: AppSizes.Radius_15,
            },
          ]}
        >
          {item?.phone2 || 'N/A'}
        </Text>
      </View> 
    </View>
  );


  const downloadPDF = ({ item }: { item: any }) => (
    <View>
      <h1>Customer</h1>
      <p><strong>Name:</strong> ${item.customerName || 'N/A'}</p>
      <p><strong>Customer Code:</strong> ${item.customerCode || 'N/A'}</p>
      <p><strong>Invoice No:</strong> ${item.invoiceNo || 'N/A'}</p>
      <p><strong>Married:</strong> ${item.u_Mstatus || 'N/A'}</p>
      <p><strong>Product:</strong> ${item.product || 'N/A'}</p>
      <p><strong>Installment Amount:</strong> ${item.installment || 'N/A'}</p>
      <p><strong>Due Amount:</strong> ${item.due || 'N/A'}</p>
      <p><strong>Balance:</strong> ${item.balance || 'N/A'}</p>
      <p><strong>Phone 1:</strong> ${item.phone || 'N/A'}</p>
      <p><strong>Phone 2:</strong> ${item.phone2 || 'N/A'}</p>
    </View>
  );

  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.overlay} />
      <View style={styles.safeArea}>
        <Header
          title="Customer"
          subtitle="Customer Information"
          showBackButton
        />

        {loading ? (
          <Loader title="Loading Customer details..." />
        ) : (
          <FlatList
            data={customerDetails ? [customerDetails] : []}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.list}
            renderItem={item => renderItem(item)}
            ListEmptyComponent={
              <View style={styles.center}>
                <Text
                  style={[
                    styles.errorText,
                    {
                      color: theme.colors.black,
                    },
                  ]}
                >
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

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'white' },
  safeArea: { flex: 1, paddingBottom: 20 },
  list: { padding: 20, rowGap: AppSizes.Padding_Horizontal_20 },
  item: { borderRadius: 12, padding: 16, elevation: 5 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  label: { fontSize: AppSizes.Font_14, fontFamily: fonts.regular },
  value: { fontSize: AppSizes.Font_14, fontFamily: fonts.bold },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  errorText: {
    fontSize: 16,
    fontFamily: fonts.extraBoldItalic,
    marginBottom: 12,
  },
  subtitle: { fontSize: 14, marginTop: 4 },
  title: { fontSize: AppSizes.Font_18 },
});
