import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  ScrollView,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
const barWidth = 60;
const chartHeight = 200;

const data = [
  { week: 'Region 1', blue: 70, purple: 10 },
  { week: 'Region 2', blue: 70, purple: 40 },
  { week: 'Region 3', blue: 90, purple: 70 },
  { week: 'Region 4', blue: 40, purple: 60 },
];

const AnimatedBarChart = ({purple =true}) => {
  const maxValue = Math.max(...data.flatMap(d => [d.blue + d.purple]));
  
  // Array of refs for each animated bar
  const animatedHeights = useRef(
    data.map(() => ({
      blue: new Animated.Value(0),
      purple: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    animatedHeights.forEach((animated, index) => {
      const blueHeight = (data[index].blue / maxValue) * chartHeight;
      const purpleHeight = (data[index].purple / maxValue) * chartHeight;

      Animated.timing(animated.blue, {
        toValue: blueHeight,
        duration: 800,
        delay: index * 150,
        useNativeDriver: false,
      }).start();

      Animated.timing(animated.purple, {
        toValue: purpleHeight,
        duration: 800,
        delay: index * 150 + 100,
        useNativeDriver: false,
      }).start();
    });
  }, []);

  const yAxisLabels = [160, 140, 120, 100, 80, 60, 40, 20, 0];
  const chartWidth = data.length * (barWidth + 25) + 50; // Calculate total chart width

  const renderYAxisLabels = () => {
    return yAxisLabels.map((label, index) => {
      const topPosition = (index * chartHeight) / (yAxisLabels.length - 1);
      return (
        <View key={index} style={[styles.yAxisLabelContainer, { 
          top: topPosition - 8 
        }]}>
          <Text style={styles.yAxisLabel}>{label}</Text>
          <View style={[styles.gridLine, { width: chartWidth }]} />
        </View>
      );
    });
  };

  return (
    <ScrollView horizontal contentContainerStyle={styles.scrollContainer}>
      <View style={styles.mainContainer}>
        {/* Grid lines and Y-axis labels */}
        <View style={styles.gridContainer}>
          {renderYAxisLabels()}
        </View>

        {/* Chart bars */}
        <View style={styles.chartContainer}>
          <View style={styles.yAxisSpace} />
          <View style={styles.chart}>
            {data.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.barContainer,
                  { width: barWidth, left: index * (barWidth + 25) },
                ]}
              >
                {/* Purple Bar */}
                {purple?(
                  <Animated.View
                  style={[
                    styles.purpleBar,
                    {
                      height: animatedHeights[index].purple,
                      bottom: animatedHeights[index].blue,
                    },
                  ]}
                />
                ):(null)}
                

                {/* Blue Bar */}
                <Animated.View
                  style={[
                    styles.blueBar,
                    {
                      height: animatedHeights[index].blue,
                      bottom: 0,
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
  );
};

export default AnimatedBarChart;

const styles = StyleSheet.create({
  scrollContainer: {
    //paddingHorizontal: 20,
    
  },
  mainContainer: {
    paddingVertical: 20,
    position: 'relative',
  },
  gridContainer: {
    position: 'absolute',
    top: 20,
    //left: 0,
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
    marginRight: 10,
  },
  yAxisLabelContainer: {
    position: 'absolute',
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  yAxisLabel: {
    fontSize: 12,
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
    backgroundColor: '#4A90E2',
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
    fontSize: 12,
    color: '#555',
    marginTop: 5,
    position: 'absolute',
    bottom: -20,
    textAlign: 'center',
    width: 60,
  },
});