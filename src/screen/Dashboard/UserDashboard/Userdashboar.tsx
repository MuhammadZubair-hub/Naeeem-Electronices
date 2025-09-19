import { View, Text, TouchableOpacity, Button, Alert } from 'react-native'
import React, { useState } from 'react'
import Basescreen from '../../../Resuseable/BaseScreen'
import { Colors } from '../../../Theme/Color'
import PrimaryHeader from '../../../Resuseable/Components/Header/PrimaryHeader'
import UsersComponets from './Components/UsersComponets'
import { useNavigation } from '@react-navigation/native'
import { AppSizes } from '../../../Theme/appsizes'
import { Fonts } from '../../../Theme/Fonts'
import { BarChart } from 'react-native-chart-kit'
import { scale, screenWidth } from '../../../Theme/resposive'
import StackedBarChart from './Components/Graph'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage'


type RootStackParamList = {
  Zonal: undefined; // here undefined means that we are not passing any props to that screen
  Area: undefined;
  AreaOfficer: undefined;
};
type graphButton = {
  name: string,
};

const graphButtons: graphButton[] = [
  {
    name: 'Amount Received'
  },
  {
    name: 'Amount Due'
  }
];


const Userdashboard = () => {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [activeButton, setActiveButton] = useState<string>('Amount Received');

  const GraphButtons = () => {

    return (

      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', }}>
        {graphButtons.map((item) => {
          const isActive = item.name === activeButton;
          return (
            (
              <TouchableOpacity style={{
                minWidth: '45%',
                backgroundColor: isActive ? Colors.white : Colors.primary,
                borderColor: isActive ? Colors.secondary : Colors.primaryDark,
                borderWidth: 1.5,
                borderRadius: AppSizes.Radius_4,
                elevation: 10,

              }}
                onPress={() => setActiveButton(item.name)}
              >
                <Text
                  style={{
                    color: isActive ? Colors.secondary : Colors.primaryDark,
                    fontFamily: Fonts.Medium,
                    padding: AppSizes.Padding_Horizontal_10,
                    alignSelf: 'center'
                  }}
                >{item.name}</Text>
              </TouchableOpacity>
            )
          )
        })}
      </View>
    )

  }

  return (
    <Basescreen scroable={true} statusBarColor={Colors.secondary}  >
      <PrimaryHeader headerText='Dashboard' mainDashboard />

      {/* <StackedBarChart/> */}
      <View style={{ marginTop: 60, rowGap: AppSizes.Gap_20, marginHorizontal: 20 }}>
        <GraphButtons />
        {activeButton === 'Amount Received'?<StackedBarChart></StackedBarChart>:<StackedBarChart purple={false}/>}
      </View>

      <View style={{ flex: 1, justifyContent: 'center' }}>

        <UsersComponets userText='Zonal Manager DB' onPress={() => navigation.navigate('Zonal')} />
          
          
        
      </View>
    </Basescreen>
  )
}

export default Userdashboard;






// const data = {
//   labels: ['week 1', 'week 2', 'week 3', 'week 4'],
//   datasets: [
//     {
//       data: [650, 550, 420, 430], // Base layer (blue)
//       color: (opacity = 1) => `rgba(66, 135, 245, ${opacity})`,
//     },
//     {
//       data: [100, 900, 80, 70], // Mid layer (light purple)
//       color: (opacity = 1) => `rgba(174, 144, 255, ${opacity})`,
//     },
//     {
//       data: [50, 400, 30, 30], // Top layer (lightest purple)
//       color: (opacity = 1) => `rgba(220, 190, 255, ${opacity})`,
//     },
//   ],
// };

// const chartConfig = {
//   backgroundGradientFrom: '#fff',
//   backgroundGradientTo: '#fff',
//   decimalPlaces: 0,
//   color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//   barPercentage: 2,
//   propsForBackgroundLines: {
//     stroke: '#e3e3e3',
//   },
// };


// const DueStackedBarChart = () => {
//   return (
//     <View style={{paddingHorizontal:20}}>
//       <BarChart
//         data={data}
//         width={screenWidth - 32}
//         height={250}
//         chartConfig={chartConfig}
//         verticalLabelRotation={0}
//         showValuesOnTopOfBars={false}
//         withInnerLines={true}
//         withHorizontalLabels={true}
//         fromZero={true}
//       />
//     </View>
//   );
// };