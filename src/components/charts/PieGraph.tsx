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
}

export const PieGraph: React.FC<PieGraphProps> = ({
  title,
  color = '#3B82F6',
  height = 200,
  showGrid = true,
}) => {
  const { theme } = useTheme();

  const chartConfig = {
    backgroundGradientFrom: '#1E2923',
    backgroundGradientTo: '#08130D',
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
  };

  const data = [
    // {
    //   name: 'Total',
    //   population: 100,
    //   color: 'rgba(131, 167, 234, 1)',
    //   legendFontColor: '#7F7F7F',
    //   legendFontSize: 15,
    // },
    {
      name: 'Paid',
      population: 65,
      color: 'rgba(80, 192, 115, 1)',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },

    {
      name: 'Due',
      population: 35,
      color: 'rgba(217, 79, 33, 1)',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
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
          paddingLeft="15"
          absolute
        />
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
    alignItems: 'center',
  },
});
