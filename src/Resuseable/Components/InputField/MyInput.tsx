import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { ReactNode } from 'react'
import { Colors } from '../../../Theme/Color';
import Icon from '../../Icon';
import { AppSizes } from '../../../Theme/appsizes';
import { Fonts } from '../../../Theme/Fonts';


interface MyInputProps {
  label? :string | null
  placeholder: string,
  onchangetext: (text:string) => void;
  onBlur?: any;
  value: string,
  icontype: any,
  iconname: string,
  righticon?: boolean,
  secureText?: boolean,
  righticonpress?: () => void,
  rightText?: string,
  editabe?: boolean,
  onRightPress?: () => void,
  renderRightComponent? : ReactNode,
  textColor?: string,
  paddingVertical?: number,
  paddingBottom?: number,
  keyboardtype?: any
  multiline?: boolean
  numberOfLines?: number,
  leftIcon?:boolean
}

const MyInput = ({
  label = null,
  placeholder,
  onchangetext,
  onBlur,
  value,
  icontype,
  iconname,
  paddingVertical,
  paddingBottom,
  righticon = false,
  righticonpress,
  secureText,
  rightText,
  editabe = true,
  onRightPress,
  renderRightComponent,
  textColor,
  keyboardtype,
  leftIcon=true,

  multiline,
  numberOfLines,
}: MyInputProps) => {


  return (
    <View style={{flexDirection:'column'}}>
      {label?
      (
        <Text style={{color:Colors.primaryDark,fontSize:AppSizes.Font_14,fontFamily:Fonts.SemiBold,marginBottom:AppSizes.Margin_Vertical_5}}>
          {label}
      </Text>):
      (null)}

      <View
      style={[
        styles.maininputContainer,
        {

          backgroundColor: Colors.white,
          borderColor: Colors.primaryDark,
          paddingVertical: paddingVertical ? paddingVertical : AppSizes.Padding_Vertical_5,
          paddingBottom: paddingBottom?paddingBottom:null,
        },
      ]}
    >
      {leftIcon?(<Icon type={icontype} name={iconname} size={AppSizes.Gap_20} color={Colors.primaryDark} />):(null)}

      <TextInput
        keyboardType={keyboardtype ? keyboardtype : 'default'}
        multiline={multiline}
        numberOfLines={numberOfLines ? numberOfLines : 1}
        value={value}
        placeholder={placeholder}
        cursorColor={Colors.secondary}
        placeholderTextColor={Colors.primaryDark}
        onChangeText={onchangetext}
        onBlur={onBlur}
        editable={editabe}
        secureTextEntry={secureText}
        style={[styles.inputContainer, { color: '#000'  }]}
      />


      {renderRightComponent}


      {rightText && onRightPress && (
        <TouchableOpacity onPress={onRightPress}>
          <Text style={styles.rightText}>{rightText}</Text>
        </TouchableOpacity>
      )}



    </View>
    </View>

  )
}

export default MyInput 



const styles = StyleSheet.create({
  maininputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: AppSizes.Radius_8,
    paddingHorizontal: AppSizes.Gap_10,
    borderWidth: 1,

  },
  inputContainer: {
    flex: 1,
    paddingLeft: AppSizes.Gap_10,
    
  },
  rightText: {
    color: Colors.secondary,
    fontSize: AppSizes.Font_14,
    marginLeft: AppSizes.Gap_10,
    fontWeight: '600',
  },
})