// import React, { useEffect, useRef, useMemo } from 'react';
// import { View, Text, StyleSheet, Animated, ScrollView } from 'react-native';
// import { useTheme } from '../../hooks/useTheme';
// import { AppSizes } from '../../utils/AppSizes';
// import { Card } from '../common';
// import { fonts } from '../../assets/fonts/Fonts';

// const chartHeight = 200;
// const chartWidth = 60;
// const spacing = 16;
// const threshold = 20;

// export const HorizontalStackedBarGraph = ({ data }: any) => {
//   const { theme } = useTheme();

//   // Compute max value for scaling
//   const maxValue = useMemo(
//     () => Math.max(...data.map((d: any) => d.total + d.paid + d.due), 1),
//     [data],
//   );

//   // Animated value for each stack
//   const animatedStacks = useRef(data.map(() => new Animated.Value(0))).current;

//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       data.forEach((item: any, index: number) => {
//         const rawHeight =
//           ((item.total + item.paid + item.due) / maxValue) * chartHeight;

//         // Apply min/max height limits (5%–33%)
//         const limitedHeight = Math.min(
//           chartHeight * 0.99,
//           Math.max(chartHeight * 0.5, rawHeight),
//         );

//         Animated.timing(animatedStacks[index], {
//           toValue: limitedHeight,
//           duration: 800,
//           useNativeDriver: false,
//         }).start();
//       });
//     }, 1000);

//     return () => clearTimeout(timeout);
//   }, [data, maxValue, animatedStacks]);

//   // Y-axis labels
//   const yAxisLabels = useMemo(
//     () => [0, 0.25, 0.5, 0.75, 1].map(v => Math.round(maxValue * v)),
//     [maxValue],
//   );

//   return (
//     <Card style={styles.card}>
//       <Text style={[styles.title, { color: theme.colors.secondaryDark }]}>
//         Regional Stats
//       </Text>

//       <View style={{ flexDirection: 'row' }}>
//         {/* Fixed Y-axis */}
//         <View style={styles.yAxis}>
//           {[...yAxisLabels].reverse().map((label, i) => (
//             <Text key={i} style={styles.yAxisLabel}>
//               {label}
//             </Text>
//           ))}
//         </View>

//         {/* Scrollable chart */}
//         <ScrollView showsHorizontalScrollIndicator={false} horizontal contentContainerStyle={styles.scroll}>
//           {/* Grid lines */}
//           <View style={StyleSheet.absoluteFill} pointerEvents="none">
//             {yAxisLabels.map((_, idx) => (
//               <View
//                 key={idx}
//                 style={[
//                   styles.gridLine,
//                   {
//                     top: (chartHeight / (yAxisLabels.length - 1)) * idx,
//                     borderTopColor: theme.colors.border || '#e0e0e0',
//                   },
//                 ]}
//               />
//             ))}
//           </View>

//           <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
//             {data.map((item: any, index: number) => {
//               const totalProp =
//                 item.total / (item.total + item.paid + item.due || 1);
//               const paidProp =
//                 item.paid / (item.total + item.paid + item.due || 1);
//               const dueProp =
//                 item.due / (item.total + item.paid + item.due || 1);

//               const totalHeight = Animated.multiply(
//                 animatedStacks[index],
//                 totalProp,
//               );
//               const paidHeight = Animated.multiply(
//                 animatedStacks[index],
//                 paidProp,
//               );
//               const dueHeight = Animated.multiply(
//                 animatedStacks[index],
//                 dueProp,
//               );

//               return (
//                 <View
//                   key={index}
//                   style={{ alignItems: 'center', marginRight: spacing }}
//                 >
//                   <View
//                     style={{
//                       width: chartWidth,
//                       height: chartHeight,
//                       justifyContent: 'flex-end',
//                       alignItems: 'center',
//                       position: 'relative',
//                     }}
//                   >

//                     <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width:'100%' }}>


//                       <Animated.View
//                         style={{

//                           height: totalHeight,
//                           width: '30%',
//                           backgroundColor: theme.colors.secondaryDark,
//                           justifyContent: 'center',
//                           alignItems: 'center',

