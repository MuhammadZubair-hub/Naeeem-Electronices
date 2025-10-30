import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  BackHandler,
  Alert,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppSizes } from '../../utils/AppSizes';
import { useLoginUser } from './login';
import { LoadingModal } from '../../components/common/LoadingModal';
import Ionicons from '@react-native-vector-icons/ionicons';
import { fonts } from '../../assets/fonts/Fonts';
import { colors } from '../../styles/theme';
import { useFocusEffect } from '@react-navigation/native';
// import { BlurView } from '@react-native-community/blur';

const LoginScreen = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const [showPswd, setShowPswd] = useState<boolean>(true);

  const loginData = useLoginUser();

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        Alert.alert(
          '',
          'Do you want to exit the app?',
          [
            {
              text: 'Cancel',
              onPress: () => null,
              style: 'cancel',
            },
            {
              text: 'YES',
              onPress: () => BackHandler.exitApp(),
            },
          ],
          { cancelable: true },
        );
        return true; // prevent default back behavior
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      // Cleanup when leaving the screen
      return () => backHandler.remove();
    }, []),
  );

  return (
   
      <SafeAreaView style={[styles.safeArea,{backgroundColor:theme.colors.white}]}>
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
                source={require('../../assets/images/logo.png')}
                style={{ width: 200, height: 170, resizeMode: 'contain' }}
              />
            </View>
            {/* Card Header */}

            {/* Input Fields Container */}
            <View style={styles.inputFieldsContainer}>
              {/* User ID Input */}
              <View style={styles.fieldContainer}>
                <Text
                  style={[
                    styles.fieldLabel,
                    { color: theme.colors.secondaryDark },
                  ]}
                >
                  User ID
                </Text>
                <View
                  style={[
                    styles.inputContainer,
                    {
                      backgroundColor: theme.colors.white,
                      borderColor: 'rgba(255,255,255,0.3)',
                    },
                  ]}
                >
                  <View style={styles.iconContainer}>
                    <Ionicons
                      name="person-outline"
                      size={AppSizes.Icon_Height_20}
                      color={theme.colors.secondaryDark}
                    />
                  </View>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        color: theme.colors.textTertiary,
                      },
                    ]}
                    value={loginData.credentials.empId}
                    onChangeText={text => loginData.handleChange('empId', text)}
                    placeholder="Enter your user ID"
                    placeholderTextColor={theme.colors.textTertiary}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.fieldContainer}>
                <Text
                  style={[
                    styles.fieldLabel,
                    { color: theme.colors.secondaryDark },
                  ]}
                >
                  Password
                </Text>
                <View
                  style={[
                    styles.inputContainer,
                    {
                      backgroundColor: theme.colors.white,
                      borderColor: 'rgba(255,255,255,0.3)',
                    },
                  ]}
                >
                  <View style={styles.iconContainer}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={AppSizes.Icon_Height_20}
                      color={theme.colors.secondaryDark}
                    />
                  </View>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        color: theme.colors.textTertiary,
                      },
                    ]}
                    value={loginData.credentials.password}
                    onChangeText={text =>
                      loginData.handleChange('password', text)
                    }
                    placeholder="Enter your password"
                    placeholderTextColor={theme.colors.textTertiary}
                    secureTextEntry={showPswd}
                  />
                  <TouchableOpacity
                    style={styles.eyeIconContainer}
                    onPress={() => setShowPswd(!showPswd)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={showPswd ? 'eye-outline' : 'eye-off-outline'}
                      size={22}
                      color={theme.colors.secondaryDark}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

        
        
              <Button
                variant="secondary"
                title="Sign In"
                onPress={() => loginData.handleLogin(loginData.credentials)}
                style={styles.loginButton}
              />
           
          </View>

          {/* Footer Spacing */}
          <View style={styles.footer} />
        </KeyboardAwareScrollView>

              <LoadingModal visible={loginData.isLoading} />

      </SafeAreaView>

    
  );
};

export default LoginScreen;

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
    paddingHorizontal: AppSizes.Padding_Horizontal_10,
    paddingVertical: AppSizes.Padding_Vertical_5,
  },

  // Header Styles
  headerContainer: {
    alignItems: 'center',
    paddingTop: AppSizes.Margin_Vertical_40,
  },
  logoContainer: {
    alignItems: 'center',
   // marginBottom: 32,
    marginVertical: AppSizes.Margin_Vertical_40,
  },
  brandTitle: {
    fontSize: 32,
    fontFamily: fonts.bold,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 1,
  },
  brandUnderline: {
    width: 60,
    height: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  titleContainer: {
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 28,
    fontFamily: fonts.bold,
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },

  // Glass Card Effect
  glassCard: {
    borderRadius: 24,
    padding: 12,
    marginHorizontal: 4,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  loginTitle: {
    fontSize: 24,
    fontFamily: fonts.medium,
    textAlign: 'center',
    marginBottom: 8,
  },
  titleUnderline: {
    width: 60,
    height: 3,
    borderRadius: 2,
  },

  // Input Fields Styles
  inputFieldsContainer: {
    marginBottom: AppSizes.Margin_Vertical_30,
  },
  fieldContainer: {
    marginBottom: AppSizes.Margin_Vertical_20,
  },
  fieldLabel: {
    fontSize: 14,
    fontFamily: fonts.medium,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: AppSizes.Radius_10,
    paddingHorizontal: 16,
    minHeight: 56,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    marginRight: AppSizes.Margin_Horizontal_10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: AppSizes.Margin_Vertical_5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    //paddingVertical: AppSizes.Padding_Vertical_15,
  },
  eyeIconContainer: {
    padding: 4,
    marginLeft: 8,
  },

  // Button Styles
  buttonContainer: {
    marginBottom: 8,
  },
  loginButton: {
    minHeight: 56,
    borderRadius: AppSizes.Radius_10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  // Footer
  footer: {
    height: 40,
  },
});
