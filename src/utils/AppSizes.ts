import { moderateScale, scale, verticalScale } from './responsive';

export const AppSizes = {
  Padding_Horizontal_5: scale(5),
  Padding_Horizontal_10: scale(10),
  Padding_Horizontal_20: scale(20),
  Padding_Horizontal_15: scale(15),

  Padding_Vertical_5: verticalScale(5),
  Padding_Vertical_10: verticalScale(10),
  Padding_Vertical_15: verticalScale(15),
  Padding_Vertical_20: verticalScale(20),
  Padding_Vertical_25: verticalScale(25),
  Padding_Vertical_30: verticalScale(30),
  Padding_Vertical_35: verticalScale(35),
  Padding_Vertical_40: verticalScale(40),

  Margin_Horizontal_5: scale(5),
  Margin_Horizontal_10: scale(10),
  Margin_Horizontal_15: scale(15),
  Margin_Horizontal_20: scale(20),

  Margin_Vertical_5: verticalScale(5),
  Margin_Vertical_10: verticalScale(10),
  Margin_Vertical_20: verticalScale(20),
  Margin_Vertical_30: verticalScale(30),
  Margin_Vertical_40: verticalScale(40),

  Gap_10: scale(10),
  Gap_20: scale(20),
  Gap_30: scale(30),

  Font_10: moderateScale(10),
  Font_12: moderateScale(12),
  Font_14: moderateScale(14),
  Font_16: moderateScale(16),
  Font_18: moderateScale(18),
  Font_20: moderateScale(20),

  Icon_Height: verticalScale(20),
  Icon_Height_25: verticalScale(25),
  Icon_Height_30: verticalScale(30),
  Icon_Height_35: verticalScale(35),

  Button_Height: verticalScale(48),
  Input_Height: verticalScale(44),
  Container_Width: scale(300),
  Container_Height: verticalScale(200),

  Radius_4: scale(4),
  Radius_8: scale(8),
  Radius_15: scale(15),
  Radius_20: scale(20),
  Radius_30: scale(30),
};
