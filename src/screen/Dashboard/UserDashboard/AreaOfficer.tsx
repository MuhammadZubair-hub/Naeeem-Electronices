import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Basescreen from '../../../Resuseable/BaseScreen'
import { Colors } from '../../../Theme/Color'
import PrimaryHeader from '../../../Resuseable/Components/Header/PrimaryHeader'
import { AppSizes } from '../../../Theme/appsizes'
import { Fonts } from '../../../Theme/Fonts'
import Icon from '../../../Resuseable/Icon'
import { scale } from '../../../Theme/resposive'
import { zonalData } from './costant'
import { PerUserComponentsProps } from './constant2'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

const AreaOfficer = () => {

    return (
        <Basescreen scroable statusBarColor={Colors.secondary}>
            {/* <PrimaryHeader headerText='All Area Verfication Officer' mainDashboard={false} />
            {zonalData.map((item, index) => (
                <PerUserComponents key={index} userText={item} />
            ))} */}
            <></>
        </Basescreen>
    )
}

export default AreaOfficer

export const PerUserComponents: React.FC<PerUserComponentsProps> = ({ mangers }) => {

    type StackParamList = {
        DynamicScreen : {branches :{}}
    }

    const [showDetial, setShowDetial] = useState<boolean>(false);

    const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

    return (
        <>
            <TouchableOpacity style={{
                backgroundColor: Colors.secondary,
                borderRadius: AppSizes.Radius_15,
                alignSelf: 'center',
                justifyContent: 'space-between',
                width: '95%',
                marginVertical: AppSizes.Margin_Vertical_10,
                paddingHorizontal: AppSizes.Padding_Horizontal_10,
                flexDirection: 'row'
            }}
                onPress={() => { setShowDetial(prev => !prev) }}
            >
                <Text style={{
                    color: Colors.white,
                    fontFamily: Fonts.SemiBold,
                    fontSize: AppSizes.Font_18,
                    textAlign: 'center',
                    marginLeft: AppSizes.Margin_Vertical_10,
                    paddingVertical: AppSizes.Padding_Vertical_15,
                }}>{mangers.name}</Text>
                <View style={{ alignSelf: 'center' }}>
                    <Icon
                        type='MaterialIcons'
                        name={showDetial ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                        size={scale(30)}
                        color={Colors.white}
                    />
                </View>
            </TouchableOpacity>

            {showDetial && 
            <View style={{
                borderWidth: 1,
                borderColor: Colors.primaryDark,
                borderRadius: AppSizes.Radius_15,
                width: "95%",
                alignSelf: 'center',
            }}>
                <TouchableOpacity
                    key={mangers.name}
                    style={{
                        alignSelf: 'center',
                        width: "98%",
                        backgroundColor: '#DBEDFF',
                        marginVertical: AppSizes.Margin_Vertical_5,
                        padding: AppSizes.Padding_Horizontal_10,
                        borderRadius: AppSizes.Radius_15,
                    }}
                    onPress={()=>navigation.navigate('DynamicScreen',{branches :mangers.branches})}
                >

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ color: Colors.primaryDark, fontSize: AppSizes.Font_12, fontFamily: Fonts.SemiBold }}>Total Invoices :</Text>
                        <Text style={{ color: Colors.secondary, fontSize: AppSizes.Font_12, fontFamily: Fonts.SemiBold }}>{mangers.total_In}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ color: Colors.primaryDark, fontSize: AppSizes.Font_12, fontFamily: Fonts.SemiBold }}>Total Amount Received :</Text>
                        <Text style={{ color: 'green', fontSize: AppSizes.Font_12, fontFamily: Fonts.SemiBold }}>{mangers.total_AR}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ color: Colors.primaryDark, fontSize: AppSizes.Font_12, fontFamily: Fonts.SemiBold }}>Total Amount Due :</Text>
                        <Text style={{ color: 'red', fontSize: AppSizes.Font_12, fontFamily: Fonts.SemiBold }}>{mangers.total_AD}</Text>
                    </View>
                </TouchableOpacity>
               
            </View>}
        </>
    )
}