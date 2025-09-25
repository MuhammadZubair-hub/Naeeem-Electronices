import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Button } from '../../components/common/Button';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import { Header } from '../../components/common/Header';
import { mockDataService } from '../../services/mock/mockDataService';
import { AppSizes } from '../../utils/AppSizes';
import { fonts } from '../../assets/fonts/Fonts';

export const RegionList: React.FC = ({ data }) => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();

  const handleRegionPress = (region: any) => {
    console.log('region :', region);

    navigation.navigate('ZoneList', { data: region });
  };

  return (
   

    <FlatList
      data={data}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <View style={[{ backgroundColor: theme.colors.surface,borderRadius: theme.borderRadius.lg,padding:5  }, styles.item]}>
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
            {item.region}
          </Text>

          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
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
              Total Amount :
            </Text>
            <Text
              style={[
                styles.subtitle,
                {
                  color: theme.colors.white,
                  fontWeight: 'bold',
                 // backgroundColor: theme.colors.white,
                  // backgroundColor: 'rgba(7, 7, 7, 0.12)',
                  padding: AppSizes.Padding_Horizontal_5,
                  borderRadius: AppSizes.Radius_15,
                },
              ]}
            >
              {parseFloat(item.instTotalAmount).toFixed(2)|| 'N/A'}
            </Text>
          </View>

          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
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
              Paid Amount :
            </Text>
            <Text
              style={[
                styles.subtitle,
                {
                  color: theme.colors.success,
                  fontWeight: 'bold',
                  //backgroundColor: 'rgba(109, 207, 18, 0.12)',
                   paddingHorizontal: AppSizes.Padding_Horizontal_5,
                  borderRadius: AppSizes.Radius_15,
                },
              ]}
            >
              {parseFloat(item.instRecAmount).toFixed(2) || 'N/A'}
            </Text>
          </View>

          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
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
                  color: theme.colors.warning,
                  fontWeight: 'bold',
                  //backgroundColor: 'rgba(255, 238, 0, 0.12)',
                  paddingHorizontal: AppSizes.Padding_Horizontal_5,
                  borderRadius: AppSizes.Radius_15,
                },
              ]}
            >
              {parseFloat(item.instDueAmount).toFixed(2)|| 'N/A'}
            </Text>
          </View>

          <Button
            title="View Zones"
            onPress={() => handleRegionPress(item.region)}
            variant="secondary"
            size="sm"
            style={{ marginTop: 22 }}
          />
          <View
            style={{
              marginVertical: 12,
              marginTop: AppSizes.Margin_Vertical_20,
              borderWidth: 0.5,
              borderTopColor: theme.colors.secondary,
            }}
          ></View>
        </View>
      )}
      contentContainerStyle={{rowGap:30,marginHorizontal: 20,borderRadius: theme.borderRadius.lg ,}}
    />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingVertical: AppSizes.Padding_Vertical_40 },
  //list: {rowGap:30,marginHorizontal: 20,borderRadius: theme.borderRadius.lg},
  item: {
    // borderRadius: 12,
    // marginBottom: 16,
   elevation: 2,
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  subtitle: { fontSize: 14, marginTop: 4 },
});
