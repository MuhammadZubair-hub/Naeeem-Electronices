import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  ScrollView,
} from 'react-native';
import { AppSizes } from '../../utils/AppSizes';
import { Card } from '../common/Card';
import { useTheme } from '../../hooks/useTheme';
import { fonts } from '../../assets/fonts/Fonts';

const barWidth = 60;
const chartHeight = 200;

export const BarGraph = ({ purple = true, data, total, paid, due }) => {
  const { theme } = useTheme();
  const maxValue = Math.max(...data.flatMap(d => [d.blue]));
  console.log(data, 'maxAmount');
  // Array of refs for each animated bar
  const animatedHeights = useRef(
    data.map(() => ({
      blue: new Animated.Value(0),
      purple: new Animated.Value(0),
    })),
  ).current;

  useEffect(() => {
    animatedHeights.forEach((animated, index) => {
      const blueHeight = (data[index].blue / maxValue) * chartHeight;

      Animated.timing(animated.blue, {
        toValue: blueHeight,
        duration: 800,
        delay: index * 150,
        useNativeDriver: false,
      }).start();
    });
  }, []);
  const maxAmount = Math.max(...data.map(item => item.blue));

  const yAxisLabels = [
    maxAmount,
    parseInt(maxAmount / 2),
    parseInt(maxAmount / 3),
    parseInt(maxAmount / 4),
    0,
  ];
  const chartWidth = data.length * (barWidth + 25) + 50; // Calculate total chart width

  const renderYAxisLabels = () => {
    return yAxisLabels.map((label, index) => {
      const topPosition = (index * chartHeight) / (yAxisLabels.length - 1);
      return (
        <View
          key={index}
          style={[
            styles.yAxisLabelContainer,
            {
              top: topPosition - 0,
            },
          ]}
        >
          <Text style={styles.yAxisLabel}>{label}</Text>
          <View style={[styles.gridLine, { width: chartWidth }]} />
        </View>
      );
    });
  };

  return (
    <Card
      style={{
        margin: AppSizes.Padding_Vertical_20,
        elevation: 12,
        backgroundColor: theme.colors.surface,
        padding: AppSizes.Padding_Vertical_20,
        borderRadius: theme.borderRadius.lg,
      }}
    >
      <Text
        style={{
          fontSize: AppSizes.Font_20,
          color: theme.colors.secondary,
          fontFamily: fonts.bold,
          textAlign: 'center',
        }}
      >
        Regional Stats
      </Text>
      <ScrollView horizontal contentContainerStyle={styles.scrollContainer}>
        <View style={styles.mainContainer}>
          {/* Grid lines and Y-axis labels */}
          <View style={styles.gridContainer}>{renderYAxisLabels()}</View>

          {/* Chart bars */}
          <View style={styles.chartContainer}>
            <View style={styles.yAxisSpace} />
            <View style={styles.chart}>
              {data.map((item, index) => (
                <View
                  key={index}
                  style={[
                    styles.barContainer,
                    { width: barWidth, left: index * (barWidth + 20) },
                  ]}
                >
                  {/* Blue Bar */}
                  <Animated.View
                    style={[
                      styles.blueBar,
                      {
                        height: animatedHeights[index].blue,
                        bottom: 0,
                        backgroundColor: item.color,
                      },
                    ]}
                  />

                  {/* Week Label */}
                  <Text style={styles.xAxisLabel}>{item.week}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View
        style={{
          marginTop: AppSizes.Margin_Vertical_10,
        }}
      >
        <View
          style={[
            {
              backgroundColor: theme.colors.surface,
              borderRadius: theme.borderRadius.lg,

              justifyContent: 'space-between',
              flexDirection: 'row',
            },
            styles.item,
          ]}
        >
          <Text
            style={[
              styles.title,
              {
                color: theme.colors.secondaryDark,
                fontFamily: fonts.extraBoldItalic,
                fontSize: AppSizes.Font_14,
              },
            ]}
          >
            Total Outstand
          </Text>

          <Text
            style={[
              styles.title,
              {
                color: theme.colors.secondaryDark,
                fontFamily: fonts.extraBoldItalic,
                fontSize: AppSizes.Font_14,
              },
            ]}
          >
            {total}
          </Text>
        </View>

        <View
          style={[
            {
              backgroundColor: theme.colors.surface,
              borderRadius: theme.borderRadius.lg,

              justifyContent: 'space-between',
              flexDirection: 'row',
            },
            styles.item,
          ]}
        >
          <Text
            style={[
              styles.title,
              {
                color: theme.colors.textSecondary,
                fontFamily: fonts.extraBoldItalic,
                fontSize: AppSizes.Font_14,
              },
            ]}
          >
            Total Paid
          </Text>

          <Text
            style={[
              styles.title,
              {
                color: theme.colors.success,
                fontFamily: fonts.extraBoldItalic,
                fontSize: AppSizes.Font_14,
              },
            ]}
          >
            {paid}
          </Text>
        </View>

        <View
          style={[
            {
              backgroundColor: theme.colors.surface,
              borderRadius: theme.borderRadius.lg,

              justifyContent: 'space-between',
              flexDirection: 'row',
            },
            styles.item,
          ]}
        >
          <Text
            style={[
              styles.title,
              {
                color: theme.colors.textSecondary,
                fontFamily: fonts.extraBoldItalic,
                fontSize: AppSizes.Font_14,
              },
            ]}
          >
            Total Due
          </Text>

          <Text
            style={[
              styles.title,
              {
                color: theme.colors.warning,
                fontFamily: fonts.extraBoldItalic,
                fontSize: AppSizes.Font_14,
              },
            ]}
          >
            {due}
          </Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: AppSizes.Padding_Horizontal_20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mainContainer: {
    paddingVertical: AppSizes.Padding_Vertical_25,
    position: 'relative',
  },

  item: {},
  title: { fontSize: 18, fontWeight: 'bold' },
  gridContainer: {
    position: 'absolute',
    top: 20,

    height: chartHeight,
    width: '100%',
    zIndex: 1, // Behind the bars
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    zIndex: 2, // Above the grid lines
  },
  yAxisSpace: {
    width: 50,
  },
  yAxisLabelContainer: {
    position: 'absolute',
    left: -AppSizes.Padding_Horizontal_20,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  yAxisLabel: {
    fontSize: 10,
    color: '#999',
    width: 40,
    textAlign: 'center',
  },
  gridLine: {
    height: 1,
    backgroundColor: '#e5e5e5',
    marginLeft: 0,
  },
  chart: {
    height: chartHeight,
    position: 'relative',
  },
  barContainer: {
    position: 'absolute',
    alignItems: 'center',
    bottom: 0,
  },
  blueBar: {
    width: barWidth,
    position: 'absolute',
    borderRadius: 2,
  },
  purpleBar: {
    width: barWidth,
    backgroundColor: '#D8BFFF',
    position: 'absolute',
    borderRadius: 2,
  },
  xAxisLabel: {
    paddingHorizontal: 5,
    fontSize: 12,
    color: '#555',
    marginTop: 5,
    position: 'absolute',
    textAlign: 'center',
    width: 100,
  },
});
