import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from './hooks/useTheme';
import { RootState } from './redux/store';
import { fonts } from './assets/fonts/Fonts';
import { AppSizes } from './utils/AppSizes';
import { getIsActive, setisActive } from './redux/slices/authSlice';
import CoustomerLoginScreen from './Customer/Auth/CoustomerLoginScreen';
import LoginScreen from './Employee/screens/Auth/LoginScreen';

const MainAuth = () => {
  const user_Catogries = ['Customer', 'Employee'];

  const dispatch = useDispatch();
  const isActive =
    useSelector((state: RootState) => state.auth.isActive) || 'Customer';
  console.log('at very first i am ', isActive);
  const { theme } = useTheme();

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.white }]}
    >
      <KeyboardAwareScrollView
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.glassCard}>
          {/* Header Section */}
          <View style={styles.headerContainer}>
            <Image
              source={require('../src/assets/images/logo.png')}
              style={{ width: 200, height: 170, resizeMode: 'contain' }}
            />
          </View>
          {/* Card Header */}
        </View>

        <View
          style={[
            styles.buttonContainer,
            {
              backgroundColor: theme.colors.white,
              borderColor: theme.colors.gray400,
              //marginTop: 10,
            },
          ]}
        >
          {user_Catogries.map((item, index) => {
            const active = isActive === item;

            return (
              <TouchableOpacity
                style={[
                  styles.loginButton,
                  {
                    backgroundColor: active
                      ? theme.colors.secondaryDark
                      : theme.colors.white,
                  },
                ]}
                onPress={() => {
                  dispatch(setisActive(item));
                }}
              >
                <Text
                  style={[
                    styles.loginButtonText,
                    {
                      color: active
                        ? theme.colors.white
                        : theme.colors.secondaryDark,
                    },
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {isActive === 'Customer' ? <CoustomerLoginScreen /> : <LoginScreen />}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default MainAuth;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    //zIndex: 2,
    justifyContent: 'center',
    //marginTop: AppSizes.Margin_Vertical_40,

    // alignItems: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    // paddingHorizontal: AppSizes.Padding_Horizontal_10,
    // paddingVertical: AppSizes.Padding_Vertical_5,
  },

  // Header Styles
  headerContainer: {
    alignItems: 'center',
    //paddingTop: AppSizes.Margin_Vertical_40,
  },
  logoContainer: {
    alignItems: 'center',
    // marginBottom: 32,
    //marginVertical: AppSizes.Margin_Vertical_10,
  },

  glassCard: {
    //borderRadius: 24,
    //padding: 12,
    //marginHorizontal: 4,
  },

  buttonContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 10,
    height: 45,
    width: '60%',
    marginBottom: 10,
  },
  loginButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    width: '50%',
    height: '100%',
  },
  loginButtonText: {
    //color: Colors.white,
    fontFamily: fonts.semiBold,
    fontWeight: '500',
    fontSize: 18,
  },
});
