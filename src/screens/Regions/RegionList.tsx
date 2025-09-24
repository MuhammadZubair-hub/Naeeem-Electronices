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
    // <View
    //   style={[styles.container, { backgroundColor: theme.colors.background }]}
    // >
    //   <Header title="All Regions" subtitle="Regional Managers" showBackButton />
    //   <FlatList
    //     data={regions}
    //     keyExtractor={item => item.id}
    //     renderItem={({ item }) => (
    //       <View style={[{ backgroundColor: theme.colors.surface }, styles.item]} >
    //         <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
    //           {item.name}
    //         </Text>
    //         <Text
    //           style={[styles.subtitle, { color: theme.colors.textSecondary }]}
    //         >
    //           Manager: {item.managerName}
    //         </Text>
    //         <Button
    //           title="View Zones"
    //           onPress={() => handleRegionPress(item)}
    //           variant="primary"
    //           size="md"
    //           style={{ marginTop: 12 }}
    //         />
    //       </View>
    //     )}
    //     contentContainerStyle={styles.list}
    //   />
    // </View>

    <FlatList
      data={data}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <View style={[{ backgroundColor: theme.colors.surface }, styles.item]}>
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
                  color: theme.colors.black,
                  fontWeight: 'bold',
                  backgroundColor: theme.colors.white,
                  // backgroundColor: 'rgba(7, 7, 7, 0.12)',
                  padding: AppSizes.Padding_Horizontal_5,
                  borderRadius: AppSizes.Radius_15,
                },
              ]}
            >
              {item.instTotalAmount || 'N/A'}
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
                  backgroundColor: 'rgba(109, 207, 18, 0.12)',
                  padding: AppSizes.Padding_Horizontal_5,
                  borderRadius: AppSizes.Radius_15,
                },
              ]}
            >
              {item.instRecAmount || 'N/A'}
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
                  color: theme.colors.error,
                  fontWeight: 'bold',
                  backgroundColor: 'rgba(255, 0, 0, 0.12)',
                  padding: AppSizes.Padding_Horizontal_5,
                  borderRadius: AppSizes.Radius_15,
                },
              ]}
            >
              {item.instDueAmount || 'N/A'}
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
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingVertical: AppSizes.Padding_Vertical_40 },
  list: {},
  item: {
    // borderRadius: 12,
    // marginBottom: 16,
    // elevation: 2,
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  subtitle: { fontSize: 14, marginTop: 4 },
});
