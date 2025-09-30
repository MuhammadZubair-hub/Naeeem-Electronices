import { AppSizes } from './../utils/AppSizes';
import { StyleSheet } from "react-native";

export const CommonStyles = StyleSheet.create({

 
  error: {
    backgroundColor: 'red',
    //height: 60,
    width: '90%',
    alignSelf: 'center',
    marginTop: AppSizes.Margin_Vertical_40,
    borderRadius: AppSizes.Radius_10,
    paddingHorizontal: AppSizes.Padding_Horizontal_15,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.45,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sucsses: {
    backgroundColor: '#32CD32',
    //height: 60,
    width: '90%',
    alignSelf: 'center',
    marginTop: AppSizes.Margin_Vertical_40,
    borderRadius: AppSizes.Radius_10,
    paddingHorizontal: AppSizes.Padding_Horizontal_15,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.45,
    shadowRadius: 3.84,
    elevation: 5,
  },

})