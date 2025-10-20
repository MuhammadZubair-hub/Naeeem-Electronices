import { fonts } from '../assets/fonts/Fonts';
import { StyleSheet } from "react-native";
import { AppSizes } from "../utils/AppSizes";

export const CommonStyles = StyleSheet.create({



  mainContainer: { flex: 1 },

  list: {
    paddingVertical: AppSizes.Margin_Vertical_20,
    rowGap: AppSizes.Gap_20,
  },
  item: {
    // borderRadius: 12,
    // padding: 16,
    // rowGap: AppSizes.Margin_Vertical_10,

    // elevation: 14,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.8,
    // shadowRadius: 4,
    marginHorizontal: AppSizes.Margin_Horizontal_20,
    elevation: 14,
    backgroundColor: 'white',
    padding: AppSizes.Padding_Horizontal_15,
    rowGap: AppSizes.Margin_Vertical_10,
    borderRadius: AppSizes.Radius_15,
  },
  title: { fontSize: AppSizes.Font_20, fontFamily: fonts.semiBold },
  subtitle: { fontSize: AppSizes.Font_14, fontFamily: fonts.semiBold, flex: 1.5 },
  label: { fontSize: AppSizes.Font_14, fontFamily: fonts.semiBold, flex: 1.3 },
  value: {
    // fontWeight: 'bold',
    flex: 1.5,
    fontFamily: fonts.semiBold,
    // padding: AppSizes.Padding_Horizontal_5,
    // borderRadius: AppSizes.Radius_15,
    textAlign: 'right'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginVertical: 2,
  },
  divider: {
    // marginBottom: 12,
    marginHorizontal: AppSizes.Gap_30,
    // marginTop: AppSizes.Margin_Vertical_20,
    borderWidth: 0.5,
    borderTopColor: '#ccc',
  },

  viewButtonStyle: {
    alignSelf: 'center',
    width: '70%',
    paddingVertical: 6,
    marginTop: 10,


    borderRadius: AppSizes.Radius_10,
  },

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
  warning: {
    backgroundColor: '#e3ac05ff',
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