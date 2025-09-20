import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../../components/common/Card';

interface SummaryData {
  label: string;
  value: number;
  format: 'currency' | 'number' | 'percentage';
  color: string;
}

interface SummaryPanelProps {
  title: string;
  data: SummaryData[];
  columns?: number;
}

export const SummaryPanel: React.FC<SummaryPanelProps> = ({
  title,
  data,
  columns = 2,
}) => {
  const { theme } = useTheme();

  const formatValue = (value: number, format: string): string => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-PK', {
          style: 'currency',
          currency: 'PKR',
          minimumFractionDigits: 0,
        }).format(value);
      case 'percentage':
        return `${value}%`;
      default:
        return new Intl.NumberFormat('en-PK').format(value);
    }
  };

  const renderSummaryItem = (item: SummaryData, index: number) => (
    <View key={index} style={[styles.summaryItem, { width: `${100 / columns}%` }]}>
      <Text style={[styles.summaryValue, { color: item.color }]}>
        {formatValue(item.value, item.format)}
      </Text>
      <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
        {item.label}
      </Text>
    </View>
  );

  return (
    <Card style={styles.container} padding="lg">
      <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
        {title}
      </Text>
      <View style={styles.summaryGrid}>
        {data.map(renderSummaryItem)}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryItem: {
    marginBottom: 16,
  },
  summaryValue: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
});
