import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
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
// import { BlurView } from '@react-native-community/blur';

export const Login: React.FC = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const [showPswd, setShowPswd] = useState<boolean>(true);

  const loginData = useLoginUser();

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <ImageBackground
        source={{
          uri: 'https://img.freepik.com/free-photo/skyscrapers-from-low-angle-view_1359-574.jpg?uid=R215698115&ga=GA1.1.1948378778.1758609707&semt=ais_hybrid&w=740&q=80'
        }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Dark Overlay for better readability */}
        <View style={styles.overlay} />
        
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAwareScrollView
            enableOnAndroid
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Header Section */}
            <View style={styles.headerContainer}>
              <View style={styles.logoContainer}>
                <Text style={[styles.brandTitle, { color: '#FFFFFF' }]}>
                  Naeem Electronics
                </Text>
                <View style={styles.brandUnderline} />
              </View>
              
              <View style={styles.titleContainer}>
                <Text style={[styles.welcomeTitle, { color: '#FFFFFF' }]}>
                  Welcome Back
                </Text>
                <Text style={[styles.welcomeSubtitle, { color: 'rgba(255,255,255,0.8)' }]}>
                  Please sign in to your account
                </Text>
              </View>
            </View>

            {/* Login Form Card with Glass Effect */}
            <View style={styles.glassCard}>
              {/* Card Header */}
              <View style={styles.cardHeader}>
                <Text style={[styles.loginTitle, { color: theme.colors.white }]}>
                  Sign In
                </Text>
                <View style={[styles.titleUnderline, { backgroundColor: theme.colors.black }]} />
              </View>

              {/* Input Fields Container */}
              <View style={styles.inputFieldsContainer}>
                {/* User ID Input */}
                <View style={styles.fieldContainer}>
                  <Text style={[styles.fieldLabel, { color: theme.colors.white }]}>
                    User ID
                  </Text>
                  <View style={[
                    styles.inputContainer,
                    {
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      borderColor: 'rgba(255,255,255,0.3)',
                    }
                  ]}>
                    <View style={styles.iconContainer}>
                      <Ionicons
                        name="person-outline"
                        size={22}
                        color={theme.colors.secondary}
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
                  <Text style={[styles.fieldLabel, { color: theme.colors.white }]}>
                    Password
                  </Text>
                  <View style={[
                    styles.inputContainer,
                    {
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      borderColor: 'rgba(255,255,255,0.3)',
                    }
                  ]}>
                    <View style={styles.iconContainer}>
                      <Ionicons
                        name="lock-closed-outline"
                        size={22}
                        color={theme.colors.secondary}
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
                        color={theme.colors.secondary}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Sign In Button */}
              <View style={styles.buttonContainer}>
                <Button
                  variant="secondary"
                  title="Sign In"
                  onPress={() => loginData.handleLogin(loginData.credentials)}
                  style={styles.loginButton}
                />
              </View>
            </View>

            {/* Footer Spacing */}
            <View style={styles.footer} />
          </KeyboardAwareScrollView>
        </SafeAreaView>
      </ImageBackground>

      <LoadingModal visible={loginData.isLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dark overlay for better text readability
    zIndex: 1,
  },
  safeArea: {
    flex: 1,
    zIndex: 2,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: AppSizes.Padding_Horizontal_20,
    paddingVertical: AppSizes.Padding_Vertical_10,
  },

  // Header Styles
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
    paddingTop: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
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
    backgroundColor: 'rgba(255, 255, 255, 0.35)', // Semi-transparent white
    //backdropFilter: 'blur(20px)', // CSS blur effect
    borderRadius: 24,
    padding: 32,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    //elevation: 15,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  loginTitle: {
    fontSize: 24,
    fontFamily: fonts.bold,
    textAlign: 'center',
    marginBottom: 8,
  },
  titleUnderline: {
    width: 40,
    height: 3,
    borderRadius: 2,
  },

  // Input Fields Styles
  inputFieldsContainer: {
    marginBottom: 32,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 16,
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
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    paddingVertical: 16,
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
    borderRadius: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },

  // Footer
  footer: {
    height: 40,
  },
});