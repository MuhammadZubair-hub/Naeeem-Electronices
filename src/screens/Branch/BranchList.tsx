import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ImageBackground,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
  NavigationProp,
} from '@react-navigation/native';
import { RootState } from '../../redux/store';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../../components/common/Button';
import { Header } from '../../components/common/Header';
import { API_Config } from '../../services/apiServices';
import { fonts } from '../../assets/fonts/Fonts';
import { AppSizes } from '../../utils/AppSizes';
import Loader from '../../components/common/Loader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { showMessage } from 'react-native-flash-message';
import { CommonStyles } from '../../styles/GlobalStyle';

const { width } = Dimensions.get('window');

// Branch interface is now imported from mockDataService
type RootStackParamList = {
  AVOsList: { branch: string };
};

export const BranchList: React.FC = () => {
  const route = useRoute();
  const { zoneId } = route.params as { zoneId: any };
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false);

  const [branches, setBranches] = useState();
  const Id = useSelector((state: RootState) => state.auth.user?.empId);

  useEffect(() => {
    getAllBranches();
  }, []);

  const getAllBranches = async () => {
    setLoading(true);
    const response = await API_Config.getZoneBranches({ ID: Id, Zone: zoneId });

    if (response.success) {
      console.log('braches are  : ', response.data.data);
      setBranches(response.data.data);
      setLoading(false);
    } else {
      setLoading(false);
      showMessage({
        message: 'Error',
        description: response.data.message,
        type: 'danger',
        style: CommonStyles.error,
      });
      console.log('response erro', response.message);
    }
  };

  const handleBranchPress = (item: any) => {
    console.log('itme passsing is ', item);
    navigation.navigate('AVOsList', { branch: item?.branchCode });
  };

  return (
    <SafeAreaView style={styles.backgroundImage}>
      {/* Overlay for dark shade */}
      {/* <View style={styles.overlay} /> */}

      {/* Main Screen Content */}
      <View style={styles.safeArea}>
        <Header title="Branches" subtitle="Zone's Branches" showBackButton />

        {loading ? (
          <Loader title={'Loading Branches...'} />
        ) : (
          <FlatList
            data={branches}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.list}
            onRefresh={() => getAllBranches()}
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
            renderItem={({ item }) => (
              <View
                style={[{ backgroundColor: theme.colors.surface }, styles.item]}
              >
                <View
                  style={styles.row}
                >
                  <Text
                    style={[
                      styles.title,
                      {
                        color: theme.colors.secondaryDark,
                        fontFamily: fonts.bold,
                        fontSize: AppSizes.Font_20,
                      },
                    ]}
                  >
                    {item.branchName}
                  </Text>
                  <Text
                    style={[styles.subtitle, { color: theme.colors.secondary }]}
                  >
                    ( {item?.branchCode || 'N/A'})
                  </Text>
                </View>

                {/* Amounts */}
                <View style={styles.row}>
                  <Text
                    style={[
                      styles.subtitle,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    Total Outstand :
                  </Text>
                  <Text style={[styles.value, { color: theme.colors.black }]}>
                    {item.instTotalAmount || 'N/A'}
                  </Text>
                </View>

                <View style={styles.row}>
                  <Text
                    style={[
                      styles.subtitle,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    Total Paid :
                  </Text>
                  <Text style={[styles.value, { color: theme.colors.success }]}>
                    {item.instRecAmount || 'N/A'}
                  </Text>
                </View>

                <View style={styles.row}>
                  <Text
                    style={[
                      styles.subtitle,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    Total Due :
                  </Text>
                  <Text style={[styles.value, { color: theme.colors.warning }]}>
                    {item.instDueAmount || 'N/A'}
                  </Text>
                </View>

                <Button
                  title="View Branch AVO's"
                  onPress={() => handleBranchPress(item)}
                  variant="secondary"
                  size="sm"
                  style={{ marginTop: 22 }}
                />
                <View style={styles.divider} />
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

  safeArea: { flex: 1 },
  list: {
    paddingVertical: AppSizes.Padding_Vertical_20,
    rowGap: AppSizes.Gap_20,
  },
  item: {
    marginHorizontal: AppSizes.Margin_Horizontal_20,
    elevation: 14,
    backgroundColor: 'white',
    padding: 16,
    rowGap: AppSizes.Margin_Vertical_10,
    borderRadius: 12,
  },

  title: { fontSize: AppSizes.Font_20, fontFamily: fonts.semiBold },
  subtitle: { fontSize: AppSizes.Font_14, fontFamily: fonts.semiBold },

  value: {
    fontFamily: fonts.semiBold,
    fontSize: AppSizes.Font_14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center'
  },
  divider: {
    // marginVertical: 12,
    marginHorizontal: AppSizes.Gap_30,
    borderWidth: 0.5,
    borderTopColor: '#ccc',
  },
});
