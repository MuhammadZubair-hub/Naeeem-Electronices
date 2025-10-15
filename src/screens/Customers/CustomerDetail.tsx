import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
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
import { Card } from '../../components/common';
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
        setCustomerDetails(response.data.data);
        console.log('customer detail is: ', response.data.data);
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
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}
      >
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Text
            style={[
              styles.title,
              {
                color: theme.colors.secondaryDark,
                fontFamily: fonts.bold,
                // fontSize: AppSizes.Font_20,
                // marginVertical: AppSizes.Margin_Vertical_10,
              },
            ]}
          >
            {item?.customerName || 'N/A'}
          </Text>
          <Text
            style={[
              // styles.title,
              {
                color: theme.colors.textSecondary,
                fontFamily: fonts.bold,
                alignSelf: 'center',
                // fontSize: AppSizes.Font_20,
                // marginVertical: AppSizes.Margin_Vertical_10,
              },
            ]}
          >
            s/o
          </Text>
          <Text
            style={[
              styles.title,
              {
                color: theme.colors.secondaryDark,
                fontFamily: fonts.bold,
                // fontSize: AppSizes.Font_20,
                // marginVertical: AppSizes.Margin_Vertical_10,
              },
            ]}
          >
            {item?.FatherName || 'Shoaib Hashim'}
          </Text>
        </View>

        <Image
          height={100}
          width={100}
          borderRadius={10}
          source={{
            uri: item.custPic
              ? `data:image/jpeg;base64,${item?.custPic}`
              : 'https://24newshd.tv/digital_images/large/2023-12-31/chahat-fateh-ali-khan-begs-for-new-laws-after-rejection-of-nomination-papers-1731428057-6778.webp',
          }}
          alt="Customer Image"
          resizeMode="cover"
        />
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
          Processing No :
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
          {item?.processingNo || 'N/A'}
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
          CNIC :
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
          Occupation :
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
          {item?.Occ || 'N/A'}
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text
            style={[
              styles.subtitle,
              {
                color: theme.colors.textSecondary,
                fontSize: AppSizes.Font_14,
                fontWeight: 'bold',
                textAlign: 'center',
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
                textAlign: 'center',
              },
            ]}
          >
            {item?.u_Mstatus || 'N/A'}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
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
            House Owner :
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
                textAlign: 'center',
              },
            ]}
          >
            {item?.u_Mstatus || 'N/A'}
          </Text>
        </View>
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
          Location Res :
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
          Location Offc :
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

      <View style={styles.separator} />

      {/* COLLAPSED STATE BUTTON */}
      {!isExpanded ? (
        <Button
          title="Customer Detail"
          textStyle={{ color: theme.colors.secondaryDark, padding: 0 }}
          onPress={() => setIsExpanded(true)}
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
      ) : (
        <View>
          <View
            style={{
              paddingHorizontal: theme.spacing.md,

              paddingVertical: 6,
              minHeight: 22,
              marginTop: 10,
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.secondaryDark,
              borderRadius: AppSizes.Radius_10,
              marginBottom: AppSizes.Margin_Vertical_10,
              borderWidth: 1,
            }}
          >
            <Text
              style={{
                alignSelf: 'center',
                color: theme.colors.secondaryDark,
                fontFamily: fonts.medium,
              }}
            >
              G1 Details
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
              Name s/o Father Name :
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
              CNIC :
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
              Occupation :
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
              {item?.Occupation || 'N/A'}
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
              Location Res :
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
              Location Offc :
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
              Phone 1 :
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
              Phone 2 :
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
          {/* // G1 ending */}
          <View
            style={{
              paddingHorizontal: theme.spacing.md,

              paddingVertical: 6,
              minHeight: 22,
              marginTop: 10,
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.secondaryDark,
              borderRadius: AppSizes.Radius_10,
              marginBottom: AppSizes.Margin_Vertical_10,
              borderWidth: 1,
            }}
          >
            <Text
              style={{
                alignSelf: 'center',
                color: theme.colors.secondaryDark,
                fontFamily: fonts.medium,
              }}
            >
              G2 Details
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
              Name s/o Father Name :
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
              CNIC :
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
              Occupation :
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
              Location Res :
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
              Location Offc :
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
              Phone 1 :
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
              Phone 2 :
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
        <Header
          title="Customer"
          subtitle="Customer Information"
          showBackButton
        />

        {loading ? (
          <Loader title="Loading Customer details..." />
        ) : (
          <FlatList
            data={customerDetails}
            keyExtractor={item => item.id}
            refreshing={loading}
            onRefresh={() => getCustomerDetails()}
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
  separator: {
    marginVertical: 12,
    // marginHorizontal: AppSizes.Gap_30,
    borderWidth: 0.5,
    borderTopColor: '#ccc',
  },
});
