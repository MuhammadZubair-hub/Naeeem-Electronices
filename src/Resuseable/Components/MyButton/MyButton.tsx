import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator, ViewStyle, } from 'react-native';
import { Colors } from '../../../Theme/Color';
import { moderateScale, scale } from '../../../Theme/resposive';
import { AppSizes } from '../../../Theme/appsizes';
import { Fonts } from '../../../Theme/Fonts';
import Icon from '../../Icon';




interface MyButtonProps {
  onPress: () => void;
  text: string;
  lefticon?: boolean;
  lefticonType?: any;
  lefticonName?: string;
  textcolor?: string,
  disAbled?: any,
  buttonstyle?: ViewStyle,
}

const MyButton = ({
  onPress,
  text,
  lefticon = false,
  lefticonType,
  lefticonName,
  textcolor,
  disAbled,
  buttonstyle
}: MyButtonProps) => {

  return (
    <TouchableOpacity

      disabled={disAbled}
      activeOpacity={0.7}
      onPress={onPress}
      style={[{
        backgroundColor: Colors.secondary,
        width: '100%',
        
        paddingVertical:AppSizes.Gap_10
      },
        buttonstyle, styles.buttonContainer]}>
      {lefticon && (
        <Icon
          type={lefticonType}
          name={lefticonName}
          color={Colors.white}
          style={styles.lefticon}
          size={AppSizes.Gap_20}
        />
      )}

      <Text style={[{ color: textcolor ? textcolor : Colors.white }, styles.buttonText]}>{text}</Text>

    </TouchableOpacity>
  );
};

export default MyButton;

const styles = StyleSheet.create({
  buttonContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    //width:'100%',

  },
  buttonText: {
    fontSize: AppSizes.Font_18,
    fontWeight: '200',
    fontFamily: Fonts.Medium,
  },
  lefticon: {
    marginRight: AppSizes.Margin_Vertical_10,
  }
})