//                         }}
//                       >
//                         <Animated.Text
//                           style={{
//                             color: 'white',
//                             fontSize: 10,
//                             opacity: totalHeight.interpolate({
//                               inputRange: [0, threshold],
//                               outputRange: [0, 1],
//                             }),
//                           }}
//                         >
//                           {item.total}
//                         </Animated.Text>
//                       </Animated.View>

//                       {/* Always-visible fallback */}
//                       {/* {item.total > 0 && (
//                         <Text
//                           style={{
//                             position: 'absolute',
//                             top: -12,
//                             fontSize: 10,
//                             color: theme.colors.secondaryDark,
//                           }}
//                         >
//                           {item.total}
//                         </Text>
//                       )} */}

//                       {/* Paid Segment */}
//                       <Animated.View
//                         style={{
//                           height: paidHeight,
//                           width: '30%',
//                           backgroundColor: theme.colors.success,
//                           justifyContent: 'center',
//                           alignItems: 'center',
//                         }}
//                       >
//                         <Text style={{ fontSize: 10, color: 'white' }}>
//                           {item.paid}
//                         </Text>
//                       </Animated.View>

//                       {/* Due Segment */}
//                       <Animated.View
//                         style={{
//                           minHeight: 20,
//                           height: dueHeight,
//                           width: '30%',
//                           backgroundColor: theme.colors.warning,
//                           justifyContent: 'center',
//                           alignItems: 'center',

//                         }}
//                       >
//                         <Text style={{

//                           fontSize: 10, color: 'white'
//                         }}>
//                           {item.due}
//                         </Text>
//                       </Animated.View>

//                     </View>

//                     {/* Total Segment */}

//                   </View>





//                   {/* Region Label */}
//                   <Text style={styles.regionLabel}>{item.region}</Text>
//                 </View>
//               );
//             })}
//           </View>
//         </ScrollView>
//       </View>

//       {/* Legend */}
//       <View style={styles.legendContainer}>
//         {[
//           { label: 'Total', color: theme.colors.secondaryDark },
//           { label: 'Paid', color: theme.colors.success },
//           { label: 'Due', color: theme.colors.warning },
//         ].map((item, i) => (
//           <View key={i} style={styles.legendItem}>
//             <View style={[styles.legendBox, { backgroundColor: item.color }]} />
//             <Text>{item.label}</Text>
//           </View>
//         ))}
//       </View>
//     </Card>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     elevation: 12,
//     margin: AppSizes.Padding_Vertical_20,
//     padding: AppSizes.Padding_Vertical_20,
//   },
//   title: {
//     fontSize: AppSizes.Font_20,
//     fontFamily: fonts.bold,
//     textAlign: 'center',
//     marginBottom: AppSizes.Margin_Vertical_20,
//   },
//   yAxis: { width: 50, justifyContent: 'space-between', height: chartHeight },
//   yAxisLabel: { fontSize: 12, textAlign: 'center' },
//   scroll: { paddingLeft: 16, paddingRight: 16 },
//   gridLine: { position: 'absolute', left: 0, width: '100%', borderTopWidth: 1 },
//   regionLabel: { marginTop: 4, fontSize: 12 },
//   legendContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginTop: 12,
//   },
//   legendItem: { flexDirection: 'row', alignItems: 'center' },
//   legendBox: { width: 12, height: 12, marginRight: 4 },
// });






import React, { useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, Animated, ScrollView } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { AppSizes } from '../../utils/AppSizes';
import { Card } from '../common';
import { fonts } from '../../assets/fonts/Fonts';

const chartHeight = 200;
const barWidth = 40;
const groupSpacing = AppSizes.Gap_10;
const barSpacing = 4;
const threshold = 20;

