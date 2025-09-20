import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useTheme } from '../../hooks/useTheme';

const { width } = Dimensions.get('window');

interface DataPoint {
  label: string;
  value: number;
}

interface BarGraphProps {
  title: string;
  data: DataPoint[];
  height?: number;
}

export const BarGraph: React.FC<BarGraphProps> = ({
  title,
  data = [],
  height = 220,
}) => {
  const { theme } = useTheme();

  // Filter valid data points
  const labels: string[] = [];
  const values: number[] = [];

  data.forEach(item => {
    if (
      item &&
      typeof item.label === 'string' &&
      typeof item.value === 'number'
    ) {
      labels.push(item.label);
      values.push(item.value);
    }
  });

  if (!labels.length) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.surface }]}
      >
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          {title}
        </Text>
        <Text
          style={{ color: theme.colors.textSecondary, textAlign: 'center' }}
        >
          No data available
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
        {title}
      </Text>
      <BarChart
        data={{
          labels,
          datasets: [{ data: values }],
        }}
        width={width - 40}
        height={height}
        fromZero
        showValuesOnTopOfBars
        yAxisLabel=""
        yAxisSuffix=""
        chartConfig={{
          backgroundColor: theme.colors.surface,
          backgroundGradientFrom: theme.colors.surface,
          backgroundGradientTo: theme.colors.surface,
          decimalPlaces: 0,
          color: () => theme.colors.primary,
          labelColor: () => theme.colors.textSecondary,
          style: { borderRadius: 12 },
        }}
        style={{ borderRadius: 12, marginVertical: 8 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 12,
    textAlign: 'center',
  },
});
