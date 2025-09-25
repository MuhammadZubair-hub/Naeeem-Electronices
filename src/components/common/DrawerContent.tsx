import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Switch,
  Dimensions,
  Pressable,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { toggleTheme } from '../../redux/slices/themeSlice';
import { useTheme } from '../../hooks/useTheme';
import { RootState } from '../../redux/store';
import { Button } from './Button';
import { logout } from '../../redux/slices/authSlice';
import { colors } from '../../styles/theme';
import Ionicons from '@react-native-vector-icons/material-icons';

import { useResponsiveFonts } from '../../hooks/useResponsive';
import { AppSizes } from '../../utils/AppSizes';

const DrawerContent: React.FC<DrawerContentComponentProps> = props => {
  const { width } = Dimensions.get('window');
  const { getFontSize: fontSize } = useResponsiveFonts();
  const dispatch = useDispatch<AppDispatch>();
  const { theme, isDarkMode } = useTheme();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => dispatch(logout()),
      },
    ]);
  };

  const designation = user?.designation?.toUpperCase();
  console.log('user designation in DrawerContent:', designation);
  return (
    <Pressable
      style={[
        styles.drawer,
        { backgroundColor: theme.colors.surface, width: width * 0.65 },
      ]}
      onPress={e => e.stopPropagation()}
    >
      <View style={styles.profileSection}>
        <Image
          source={
            user?.avatar
              ? { uri: user?.avatar }
              : require('../../assets/images/ceo.jpg')
          }
          style={styles.avatar}
        />
        <Text style={[styles.userName, { color: theme.colors.surface }]}>
          {designation || 'User'}
        </Text>
      </View>
      <View
        style={{
          justifyContent: 'space-between',
          flex: 0.75,
          marginVertical: 20,
          paddingLeft: 20,
        }}
      >
        <View style={styles.themeRow}>
          <Text
            style={{
              color: theme.colors.textSecondary,
              fontSize: fontSize(16),
              marginRight: 8,
            }}
          >
            Settings
          </Text>
          {/* <Switch
            value={isDarkMode}
            onValueChange={_value => {
              dispatch(toggleTheme());
            }}
            thumbColor={
              isDarkMode ? theme.colors.primary : theme.colors.gray300
            }
            trackColor={{
              false: theme.colors.gray300,
              true: theme.colors.primary,
            }}
          /> */}
        </View>

        <TouchableOpacity style={styles.logOutButton} onPress={handleLogout}>
          <Ionicons name="logout" size={26} color="red" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Add more drawer content here */}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    flexDirection: 'row',
  },
  drawer: {
    height: '100%',
    // paddingTop: 40,
    // paddingHorizontal: 20,
    elevation: 8,
    zIndex: 100,
    borderTopRightRadius: AppSizes.Radius_30,
    borderBottomRightRadius: AppSizes.Radius_30,
  },
  profileSection: {
    flex: 0.25,
    paddingTop: AppSizes.Padding_Vertical_35,
    alignItems: 'center',
    // marginBottom: 32,
    paddingHorizontal: AppSizes.Padding_Horizontal_20,
    // backgroundColor: colors.accentDark,
    backgroundColor: '#245578ff',
    borderTopRightRadius: AppSizes.Radius_30,
  },
  avatar: {
    width: 82,
    height: 82,
    borderRadius: 46,
    marginBottom: 12,
    backgroundColor: '#eee',
  },
  userName: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
  titleName: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  logOutButton: {
    alignSelf: 'flex-start',
    // justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 20,
  },
  logoutText: {
    textAlign: 'center',
    color: 'red',
    fontSize: 20,
    fontWeight: '600',
  },
});

export default DrawerContent;