export const HorizontalStackedBarGraph = ({ data ,title}: any ) => {
  const { theme } = useTheme();

  

  console.log('data reviving in the grap is :',data);

  const maxValue = useMemo(
    () => Math.max(...data.map((d: any) => Math.max(d.total, d.paid, d.due)), 1),
    [data],
  );

  // Animated values for each region’s three bars
  const animatedTotals = useRef(data.map(() => new Animated.Value(0))).current;
  const animatedPaid = useRef(data.map(() => new Animated.Value(0))).current;
  const animatedDue = useRef(data.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const timeout = setTimeout(() => {
      data.forEach((item: any, index: number) => {
        const totalHeight = (item.total / maxValue) * chartHeight;
        const paidHeight = (item.paid / maxValue) * chartHeight;
        const dueHeight = (item.due / maxValue) * chartHeight;

        // Sequential animation: Total → Paid → Due
        Animated.sequence([
          Animated.timing(animatedTotals[index], {
            toValue: totalHeight,
            duration: 700,
            useNativeDriver: false,
          }),
          Animated.timing(animatedPaid[index], {
            toValue: paidHeight,
            duration: 700,
            useNativeDriver: false,
          }),
          Animated.timing(animatedDue[index], {
            toValue: dueHeight,
            duration: 700,
            useNativeDriver: false,
          }),
        ]).start();
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, [data, maxValue]);

  // Y-axis labels
  const yAxisLabels = useMemo(
    () => [0, 0.25, 0.5, 0.75, 1].map(v => Math.round(maxValue * v)),
    [maxValue],
  );

  return (
    <Card style={styles.card}>
      <Text style={[styles.title, { color: theme.colors.secondaryDark }]}>
        {title}
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
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal
          contentContainerStyle={styles.scroll}
        >
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

          {/* Bars per region */}
          <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
            {data.map((item: any, index: number) => (
              <View
                key={index}
                style={{
                  alignItems: 'center',
                  marginRight: groupSpacing,
                }}
              >
                {/* 3 Bars side by side */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    height: chartHeight,
                  }}
                >
                  {/* Total */}
                  <Animated.View
                    style={{
                      borderTopLeftRadius: 8,
                      borderTopRightRadius: 8,
                      minHeight: AppSizes.Gap_20,
                      height: animatedTotals[index],
                      width: barWidth,
                      backgroundColor: theme.colors.secondaryDark,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginHorizontal: barSpacing / 2,
                    }}
                  >
                    <Text style={{ color: 'white', fontSize: 10 }}>
                      {item.total}
                    </Text>
                  </Animated.View>

                  {/* Paid */}
                  <Animated.View
                    style={{
                      borderTopLeftRadius: 8,
                      borderTopRightRadius: 8,
                      minHeight: AppSizes.Gap_20,
                      height: animatedPaid[index],
                      width: barWidth,
                      backgroundColor: theme.colors.success,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginHorizontal: barSpacing / 2,
                    }}
                  >
                    <Text style={{ color: 'white', fontSize: 10 }}>
                      {item.paid}
                    </Text>
                  </Animated.View>

                  {/* Due */}
                  <Animated.View
                    style={{
                      borderTopLeftRadius: 8,
                      borderTopRightRadius: 8,
                      minHeight: AppSizes.Gap_20,
                      height: animatedDue[index],
                      width: barWidth,
                      backgroundColor: theme.colors.warning,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginHorizontal: barSpacing / 2,
                    }}
                  >
                    <Text style={{ color: 'white', fontSize: 10 }}>
                      {item.due}
                    </Text>
                  </Animated.View>
                </View>

                {/* X-axis label */}
                <Text style={styles.regionLabel}>{item.region}</Text>
              </View>
            ))}
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
            <Text style={styles.regionLabel}>{item.label}</Text>
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
  regionLabel: {
    marginTop: 4,
    fontSize: AppSizes.Font_12,
    fontFamily: fonts.medium,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  legendBox: { width: 12, height: 12, marginRight: 4, borderRadius: 3 },
  cardtitle: {
    alignItems: 'center',
    padding: AppSizes.Padding_Vertical_10,
    borderRadius: AppSizes.Radius_8,
    paddingHorizontal: AppSizes.Padding_Horizontal_20,
    rowGap: AppSizes.Gap_10,
  },
  cardSubtitle: {
    fontSize: AppSizes.Font_16,
    fontWeight: 'bold',
    color: 'white',
  },
});





