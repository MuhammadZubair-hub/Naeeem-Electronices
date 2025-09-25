import React, { useEffect } from 'react';
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

  height?: number;
  showGrid?: boolean;

  allregiondata: any;
}

export const PieGraph: React.FC<PieGraphProps> = ({
  title,
  allregiondata,
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

  useEffect(() => {
    console.log('reciving region data: ', allregiondata);

  }, [])

  // const paid = parseFloat(paidCount);
  // const due = parseFloat(dueCount);

  // const safePaid = isNaN(paid) ? 0 : paid;
  // const safeDue = isNaN(due) ? 0 : due;

  // const total = safePaid + safeDue;

  // const data = [
  //   {
  //     name: 'Paid',
  //     population: safePaid,
  //     color: 'rgba(80, 192, 115, 1)',
  //     legendFontColor: '#7F7F7F',
  //     legendFontSize: 15,
  //   },
  //   {
  //     name: 'Due',
  //     population: safeDue,
  //     color: 'rgba(201, 207, 18, 1)',
  //     legendFontColor: '#7F7F7F',
  //     legendFontSize: 15,
  //   },
  // ];

  return (
    <View style={[styles.container, {
      backgroundColor: theme.colors.surface
    }]}>
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
          data={allregiondata.map(item => ({
            name: item.regionName,
            population: parseFloat(item.regionamount),
            color: item.colors,
            legendFontColor: "#7F7F7F",
            legendFontSize: 12,
          }))}
          width={width - 40}
          height={220}
          chartConfig={chartConfig}
          accessor={"population"}
          backgroundColor="transparent"
          paddingLeft="100"
          hasLegend={false}
        />
      </View>

      <View style={styles.legendContainer}>
        {allregiondata.map((item, index) => {
          const total = allregiondata.reduce(
            (sum, obj) => sum + parseFloat(obj.regionamount || 0),
            0
          );
          const percentage = total
            ? ((parseFloat(item.regionamount) / total) * 100).toFixed(1)
            : 0;

          return (
            <View key={index} style={styles.legendItem}>
              <View
                style={[styles.colorBox, { backgroundColor: item.colors }]}
              />
              <Text style={styles.legendText}>
                {item.regionName} – {percentage}%
              </Text>
            </View>
          );
        })}
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
  legendContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
    
  },
  legendItem: {
    flexDirection: "row",
     width: "35%",
    //alignItems: 'flex-start',
    marginHorizontal: 8,
    marginVertical: 4,
  },
  colorBox: {
    width: 14,
    height: 14,
    borderRadius: 3,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: "#7F7F7F",
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
