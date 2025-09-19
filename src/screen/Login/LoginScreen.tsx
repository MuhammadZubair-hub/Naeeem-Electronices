import { Image, Text, View } from 'react-native'
import React, { useState } from 'react'
import Basescreen from '../../Resuseable/BaseScreen';
import { Colors } from '../../Theme/Color';
import { AppSizes } from '../../Theme/appsizes';
import { Fonts } from '../../Theme/Fonts';
import Icon from '../../Resuseable/Icon';
import MyInput from '../../Resuseable/Components/InputField/MyInput';
import MyButton from '../../Resuseable/Components/MyButton/MyButton';
import { scale, verticalScale } from '../../Theme/resposive';
import { useNavigation } from '@react-navigation/native';
import { useLoginDetials } from './login';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';
import { setUserToken } from '../../utils/Shared/UserSlice';
import { LoadingBaseModal } from '../../Resuseable/Components/Modal/LoadingModal';

type loginNavigator = {
    UserDashboard : undefined
}

export const LoginScreen = () =>{
    const [secureicon, setSecureIcon] = useState(true);
    const navigation = useNavigation<NativeStackNavigationProp<loginNavigator>>();
    const dispatch = useDispatch();

    const user = useLoginDetials();

    const handleSignin = async () => {
        const result =  await user.handleLogin();
        console.log(" result is ",result)
        console.log('result data is ',result?.data[0])
        if(result?.data[0] === true){
            dispatch(setUserToken(result.data[3]));
            //navigation.navigate('UserDashboard');
        }
        
    }

    return (
        <Basescreen
            statusBarColor={Colors.white}
            //backgroundColor={Colors.white}
            scroable={true}
            paddingHorizontal={AppSizes.Padding_Vertical_10}>
           
             <View style={{ flex: 1, justifyContent: "flex-start", marginTop: verticalScale(40), rowGap: AppSizes.Gap_20, }}>
                <View
                    style={{
                        alignItems: 'center',
                        marginVertical: AppSizes.Margin_Vertical_10,
                        rowGap: AppSizes.Gap_10,
                    }}>
                    <Image
                        source={require('../../Image/naeemLogo.png')}
                        style={{ height: verticalScale(150), width: scale(150), resizeMode: 'contain' }}
                    />
                   
                    <Text
                        style={{
                            color: Colors.primaryDark,
                            fontFamily: Fonts.Medium,
                            fontWeight: '500',
                            fontSize: AppSizes.Font_14,
                        }}>
                        Sign in to Continue
                    </Text>
                </View>

                <View
                    style={{
                        rowGap: AppSizes.Gap_30,
                        alignItems: 'center',
                        position: 'relative',
                        marginHorizontal: AppSizes.Margin_Horizontal_10
                    }}>
                    <MyInput
                        value={user.logincerdentials.userName}
                        onchangetext={(value)=>user.handleFieldChange('userName',value)}
                        icontype={'Ionicons'}
                        iconname={'mail-outline'}
                        placeholder={'userName'}/>

                    <MyInput
                        value={user.logincerdentials.userPassword}
                        onchangetext={(value)=>user.handleFieldChange('userPassword',value)}
                        icontype={'Ionicons'}
                        iconname={'lock-closed-outline'}
                        placeholder={'password'}
                        secureText={secureicon}
                        renderRightComponent={
                            <Icon
                                type="Ionicons"
                                name={secureicon ? 'eye-off-outline' : 'eye-outline'}
                                onPress={() => setSecureIcon(prev => !prev)}
                                size={AppSizes.Icon_Height}
                                color={Colors.primaryDark}
                            />
                        }/>

                    <MyButton
                        text={'Sign In'}
                        onPress={()=>handleSignin()}
                    ></MyButton>
                </View>
          </View>
          {user.loading && <LoadingBaseModal visible ={user.loading}/>}
          
        </Basescreen>
    )
}





// const styles = StyleSheet.create({
//     maincontainer: {
//         flex: 1,
//         paddingHorizontal: AppSizes.Padding_Horizontal_10,
//         rowGap: AppSizes.Gap_30,
//         // justifyContent:'center',
//         alignItems: 'center',
//     },
//     tittle: {
//         fontFamily: Fonts.SemiBold,
//         fontSize: 50,
//         fontWeight: '400',
//         textAlign: 'center',
//     },

//     changePasswordText: {
//         fontFamily: Fonts.Medium,
//         fontSize: AppSizes.Font_14,
//     },
//     alternateLogin: {
//         flexDirection: 'row',
//         justifyContent: 'space-evenly',
//         alignItems: 'center',
//     },

//     loginButton: {
//         justifyContent: 'center',
//         alignItems: 'center',
//         borderRadius: 26,
//         width: '50%',
//         height: '100%',
//     },

// });