import React from 'react';
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

export const ZoneList: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { regionId } = route.params;
  const zones = mockDataService.getZonesByRegion(regionId);

  const handleZonePress = (zone: any) => {
    navigation.navigate('BranchList', { zoneId: zone.id });
    //navigation.navigate(screenName.AVOsList, { zoneId: zone.id });
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Header title="Zones" subtitle="Zonal Managers" showBackButton />
      <FlatList
        data={zones}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View
            style={[{ backgroundColor: theme.colors.surface }, styles.item]}
          >
            <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
              {item.name}
            </Text>
            <Text
              style={[styles.subtitle, { color: theme.colors.textSecondary }]}
            >
              Manager: {item.managerName}
            </Text>
            <Button
              title="View Branches"
              onPress={() => handleZonePress(item)}
              variant="primary"
              size="md"
              style={{ marginTop: 12 }}
            />
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
