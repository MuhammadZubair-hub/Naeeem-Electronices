import React, { useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, Animated, ScrollView } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { AppSizes } from '../../utils/AppSizes';
import { Card } from '../common';
import { fonts } from '../../assets/fonts/Fonts';

const chartHeight = 200;
const chartWidth = 60;
const spacing = 16;
const threshold = 20; // minimum height to display text inside

export const HorizontalStackedBarGraph = ({ data }: any) => {
  const { theme } = useTheme();

  // Compute max value for scaling
  const maxValue = useMemo(
    () => Math.max(...data.map((d: any) => d.total + d.paid + d.due), 1),
    [data],
  );

  // Animated value for each stack
  const animatedStacks = useRef(data.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const timeout = setTimeout(() => {
      data.forEach((item: any, index: number) => {
        const rawHeight =
          ((item.total + item.paid + item.due) / maxValue) * chartHeight;

        // Apply min/max height limits (5%–33%)
        const limitedHeight = Math.min(
          chartHeight * 0.99,
          Math.max(chartHeight * 0.5, rawHeight),
        );

        Animated.timing(animatedStacks[index], {
          toValue: limitedHeight,
          duration: 800,
          useNativeDriver: false,
        }).start();
      });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [data, maxValue, animatedStacks]);

  // Y-axis labels
  const yAxisLabels = useMemo(
    () => [0, 0.25, 0.5, 0.75, 1].map(v => Math.round(maxValue * v)),
    [maxValue],
  );

  return (
    <Card style={styles.card}>
      <Text style={[styles.title, { color: theme.colors.secondaryDark }]}>
        Regional Stats
      </Text>

      <View style={{ flexDirection: 'row' }}>
        {/* Fixed Y-axis */}
        <View style={styles.yAxis}>
          {[...yAxisLabels].reverse().map((label, i) => (
            <Text key={i} style={styles.yAxisLabel}>
              {label}
            </Text>
          ))}
        </View>

        {/* Scrollable chart */}
        <ScrollView showsHorizontalScrollIndicator={false} horizontal contentContainerStyle={styles.scroll}>
          {/* Grid lines */}
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {yAxisLabels.map((_, idx) => (
              <View
                key={idx}
                style={[
                  styles.gridLine,
                  {
                    top: (chartHeight / (yAxisLabels.length - 1)) * idx,
                    borderTopColor: theme.colors.border || '#e0e0e0',
                  },
                ]}
              />
            ))}
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
            {data.map((item: any, index: number) => {
              const totalProp =
                item.total / (item.total + item.paid + item.due || 1);
              const paidProp =
                item.paid / (item.total + item.paid + item.due || 1);
              const dueProp =
                item.due / (item.total + item.paid + item.due || 1);

              const totalHeight = Animated.multiply(
                animatedStacks[index],
                totalProp,
              );
              const paidHeight = Animated.multiply(
                animatedStacks[index],
                paidProp,
              );
              const dueHeight = Animated.multiply(
                animatedStacks[index],
                dueProp,
              );

              return (
                <View
                  key={index}
                  style={{ alignItems: 'center', marginRight: spacing }}
                >
                  <View
                    style={{
                      width: chartWidth,
                      height: chartHeight,
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      position: 'relative',
                    }}
                  >
                    {/* Total Segment */}
                    <Animated.View
                      style={{
                        height: totalHeight,
                        width: '100%',
                        backgroundColor: theme.colors.secondaryDark,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Animated.Text
                        style={{
                          color: 'white',
                          fontSize: 10,
                          opacity: totalHeight.interpolate({
                            inputRange: [0, threshold],
                            outputRange: [0, 1],
                          }),
                        }}
                      >
                        {item.total}
                      </Animated.Text>
                    </Animated.View>

                    {/* Always-visible fallback */}
                    {item.total > 0 && (
                      <Text
                        style={{
                          position: 'absolute',
                          top: -12,
                          fontSize: 10,
                          color: theme.colors.secondaryDark,
                        }}
                      >
                        {item.total}
                      </Text>
                    )}

                    {/* Paid Segment */}
                    <Animated.View
                      style={{
                        height: paidHeight,
                        width: '100%',
                        backgroundColor: theme.colors.success,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ fontSize: 10, color: 'white' }}>
                        {item.paid}
                      </Text>
                    </Animated.View>

                    {/* Due Segment */}
                    <Animated.View
                      style={{
                        height: dueHeight,
                        width: '100%',
                        backgroundColor: theme.colors.warning,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ fontSize: 10, color: 'white' }}>
                        {item.due}
                      </Text>
                    </Animated.View>
                  </View>

                  {/* Region Label */}
                  <Text style={styles.regionLabel}>{item.region}</Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {/* Legend */}
      <View style={styles.legendContainer}>
        {[
          { label: 'Total', color: theme.colors.secondaryDark },
          { label: 'Paid', color: theme.colors.success },
          { label: 'Due', color: theme.colors.warning },
        ].map((item, i) => (
          <View key={i} style={styles.legendItem}>
            <View style={[styles.legendBox, { backgroundColor: item.color }]} />
            <Text>{item.label}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    elevation: 12,
    margin: AppSizes.Padding_Vertical_20,
    padding: AppSizes.Padding_Vertical_20,
  },
  title: {
    fontSize: AppSizes.Font_20,
    fontFamily: fonts.bold,
    textAlign: 'center',
    marginBottom: AppSizes.Margin_Vertical_20,
  },
  yAxis: { width: 50, justifyContent: 'space-between', height: chartHeight },
  yAxisLabel: { fontSize: 12, textAlign: 'center' },
  scroll: { paddingLeft: 16, paddingRight: 16 },
  gridLine: { position: 'absolute', left: 0, width: '100%', borderTopWidth: 1 },
  regionLabel: { marginTop: 4, fontSize: 12 },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  legendBox: { width: 12, height: 12, marginRight: 4 },
});
