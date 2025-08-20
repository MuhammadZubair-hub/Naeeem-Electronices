import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import { useNavigation } from '@react-navigation/native'
import { AppSizes } from '../../../Theme/appsizes';
import { Colors } from '../../../Theme/Color';
import { screenHeight, xdHeight } from '../../../Theme/resposive';
import Icon from '../../Icon';
import { Fonts } from '../../../Theme/Fonts';


interface PrimaryHeaderProps {
  headerText: string,
  iconsize?: number,
  profile?: boolean,
  onBellPress?: any,
  mainDashboard?: boolean,

  // headerColor :string,
  // headerHeight?:any,

}


const PrimaryHeader = (
  {
    headerText,
    iconsize = AppSizes.Icon_Height,
    profile = false,
    onBellPress,
    mainDashboard = false,


  }: PrimaryHeaderProps
) => {

  const navigation = useNavigation();


  return(
       <View style={[styles.headerMaincontainer, { backgroundColor: Colors.secondary }]}>


        {mainDashboard ? (
          <Icon type='Ionicons' name='log-out-outline' size={AppSizes.Icon_Height_30}  color={Colors.white} onPress={() => navigation.goBack()} />
        ) : (
          <Icon type='Ionicons' name='arrow-back-outline' size={AppSizes.Icon_Height_30}  color={Colors.white}  onPress={()=>navigation.goBack()} />
        )}


        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: AppSizes.Padding_Horizontal_10 }}>
          <Text
            numberOfLines={2}
            style={{
              color:Colors.white,
              fontFamily: Fonts.Bold,
              fontSize:AppSizes.Font_20,
              fontWeight: '600',
              textAlign: 'center',
            }}
          >
            {headerText}
          </Text>
        </View>

        {/* Right Container */}
        {mainDashboard ?(<View style={styles.headerRightcontainer}>
          <Icon type='Ionicons' name={"settings-outline"} size={AppSizes.Icon_Height_30} color={'#fff'}  />
        </View>):(
          <View style={[styles.headerRightcontainer]}>         
          
        </View>
        )}

      </View>
  )

}

export default PrimaryHeader

const styles = StyleSheet.create({

  headerMaincontainer: {
    // justifyContent:'space-between',
    // flexWrap:'wrap',
    alignItems: 'center',
    flexDirection: 'row',
    height: xdHeight(100),
    paddingHorizontal: AppSizes.Padding_Horizontal_20,
    overflow: 'visible',
    borderBottomLeftRadius : AppSizes.Radius_30,
    borderBottomRightRadius : AppSizes.Radius_30,

  },
  headerRightcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    //flex:1

    //columnGap:vs(10)
  },

 
})