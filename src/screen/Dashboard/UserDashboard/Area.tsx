
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Basescreen from '../../../Resuseable/BaseScreen'
import { Colors } from '../../../Theme/Color'
import PrimaryHeader from '../../../Resuseable/Components/Header/PrimaryHeader'
import { AppSizes } from '../../../Theme/appsizes'
import { Fonts } from '../../../Theme/Fonts'
import Icon from '../../../Resuseable/Icon'
import { scale } from '../../../Theme/resposive'
import { PerUserComponents } from './AreaOfficer'
import { zonalData } from './costant'

const Area = () => {

    return (
        <Basescreen scroable statusBarColor={Colors.secondary}>
            <PrimaryHeader headerText='All Area Verfication Manger' mainDashboard={false} />
            {zonalData.map((item) => (
                <PerUserComponents userText={item} />
            ))}
        </Basescreen>
    )
}

export default Area


const styles = StyleSheet.create({})