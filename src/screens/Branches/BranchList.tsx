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

export const BranchList: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { zoneId } = route.params;
  const branches = mockDataService.getBranchesByZone(zoneId);

  const handleBranchPress = (branch: any) => {
    navigation.navigate('BranchDetail', { branchId: branch.id });
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Header title="Branches" subtitle="Branch List" showBackButton />
      <FlatList
        data={branches}
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
              title="View Details"
              onPress={() => handleBranchPress(item)}
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
  subtitle: { fontSize: 14, marginTop: 4, fontWeight: 'bold' },
});
