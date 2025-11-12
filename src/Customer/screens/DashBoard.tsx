import { Image, StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import MainHeader from '../../components/common/MainHeader'
import { Card } from '../../components/common'
import { AppSizes } from '../../utils/AppSizes'
import { useTheme } from '../../hooks/useTheme'
import { fonts } from '../../assets/fonts/Fonts'


const DashBoard = () => {

    const { theme } = useTheme();

    return (
        <SafeAreaView style={{ flex: 1, }} >

            <MainHeader title='Coustomer' subTitle='C-11-2' />

            <View style={{
                paddingHorizontal: AppSizes.Padding_Horizontal_10,
                paddingVertical: AppSizes.Padding_Vertical_5,
                rowGap : AppSizes.Margin_Horizontal_20
            }}>
                <Card style={{ marginTop:AppSizes.Margin_Horizontal_20 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                        <Image
                            resizeMode='contain'
                            source={require('../../assets/images/logo.png')}
                            style={{ height: 100, width: 100, borderRadius: 10 }}></Image>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: theme.colors.secondaryDark, fontSize: AppSizes.Font_14, fontFamily: fonts.semiBold }}>Customer Name</Text>
                            <Text style={{ color: theme.colors.secondaryDark, fontSize: AppSizes.Font_14, fontFamily: fonts.semiBold }}>Father Name</Text>
                            <Text style={{ color: theme.colors.secondaryDark, fontSize: AppSizes.Font_14, fontFamily: fonts.semiBold }}>Branch Name</Text>
                        </View>
                    </View>
                </Card>

                <Card style={{ }}>


                    <View style={{ justifyContent: 'center', }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: theme.colors.secondaryDark, fontSize: AppSizes.Font_14, fontFamily: fonts.semiBold }}>Products</Text>
                            <Text style={{ color: theme.colors.gray600, fontSize: AppSizes.Font_14, fontFamily: fonts.medium }}> Inverter</Text>

                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: theme.colors.secondaryDark, fontSize: AppSizes.Font_14, fontFamily: fonts.semiBold }}>Total</Text>
                            <Text style={{ color: theme.colors.gray600, fontSize: AppSizes.Font_14, fontFamily: fonts.medium }}> Inverter</Text>

                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: theme.colors.secondaryDark, fontSize: AppSizes.Font_14, fontFamily: fonts.semiBold }}>Balance</Text>
                            <Text style={{ color: theme.colors.gray600, fontSize: AppSizes.Font_14, fontFamily: fonts.medium }}> Inverter</Text>

                        </View>
                    </View>

                </Card>


                <Card
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                       // marginHorizontal: AppSizes.Margin_Horizontal_20,
                        elevation: 12,
                        //marginTop: AppSizes.Margin_Vertical_20,
                    }}
                >
                    <View
                        style={[
                            styles.cardtitle,
                            { backgroundColor: theme.colors.secondaryDark },
                        ]}
                    >
                        <Text style={styles.cardSubtitle}>Total</Text>
                        <Text style={{ color: 'white', fontFamily: fonts.medium }}>
                            10000
                        </Text>
                    </View>
                    <View
                        style={[
                            styles.cardtitle,
                            { backgroundColor: theme.colors.success },
                        ]}
                    >
                        <Text style={styles.cardSubtitle}>Paid</Text>
                        <Text style={{ color: 'white', fontFamily: fonts.medium }}>
                        20000
                        </Text>
                    </View>

                    <View
                        style={[
                            styles.cardtitle,
                            { backgroundColor: theme.colors.warning },
                        ]}
                    >
                        <Text style={styles.cardSubtitle}>Due</Text>
                        <Text style={{ color: 'white', fontFamily: fonts.medium }}>
                            20000
                        </Text>
                    </View>
                </Card>

            </View>
        </SafeAreaView>
    )
}

export default DashBoard

const styles = StyleSheet.create({
    cardtitle: {
        alignItems: 'center',

        padding: AppSizes.Padding_Vertical_10,
        borderRadius: AppSizes.Radius_8,
        paddingHorizontal: AppSizes.Padding_Horizontal_20,
        rowGap: AppSizes.Gap_10,
    },
    cardSubtitle: {
        fontSize: AppSizes.Font_16,
        fontFamily: fonts.medium,
        // fontWeight: 'bold',
        color: 'white',
    },
})