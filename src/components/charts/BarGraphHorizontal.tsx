import React, { useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, Animated, ScrollView } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { AppSizes } from '../../utils/AppSizes';
import { Card } from '../common';
import { fonts } from '../../assets/fonts/Fonts';

const chartHeight = 200;
const chartWidth = 60;
const spacing = 16;

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
        const stackHeight =
          ((item.total + item.paid + item.due) / maxValue) * chartHeight;

        Animated.timing(animatedStacks[index], {
          toValue: stackHeight,
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
      <Text style={[styles.title, { color: theme.colors.secondary }]}>
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
        <ScrollView horizontal contentContainerStyle={styles.scroll}>
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
                item.total / (item.total + item.paid + item.due);
              const paidProp = item.paid / (item.total + item.paid + item.due);
              const dueProp = item.due / (item.total + item.paid + item.due);

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
                    }}
                  >
                    {/* Blue - Total */}
                    <Animated.View
                      style={{
                        height: Animated.multiply(
                          animatedStacks[index],
                          totalProp,
                        ),
                        width: '100%',
                        backgroundColor: theme.colors.secondaryDark,
                      }}
                    />
                    {/* Green - Paid */}
                    <Animated.View
                      style={{
                        height: Animated.multiply(
                          animatedStacks[index],
                          paidProp,
                        ),
                        width: '100%',
                        backgroundColor: theme.colors.success,
                      }}
                    />
                    {/* Yellow - Due */}
                    <Animated.View
                      style={{
                        height: Animated.multiply(
                          animatedStacks[index],
                          dueProp,
                        ),
                        width: '100%',
                        backgroundColor: theme.colors.warning,
                      }}
                    />
                  </View>
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
  yAxisLabel: { fontSize: 12, textAlign: 'right' },
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
