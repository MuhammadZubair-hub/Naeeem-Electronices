import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import Ionicons from '@react-native-vector-icons/ionicons';
import { AppSizes } from '../../utils/AppSizes';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { logout } from '../../redux/slices/authSlice';
import { showMessage } from 'react-native-flash-message';
import { CommonStyles } from '../../styles/GlobalStyle';
import BaseModal from './BaseModal';
import { fonts } from '../../assets/fonts/Fonts';
import { Button } from './Button';
import { colors } from '../../styles/theme';

interface MainHeaderProps {
  title: string | undefined;
  subTitle: string | undefined;
}

const MainHeader: React.FC<MainHeaderProps> = ({ title, subTitle }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const [menuVisible, setMenuVisible] = useState(false);
  const [logoutConfirmVisible, setLogoutConfirmVisible] = useState(false);
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [showPswd, setShowPswd] = useState<boolean>(true);
  const [showNewPswd, setShowNewPswd] = useState<boolean>(true);

  const handleLogout = () => {
    setMenuVisible(false);
    setLogoutConfirmVisible(true);
  };
  const handleChangePassword = () => {
    setMenuVisible(false);
    setChangePasswordVisible(true);
  };

  const UpdatePassword = () => {
    setChangePasswordVisible(false);
    setMenuVisible(true);
  };

  const confirmLogout = () => {
    setLogoutConfirmVisible(false);
    dispatch(logout());
    showMessage({
      message: 'Logged out successfully',
      type: 'success',
      style: CommonStyles.sucsses,
    });
  };

  const menuItems = [
    {
      icon: 'lock-closed-outline',
      label: 'Change Password',
      onPress: () => handleChangePassword(),
    },
    {
      icon: 'time-outline',
      label: 'View Login History',
      onPress: () => setMenuVisible(false),
    },
  ];

  return (
    <>
      <View
        style={[styles.header, { backgroundColor: theme.colors.secondaryDark }]}
      >
        <View
          style={{
            padding: AppSizes.Padding_Horizontal_8,
            backgroundColor: theme.colors.surfaceVariant,
            borderColor: theme.colors.white,
            borderWidth: 1,
            borderRadius: AppSizes.Radius_30,
            marginRight: AppSizes.Margin_Horizontal_15,
          }}
        >
          <Ionicons
            name="person"
            size={AppSizes.Icon_Height_30}
            color={theme.colors.secondaryDark}
          />
        </View>

        <View>
          <Text style={[styles.title, { color: theme.colors.white }]}>
            {title}
          </Text>
          <Text style={[styles.subTitle, { color: theme.colors.white }]}>
            ({subTitle})
          </Text>
        </View>

        <View
          style={{ position: 'absolute', right: AppSizes.Margin_Horizontal_20 }}
        >
          <Ionicons
            onPress={() => setMenuVisible(true)}
            name="ellipsis-vertical"
            size={AppSizes.Icon_Height_30}
            color={theme.colors.white}
          />
        </View>
      </View>

      <BaseModal
        headerText="Account"
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        modalHeight="50%"
      >
        <View style={styles.menuList}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                { borderBottomColor: theme.colors.surfaceVariant },
              ]}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconWrap,
                  { backgroundColor: theme.colors.secondaryDark + '15' },
                ]}
              >
                <Ionicons
                  name={item.icon as any}
                  size={AppSizes.Icon_Height_20}
                  color={theme.colors.secondaryDark}
                />
              </View>
              <Text
                style={[
                  styles.menuLabel,
                  { color: theme.colors.secondaryDark },
                ]}
              >
                {item.label}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={AppSizes.Icon_Height_20}
                color={theme.colors.secondaryDark + '80'}
              />
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={[
              styles.logoutBtn,
              {
                backgroundColor: theme.colors.error + '15',
                borderColor: theme.colors.error + '40',
              },
            ]}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.iconWrap,
                { backgroundColor: theme.colors.error + '20' },
              ]}
            >
              <Ionicons
                name="log-out-outline"
                size={AppSizes.Icon_Height_20}
                color={theme.colors.error}
              />
            </View>
            <Text style={[styles.menuLabel, { color: theme.colors.error }]}>
              Logout
            </Text>
            <Ionicons
              name="chevron-forward"
              size={AppSizes.Icon_Height_20}
              color={theme.colors.error + '80'}
            />
          </TouchableOpacity>
        </View>
      </BaseModal>

      {/* Logout Out Modal  */}
      <BaseModal
        headerText="Logout"
        visible={logoutConfirmVisible}
        onClose={() => setLogoutConfirmVisible(false)}
        modalHeight="48%"
      >
        <View style={styles.confirmBody}>
          <View
            style={[
              styles.confirmIconWrap,
              { backgroundColor: theme.colors.error + '15' },
            ]}
          >
            <Ionicons
              name="log-out-outline"
              size={AppSizes.Icon_Height_30}
              color={theme.colors.error}
            />
          </View>
          <Text
            style={[styles.confirmText, { color: theme.colors.secondaryDark }]}
          >
            Are you sure you want to logout?
          </Text>
          <View style={styles.confirmActions}>
            <TouchableOpacity
              style={[
                styles.confirmBtn,
                {
                  borderColor: theme.colors.secondaryDark + '40',
                  backgroundColor: theme.colors.surfaceVariant,
                },
              ]}
              onPress={() => setLogoutConfirmVisible(false)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.confirmBtnText,
                  { color: theme.colors.secondaryDark },
                ]}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.confirmBtn,
                {
                  backgroundColor: theme.colors.error,
                  borderColor: theme.colors.error,
                },
              ]}
              onPress={confirmLogout}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.confirmBtnText, { color: theme.colors.white }]}
              >
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </BaseModal>

      {/* Change Password Modal  */}
      <BaseModal
        headerText="Change Password"
        visible={changePasswordVisible}
        onClose={() => setChangePasswordVisible(false)}
        modalHeight="88%"
      >
        <View style={styles.confirmBody}>
          <View
          // style={[
          //   styles.confirmIconWrap,
          //   { backgroundColor: theme.colors.error + '15' },
          // ]}
          >
            {/* <Ionicons
              name="lock-closed-outline"
              size={AppSizes.Icon_Height_30}
              color={theme.colors.error}
            /> */}
            {/* <Text
              style={{
                color: colors.secondaryDark,
                fontSize: 16,
                // paddingVertical: 10,
                fontFamily: fonts.medium,
              }}
            >
              Update Your Password
            </Text> */}
          </View>

          <View style={styles.fieldContainer}>
            <Text
              style={[styles.fieldLabel, { color: theme.colors.secondaryDark }]}
            >
              Current Password
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
                // value={loginData.credentials.password}
                // onChangeText={text =>
                //   loginData.handleChange('password', text)
                // }
                placeholder="Enter Current password"
                placeholderTextColor={theme.colors.textTertiary}
                secureTextEntry={showPswd}
              />
              <TouchableOpacity
                style={styles.eyeIconContainer}
                onPress={() => setShowPswd(!showPswd)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={showNewPswd ? 'eye-outline' : 'eye-off-outline'}
                  size={22}
                  color={theme.colors.secondaryDark}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.fieldContainer}>
            <Text
              style={[styles.fieldLabel, { color: theme.colors.secondaryDark }]}
            >
              New Password
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
                  name={
                    showNewPswd ? 'lock-closed-outline' : 'lock-closed-outline'
                  }
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
                // value={loginData.credentials.password}
                // onChangeText={text =>
                //   loginData.handleChange('password', text)
                // }
                placeholder="Enter Your New Password"
                placeholderTextColor={theme.colors.textTertiary}
                secureTextEntry={showNewPswd}
              />
              <TouchableOpacity
                style={styles.eyeIconContainer}
                onPress={() => setShowNewPswd(!showNewPswd)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={showNewPswd ? 'eye-outline' : 'eye-off-outline'}
                  size={22}
                  color={theme.colors.secondaryDark}
                />
              </TouchableOpacity>
            </View>
          </View>

          <Button
            variant="secondary"
            title="Update"
            onPress={() => UpdatePassword()}
            style={styles.loginButton}
          />
        </View>
      </BaseModal>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    //justifyContent: 'space-between',
    paddingHorizontal: AppSizes.Padding_Horizontal_15,

    paddingTop: 24,
    paddingBottom: 12,
    borderBottomLeftRadius: AppSizes.Radius_30,
    borderBottomRightRadius: AppSizes.Radius_30,
    //marginBottom: AppSizes.Margin_Vertical_10,
    // zIndex: 10,
  },
  menuButton: {
    marginRight: 16,
    padding: 4,
  },
  title: {
    fontSize: AppSizes.Font_18,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'left',
  },
  subTitle: {
    fontSize: AppSizes.Font_14,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'left',
  },
  menuList: {
    paddingVertical: AppSizes.Padding_Horizontal_8,
    gap: 8,
    // flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: AppSizes.Padding_Horizontal_10,
    paddingHorizontal: AppSizes.Padding_Horizontal_8,
    borderBottomWidth: 1,
    borderRadius: AppSizes.Radius_10,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: AppSizes.Padding_Horizontal_10,
    paddingHorizontal: AppSizes.Padding_Horizontal_8,
    borderRadius: AppSizes.Radius_10,
    borderWidth: 1,
    marginTop: 4,
    marginBottom: 4,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: AppSizes.Margin_Horizontal_15,
  },
  menuLabel: {
    flex: 1,
    fontSize: AppSizes.Font_16,
    fontFamily: 'Poppins-Medium',
  },
  confirmBody: {
    alignItems: 'center',
    paddingVertical: AppSizes.Padding_Horizontal_15,
    gap: 12,
  },
  confirmIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmText: {
    fontSize: AppSizes.Font_16,
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
  },
  confirmActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginTop: 4,
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: AppSizes.Padding_Horizontal_10,
    borderRadius: AppSizes.Radius_10,
    borderWidth: 1,
    alignItems: 'center',
  },
  confirmBtnText: {
    fontSize: AppSizes.Font_16,
    fontFamily: 'Poppins-SemiBold',
  },
  fieldContainer: {
    marginBottom: AppSizes.Margin_Vertical_20,
    width: '90%',
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

  loginButton: {
    maxHeight: 56,
    width: '90%',
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
});

export default MainHeader;
