import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '../../../../Theme/Color'
import { AppSizes } from '../../../../Theme/appsizes'
import { Fonts } from '../../../../Theme/Fonts'

interface UsersComponets {
    userText: string,
    onPress: () => void,
}

const UsersComponets = ({
    userText,
    onPress,
}: UsersComponets) => {
    return (
        <TouchableOpacity style={{
            backgroundColor: Colors.secondary,
            borderRadius: AppSizes.Radius_20,
           alignSelf:'center',
            width: '85%',
            marginVertical:AppSizes.Margin_Vertical_10,
        }}
            onPress={onPress}
        >
            <Text style={{
                color: Colors.white,
                fontFamily: Fonts.SemiBold,
                fontSize: AppSizes.Font_18,
                textAlign:'center',
                paddingVertical: AppSizes.Padding_Vertical_20,
            }}>{userText}</Text>
        </TouchableOpacity>
    )
}

export default UsersComponets



