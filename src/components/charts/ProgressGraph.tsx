import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { ProgressChart } from 'react-native-chart-kit';
import { useTheme } from '../../hooks/useTheme';

const { width } = Dimensions.get('window');

interface DataPoint {
  x: string;
  y: number; // value as fraction 0 to 1
}

interface ProgressGraphProps {
  title: string;
  data: DataPoint[];
  colors?: string[];
  height?: number;
  showLabels?: boolean;
}

export const ProgressGraph: React.FC<ProgressGraphProps> = ({
  title,
  data,
  colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
  height = 220,
  showLabels = true,
}) => {
  const { theme } = useTheme();

  // Convert data to chart format (values between 0 and 1)
  const chartData = data.map(item => item.y);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{title}</Text>
      <View style={styles.chartContainer}>
        <ProgressChart
          data={{ data: chartData }}
          width={width - 40}
          height={height}
          strokeWidth={16}
          radius={60}
          chartConfig={{
            backgroundColor: theme.colors.surface,
            backgroundGradientFrom: theme.colors.surface,
            backgroundGradientTo: theme.colors.surface,
            color: (opacity = 1, index = 0) => colors[index % colors.length],
            strokeWidth: 16,
            decimalPlaces: 0,
            labelColor: (opacity = 1) => theme.colors.textSecondary,
          }}
          hideLegend={!showLabels}
        />
      </View>

      {showLabels && (
        <View style={styles.legend}>
          {data.map((item, index) => (
            <View key={item.x} style={styles.legendItem}>
              <View
                style={[styles.legendColor, { backgroundColor: colors[index % colors.length] }]}
              />
              <Text style={[styles.legendText, { color: theme.colors.textSecondary }]}>
                {item.x}: {(item.y * 100).toFixed(0)}%
              </Text>
            </View>
          ))}
        </View>
      )}
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
  chartContainer: {
    alignItems: 'center',
  },
  legend: {
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
});
