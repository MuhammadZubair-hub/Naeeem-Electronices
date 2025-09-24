import React, { use, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Button } from '../../components/common/Button';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import { Header } from '../../components/common/Header';
import { mockDataService } from '../../services/mock/mockDataService';
import { screenName } from '../../navigation/ScreenName';
import { API_Config } from '../../services/apiServices';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { fonts } from '../../assets/fonts/Fonts';
import { AppSizes } from '../../utils/AppSizes';

export const AVOsList: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { branch } = route.params;
  const zones = mockDataService.getAVOsByBranch('0');
  
  const Id = useSelector((state: RootState) => state.auth.user?.empId);

  const handleAVOPress = (avo: any) => {
    // navigation.navigate(screenName.BranchList, { zoneId: zone.id });
    navigation.navigate(screenName.CustomerList, { zoneId: avo.id });
  };
  const [avos, setAvos] = React.useState<any[]>([]);

  useEffect(() => {
    // Fetch AVOs when the component mounts
    // const AvosData = mockDataService.getAVOStaff();
    // setAvos(AvosData);
    // console.log('AVOs:', AvosData);

    console.log('id is ',Id, 'branch is is ', branch);

    getAVos();

  }, []);

  const getAVos = async ()=>{

    const response = await API_Config.getBranchesAVOs({
      ID :Id,
      BranchID : branch
    });

    if (response.success) {
      console.log(response.data.data);
      setAvos(response.data.data)
    } else {
      console.log('the error is : ', response.message);
      return
    }
    

  }

  return (
    <View>
      {/* <Header title="Branches" subtitle="Branch Manager" showBackButton /> */}
       <Header title="AVO's" subtitle="Branch Managers" showBackButton />
      <FlatList
                    data={avos}
                    keyExtractor={item => item.id}
                    ListEmptyComponent={() => {
                      <View>
                        <Text>No Item Found</Text>
                      </View>;
                    }}
                    renderItem={({ item }) => (
                      <View
                        style={[
                          { backgroundColor: theme.colors.surface },
                          styles.item,
                        ]}
                      >
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
                          {item.branchName}
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
                            Total Amount :
                          </Text>
                          <Text
                            style={[
                              styles.subtitle,
                              {
                                color: theme.colors.black,
                                fontWeight: 'bold',
                                backgroundColor: theme.colors.white,
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
                            AVO Name:
                          </Text>
                          <Text
                            style={[
                              styles.subtitle,
                              {
                                color: theme.colors.secondary,
                                fontWeight: 'bold',
                                backgroundColor: 'rgba(7, 7, 7, 0.12)',
                                padding: AppSizes.Padding_Horizontal_5,
                                borderRadius: AppSizes.Radius_15,
                              },
                            ]}
                          >
                            {item.assignedName || 'N/A'}
                          </Text>
                        </View>
      
                        <Button
                          title="View AVO"
                          //onPress={() => handleBranchPress(item)}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 20 },
  item: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  subtitle: { fontSize: 14, marginTop: 4 },
});
