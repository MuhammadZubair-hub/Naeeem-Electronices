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

export const AVOsList: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { regionId } = route.params;
  const zones = mockDataService.getAVOsByBranch('0');

  const handleZonePress = (zone: any) => {
    // navigation.navigate(screenName.BranchList, { zoneId: zone.id });
    navigation.navigate(screenName.CustomerList, { zoneId: zone.id });
  };
  const [avos, setAvos] = React.useState<any[]>([]);

  useEffect(() => {
    // Fetch AVOs when the component mounts
    const AvosData = mockDataService.getAVOStaff();
    setAvos(AvosData);
    console.log('AVOs:', AvosData);
  }, []);

  return (
    <View>
      {/* <Header title="Branches" subtitle="Branch Manager" showBackButton /> */}
      <FlatList
        data={avos}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View>
            <View
              style={{
                marginVertical: 12,

                borderWidth: 1,
                borderTopColor: theme.colors.secondary,
              }}
            ></View>
            <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
              {item.name}
            </Text>
            <Text
              style={[styles.subtitle, { color: theme.colors.textSecondary }]}
            >
              Role: {item.branchId}
            </Text>
            <Button
              title="View Branches"
              onPress={() => handleZonePress(item)}
              variant="primary"
              size="md"
              style={{ marginTop: 12 }}
            />
            <View
              style={{
                marginTop: 12,
              }}
            ></View>
          </View>
        )}
        // contentContainerStyle={styles.list}
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
