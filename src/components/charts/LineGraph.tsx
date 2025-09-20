import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from '../../hooks/useTheme';

const { width } = Dimensions.get('window');

interface DataPoint {
  x: string | number;
  y: number;
}

interface LineGraphProps {
  title: string;
  data: DataPoint[];
  color?: string;
  height?: number;
  showGrid?: boolean;
}

export const LineGraph: React.FC<LineGraphProps> = ({
  title,
  data,
  color = '#3B82F6',
  height = 200,
  showGrid = true,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
        {title}
      </Text>
      <View style={styles.chartContainer}>
        <LineChart
          data={{
            labels: data.map(point => point.x.toString()),
            datasets: [
              {
                data: data.map(point => point.y),
                color: (opacity = 1) =>
                  `${color}${Math.floor(opacity * 255).toString(16)}`, // dynamic color
                strokeWidth: 2,
              },
            ],
          }}
          width={width - 40}
          height={height}
          withDots={true}
          withShadow={false}
          withInnerLines={showGrid}
          withOuterLines={showGrid}
          chartConfig={{
            backgroundColor: theme.colors.surface,
            backgroundGradientFrom: theme.colors.surface,
            backgroundGradientTo: theme.colors.surface,
            decimalPlaces: 2,
            color: (opacity = 1) => color,
            labelColor: (opacity = 1) => theme.colors.textSecondary,
            style: { borderRadius: 16 },
            propsForDots: {
              r: '5',
              strokeWidth: '2',
              stroke: theme.colors.primary,
            },
          }}
          bezier
        />
      </View>
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
});
