import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Button } from '../../components/common/Button';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import { AppSizes } from '../../utils/AppSizes';
import { fonts } from '../../assets/fonts/Fonts';

interface RegionListProps {
  data: any;
}

export const RegionList: React.FC<RegionListProps> = ({ data }) => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();

  const handleRegionPress = (region: any) => {
    console.log('region :', region);

    navigation.navigate('ZoneList', { data: region });
  };

  return (
    <FlatList
      data={data}
      nestedScrollEnabled
      scrollEnabled={false}
      ListHeaderComponent={() => (
        <Text
          style={{
            paddingVertical: AppSizes.Padding_Vertical_10,
            textAlign: 'center',
            borderRadius: theme.borderRadius.md,

            elevation: 12,
            shadowColor: theme.colors.secondaryDark,
            borderBottomWidth: 4,
            borderBottomColor: theme.colors.secondaryDark,
            backgroundColor: theme.colors.white,
            color: theme.colors.secondaryDark,
            fontSize: AppSizes.Font_18,
            fontFamily: fonts.extraBold,
            marginTop: AppSizes.Margin_Vertical_10,
          }}
        >
          Regions List
        </Text>
      )}
      ListHeaderComponentStyle={{ padding: AppSizes.Padding_Vertical_10 }}
      ListEmptyComponent={() => (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
          }}
        >
          <Text
            style={{
              color: theme.colors.white,
              fontFamily: fonts.extraBoldItalic,
              fontSize: AppSizes.Font_16,
            }}
          >
            No Item Found ...
          </Text>
        </View>
      )}
      keyExtractor={item => item.id}
      contentContainerStyle={{
        rowGap: AppSizes.Gap_30,
        marginHorizontal: AppSizes.Margin_Horizontal_20,
        borderRadius: theme.borderRadius.lg,
        marginBottom: AppSizes.Margin_Vertical_40,
      }}
      renderItem={({ item }) => (
        <View
          style={[
            {
              // backgroundColor: theme.colors.surface,
              borderRadius: theme.borderRadius.lg,
              // padding: AppSizes.Gap_10,
              rowGap: AppSizes.Margin_Vertical_10,
              padding: 16,
            },
            styles.item,
          ]}
        >
          <Text
            style={[
              styles.title,
              {
                color: theme.colors.secondaryDark,
                fontFamily: fonts.bold,
                fontSize: AppSizes.Font_20,
                // marginTop: AppSizes.Margin_Vertical_10,
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
                  fontFamily: fonts.semiBold,
                },
              ]}
            >
              Regional Manager :
            </Text>
            <Text
              style={[
                styles.subtitle2,
                {
                  color: theme.colors.secondaryDark,
                  fontFamily: fonts.semiBold,
                  // paddingHorizontal: AppSizes.Padding_Horizontal_5,
                  borderRadius: AppSizes.Radius_15,
                },
              ]}
            >
              {item.rmName || 'N/A'}
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
                  fontFamily: fonts.semiBold,
                },
              ]}
            >
              Total Installments :
            </Text>
            <Text
              style={[
                styles.subtitle2,
                {
                  color: theme.colors.secondary,
                  fontFamily: fonts.semiBold,
                  // paddingHorizontal: AppSizes.Padding_Horizontal_5,
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
                  fontFamily: fonts.semiBold,
                },
              ]}
            >
              Total Paid :
            </Text>
            <Text
              style={[
                styles.subtitle2,
                {
                  color: theme.colors.success,
                  fontFamily: fonts.semiBold,
                  //backgroundColor: 'rgba(109, 207, 18, 0.12)',
                  // paddingHorizontal: AppSizes.Padding_Horizontal_5,
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
                  fontFamily: fonts.semiBold,
                },
              ]}
            >
              Total Due :
            </Text>
            <Text
              style={[
                styles.subtitle2,
                {
                  color: theme.colors.warning,
                  fontFamily: fonts.semiBold,
                  //backgroundColor: 'rgba(255, 238, 0, 0.12)',
                  // paddingHorizontal: AppSizes.Padding_Horizontal_5,
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
              // marginBottom: 12,
              marginHorizontal: AppSizes.Gap_30,
              // marginTop: AppSizes.Margin_Vertical_20,
              borderWidth: 0.5,
              borderTopColor: theme.colors.secondary,
            }}
          ></View>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingVertical: AppSizes.Padding_Vertical_40 },
  //list: {rowGap:30,marginHorizontal: 20,borderRadius: theme.borderRadius.lg},
  item: {
    // borderRadius: 12,
    // marginBottom: 16,
    elevation: 14,
    backgroundColor: 'white',
  },
  title: { fontSize: AppSizes.Font_20 },
  subtitle: { fontSize: AppSizes.Font_14, flex: 1.5 },
  subtitle2: { fontSize: AppSizes.Font_14, flex: 1.5, textAlign: 'right' },
});
