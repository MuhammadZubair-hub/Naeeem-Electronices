import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useTheme } from '../../hooks/useTheme';
import { AppSizes } from '../../utils/AppSizes';

const { width } = Dimensions.get('window');

interface DataPoint {
  x: string | number;
  y: number;
}

interface PieGraphProps {
  title: string;
  color?: string;
  height?: number;
  showGrid?: boolean;
  paidCount: string;
  dueCount: string;
}

export const PieGraph: React.FC<PieGraphProps> = ({
  title,
  paidCount,
  dueCount,
  color = '#3B82F6',
  height = 200,
  showGrid = true,
}) => {
  const { theme } = useTheme();

  const chartConfig = {
    backgroundGradientFrom: '#1E2923',
    backgroundGradientTo: '#08130D',
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2,
  };

  const paid = parseFloat(paidCount);
  const due = parseFloat(dueCount);

  const safePaid = isNaN(paid) ? 0 : paid;
  const safeDue = isNaN(due) ? 0 : due;

  const total = safePaid + safeDue;

  const data = [
    {
      name: 'Paid',
      population: safePaid,
      color: 'rgba(80, 192, 115, 1)',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Due',
      population: safeDue,
      color: 'rgba(217, 79, 33, 1)',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Text
        style={[
          styles.title,
          { color: theme.colors.secondary, fontSize: AppSizes.Font_20 },
        ]}
      >
        {title}
      </Text>
      <View style={styles.chartContainer}>
        <PieChart
          data={data}
          width={width - 40}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="100"
          hasLegend={false}
        />
      </View>

      <View style={{ paddingHorizontal: AppSizes.Padding_Horizontal_20 }}>
        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            Paid:
          </Text>
          <Text style={[styles.title, { color: theme.colors.success }]}>
            {paidCount}
          </Text>
        </View>
        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            Due:
          </Text>
          <Text style={[styles.title, { color: theme.colors.error }]}>
            {dueCount}
          </Text>
        </View>
        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            Total:
          </Text>
          <Text style={[styles.title, { color: theme.colors.black }]}>
            {total}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: AppSizes.Margin_Horizontal_20,
    marginVertical: AppSizes.Margin_Vertical_20,
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
