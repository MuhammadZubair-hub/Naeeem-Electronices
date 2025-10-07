import React, { use, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  Alert,
} from 'react-native';
import { Button } from '../../components/common/Button';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import { Header } from '../../components/common/Header';
import { screenName } from '../../navigation/ScreenName';
import { API_Config } from '../../services/apiServices';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { fonts } from '../../assets/fonts/Fonts';
import { AppSizes } from '../../utils/AppSizes';
import Loader from '../../components/common/Loader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { showMessage } from 'react-native-flash-message';
import { CommonStyles } from '../../styles/GlobalStyle';

export const AVOsList: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { branch } = route.params;

  const Id = useSelector((state: RootState) => state.auth.user?.empId);

  const [avos, setAvos] = React.useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    console.log('id is ', Id, 'branch is is ', branch);

    getAVos();
  }, []);

  const getAVos = async () => {
    setLoading(true);
    const response = await API_Config.getBranchesAVOs({
      ID: Id,
      BranchID: branch,
    });

    if (response.success) {
      //console.log(response.data.data);
      setAvos(response.data.data);
      console.log('data is : ', response.data.data);
      setLoading(false);
    } else {
      setLoading(false);
      showMessage({
        message: 'Error',
        description: response.data.message,
        type: 'danger',
        style: CommonStyles.error,
      });

      //console.log('the error is : ', response.message);
      return;
    }
  };

  const handleAVOPress = (item: any) => {
    // navigation.navigate(screenName.BranchList, { zoneId: zone.id });
    console.log('navigating items are', item);
    if (item?.assigenedId == '') {
      showMessage({
        message: 'Error',
        description: 'Please Assign data to AVO',
        type: 'danger',
        style: CommonStyles.error,
      });
      return;
    }
    console.log('navigating to the customers list', item?.assigenedId);

    navigation.navigate(screenName.CustomerList, { AvoId: item?.assigenedId });
  };

  return (
    <SafeAreaView style={styles.backgroundImage}>
      {/* Overlay for dark shade */}
      <View style={styles.overlay} />

      {/* Main Screen Content */}
      <View style={styles.safeArea}>
        <Header title="AVO's" subtitle="Branch's AVOs" showBackButton />
        {loading ? (
          <Loader title={'Loading AVOs...'} />
        ) : (
          <FlatList
            data={avos}
            keyExtractor={item => item.id}
            onRefresh={() => getAVos()}
            refreshing={loading}
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
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <View
                style={[{ backgroundColor: theme.colors.surface }, styles.item]}
              >
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
                  {item.assignedName || 'N/A'}
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
                    Total Outstand :
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
                    {item.instTotalAmount || 'N/A'}
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
                    Total Paid :
                  </Text>
                  <Text
                    style={[
                      styles.subtitle,
                      {
                        color: theme.colors.success,
                        fontWeight: 'bold',
                        //backgroundColor: 'rgba(109, 207, 18, 0.12)',
                        padding: AppSizes.Padding_Horizontal_5,
                        borderRadius: AppSizes.Radius_15,
                      },
                    ]}
                  >
                    {item.instRecAmount || 'N/A'}
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
                    Total Due :
                  </Text>
                  <Text
                    style={[
                      styles.subtitle,
                      {
                        color: theme.colors.warning,
                        fontWeight: 'bold',
                        //backgroundColor: 'rgba(109, 207, 18, 0.12)',
                        padding: AppSizes.Padding_Horizontal_5,
                        borderRadius: AppSizes.Radius_15,
                      },
                    ]}
                  >
                    {item.instDueAmount || 'N/A'}
                  </Text>
                </View>

                <Button
                  title="View AVO"
                  onPress={() => handleAVOPress(item)}
                  variant="secondary"
                  size="sm"
                  style={{ marginTop: 22 }}
                />
                <View
                  style={{
                    marginVertical: 12,
                    marginHorizontal: AppSizes.Gap_30,
                    borderWidth: 0.5,
                    borderTopColor: '#ccc',
                  }}
                ></View>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: { flex: 1, width: '100%', height: '100%' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
  },
  safeArea: { flex: 1, paddingBottom: 20 },
  list: { padding: 20, rowGap: AppSizes.Padding_Horizontal_20 },
  item: { borderRadius: 12, padding: 16, elevation: 10 },
  title: { fontSize: AppSizes.Font_18 },
  subtitle: { fontSize: 14, marginTop: 4 },
});
