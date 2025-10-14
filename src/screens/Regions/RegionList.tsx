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
        <View>
          <Text>No Item Found</Text>
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
                fontFamily: fonts.extraBoldItalic,
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
                  fontWeight: 'bold',
                },
              ]}
            >
              Regional Manager :
            </Text>
            <Text
              style={[
                styles.subtitle,
                {
                  color: theme.colors.secondaryDark,
                  fontFamily: fonts.semiBold,
                  paddingHorizontal: AppSizes.Padding_Horizontal_5,
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
                  fontWeight: 'bold',
                },
              ]}
            >
              Total Installments :
            </Text>
            <Text
              style={[
                styles.subtitle,
                {
                  color: theme.colors.secondary,
                  fontWeight: 'bold',
                  paddingHorizontal: AppSizes.Padding_Horizontal_5,
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
              Total Paid :
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
              Total Due :
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
              marginBottom: 12,
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
  title: { fontSize: 18, fontWeight: 'bold' },
  subtitle: { fontSize: 14, marginTop: 4 },
});
