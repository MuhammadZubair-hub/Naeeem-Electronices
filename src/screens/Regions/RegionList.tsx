import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Button } from '../../components/common/Button';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import { AppSizes } from '../../utils/AppSizes';
import { fonts } from '../../assets/fonts/Fonts';
import EmptyComponents from '../../components/common/EmptyComponents';
import { CommonStyles } from '../../styles/GlobalStyle';

interface RegionListProps {
  data: any;
}

export const RegionList: React.FC<RegionListProps> = ({ data }) => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();

  const handleRegionPress = (region: any) => {
    console.log('region nnnnn:', region);

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
            marginHorizontal: AppSizes.Padding_Horizontal_20,
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
          Regional List
        </Text>
      )}
      ListHeaderComponentStyle={{ padding: AppSizes.Padding_Vertical_10 }}
      ListEmptyComponent={() => <EmptyComponents emptyMessage='Not any Region found' />}
      keyExtractor={item => item.id}
      contentContainerStyle={CommonStyles.list}
      renderItem={({ item }) => (
        <View
          style={CommonStyles.item}
        >
          <Text
            style={[
              CommonStyles.title,
              {
                color: theme.colors.secondaryDark,

              },
            ]}
          >
            {item.region}
          </Text>

          <View
            style={CommonStyles.row}
          >
            <Text style={[  CommonStyles.subtitle,{color: theme.colors.textSecondary, }, ]}
            >
              Regional Manager :
            </Text>
            <Text
              style={[
                CommonStyles.value,
                {
                  color: theme.colors.secondaryDark,

                },
              ]}
            >
              {item.rmName || 'N/A'}
            </Text>
          </View>
          <View
            style={CommonStyles.row}
          >
            <Text
              style={[
                CommonStyles.subtitle,
                {
                  color: theme.colors.textSecondary,

                },
              ]}
            >
              Total Installments :
            </Text>
            <Text
              style={[
                CommonStyles.value,
                {
                  color: theme.colors.secondary,

                },
              ]}
            >
              {item.instTotalAmount || 'N/A'}
            </Text>
          </View>

          <View
            style={CommonStyles.row}
          >
            <Text
              style={[
                CommonStyles.subtitle,
                {
                  color: theme.colors.textSecondary,

                },
              ]}
            >
              Total Paid :
            </Text>
            <Text
              style={[
                CommonStyles.value,
                {
                  color: theme.colors.success,
                },
              ]}
            >
              {item.instRecAmount || 'N/A'}
            </Text>
          </View>

          <View
            style={CommonStyles.row}
          >
            <Text
              style={[
                CommonStyles.subtitle,
                {
                  color: theme.colors.textSecondary,

                },
              ]}
            >
              Total Due :
            </Text>
            <Text
              style={[
                CommonStyles.value,
                {
                  color: theme.colors.warning,

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
            style={CommonStyles.divider}
          ></View>
        </View>
      )}
    />
  );
};

// const styles = StyleSheet.create({
//   container: { flex: 1, paddingVertical: AppSizes.Padding_Vertical_40 },
//   //list: {rowGap:30,marginHorizontal: 20,borderRadius: theme.borderRadius.lg},
//   item: {
//     // borderRadius: 12,
//     // marginBottom: 16,
//     elevation: 14,
//     backgroundColor: 'white',
//   },
//   title: { fontSize: AppSizes.Font_20 },
//   subtitle: { fontSize: AppSizes.Font_14, flex: 1.5 },
//   subtitle2: { fontSize: AppSizes.Font_14, flex: 1.5, textAlign: 'right' },
// });
