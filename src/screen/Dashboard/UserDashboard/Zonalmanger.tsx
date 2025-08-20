import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Basescreen from '../../../Resuseable/BaseScreen'
import { Colors } from '../../../Theme/Color'
import PrimaryHeader from '../../../Resuseable/Components/Header/PrimaryHeader'
import { PerUserComponents } from './AreaOfficer'
import { zonalData } from './costant'
import { zonalmangerData } from './constant2'
import { AppSizes } from '../../../Theme/appsizes'

const Zonalmanger = () => {


    

    return (
        <Basescreen scroable statusBarColor={Colors.secondary}>
            <PrimaryHeader headerText='All Zonal Manger' mainDashboard={false} />
            <View style={{marginTop:AppSizes.Margin_Horizontal_10}}></View>
            {zonalmangerData.map((item) => (
                <PerUserComponents mangers={item}  />
            ))}
        </Basescreen>
    )
}

export default Zonalmanger


const styles = StyleSheet.create({})