import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import Ionicons from '@react-native-vector-icons/ionicons';
import { AppSizes } from '../../utils/AppSizes';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { logout } from '../../redux/slices/authSlice';
import { showMessage } from 'react-native-flash-message';
import { CommonStyles } from '../../styles/GlobalStyle';
import BaseModal from './BaseModal';
import { fonts } from '../../assets/fonts/Fonts';
import { Button } from './Button';
import { API_Config } from '../../Employee/services/apiServices';
import { current } from '@reduxjs/toolkit';
import { formatDate, formatDateTime, formatTime } from '../../utils/formatters';
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
  const [loginHistoryVisible, setLoginHistoryVisible] = useState(false);
  const [loginHistoryLoading, setLoginHistoryLoading] = useState(false);
  const [loginHistoryData, setLoginHistoryData] = useState<any[]>([]);
  const [loginHistoryError, setLoginHistoryError] = useState('');
  const [showPswd, setShowPswd] = useState<boolean>(true);
  const [showNewPswd, setShowNewPswd] = useState<boolean>(true);
  const [pswd, setPswd] = useState({ curpswd: '', newpswd: '' });

  const users = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    setMenuVisible(false);
    setLogoutConfirmVisible(true);
  };
  const handleChangePassword = () => {
    setMenuVisible(false);
    setChangePasswordVisible(true);
  };

  const handleViewLoginHistory = async () => {
    setMenuVisible(false);
    setLoginHistoryVisible(true);
    setLoginHistoryError('');
    setLoginHistoryLoading(true);

    const response = await API_Config.getEmployeeLogs();
    if (response.success && response.data?.status) {
      const items = Array.isArray(response.data.data) ? response.data.data : [];
      console.log('🚀 ~ :63 ~ handleViewLoginHistory ~ items:', items);
      setLoginHistoryData(items);

      if (items.length === 0) {
        setLoginHistoryError('No login history found.');
      }
    } else {
      setLoginHistoryData([]);
      setLoginHistoryError(
        response.data?.message ||
          response.message ||
          'Unable to fetch login history.',
      );
    }

    setLoginHistoryLoading(false);
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

  const UpdatePassword = async () => {
    console.log('User: ', users);
    console.log('pswd: ', pswd);

    if (!pswd.curpswd || !pswd.newpswd) {
      // if (pswd.curpswd === '' || pswd.newpswd === '') {
      showMessage({
        message: 'Validation Error',
        description: 'Please enter both New Password and Confirm Password',
        type: 'danger',
        style: CommonStyles.error,
      });
      return;
    }
    if (pswd?.curpswd !== pswd.newpswd) {
      showMessage({
        message: 'Validation Error',
        description: 'New Password and Confirm Password do not match',
        type: 'danger',
        style: CommonStyles.error,
      });
      return;
    }

    if (pswd.curpswd.length < 4 || pswd.newpswd.length < 4) {
      showMessage({
        message: 'Error',
        description: 'Password must be at least 4 characters long',
        type: 'danger',
        style: CommonStyles.error,
      });
      return;
    }
    console.log('here');
    //  const user = empId.trim();
    const user: any = users?.empId;
    const pass = pswd.newpswd.trim();
    try {
      const response = await API_Config.updateUserPassword(user, pass);

      console.log('response : ', response);
      if (response?.data?.status === true) {
        showMessage({
          message: 'Congrats',
          description: 'Password is Updated',
          type: 'success',
          style: CommonStyles.sucsses,
        });
        setTimeout(() => {
          confirmLogout();
        }, 500);
      }
    } catch (error: any) {
      // setPswd(null)
      showMessage({
        message: 'Error',
        description: error?.message || 'Password is Updated',
        type: 'danger',
        style: CommonStyles.error,
      });
    } finally {
      console.log('object');
    }
    // setChangePasswordVisible(false);
    // setMenuVisible(true);
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
      onPress: () => handleViewLoginHistory(),
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

      {/* Login History Modal  */}
      <BaseModal
        headerText="Login History"
        visible={loginHistoryVisible}
        onClose={() => setLoginHistoryVisible(false)}
        modalHeight="80%"
      >
        <View style={styles.confirmBody}>
          {loginHistoryLoading ? (
            <ActivityIndicator
              size="large"
              color={theme.colors.secondaryDark}
              style={{ marginTop: AppSizes.Margin_Vertical_20 }}
            />
          ) : loginHistoryError ? (
            <>
              <Text
                style={[
                  styles.confirmText,
                  { color: theme.colors.secondaryDark },
                ]}
              >
                {loginHistoryError}
              </Text>

              <TouchableOpacity style={{ padding: 10 }}>
                <Ionicons
                  name="reload-circle"
                  size={20}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </>
          ) : (
            <ScrollView
              style={styles.historyScroll}
              contentContainerStyle={styles.historyScrollContent}
            >
              {loginHistoryData.map((item, index) => (
                <View key={index} style={styles.historyItem}>
                  <View style={styles.historyHeader}>
                    <Text
                      style={[
                        styles.historyLabel,
                        { color: theme.colors.secondaryDark },
                      ]}
                    >
                      Date
                    </Text>
                    <Text
                      style={[
                        styles.historyValue,
                        { color: theme.colors.textTertiary },
                      ]}
                    >
                      {formatDate(item.loginTime) || '-'}
                    </Text>
                  </View>
                  <View style={styles.historyHeader}>
                    <Text
                      style={[
                        styles.historyLabel,
                        { color: theme.colors.secondaryDark },
                      ]}
                    >
                      Time
                    </Text>
                    <Text
                      style={[
                        styles.historyValue,
                        { color: theme.colors.textTertiary },
                      ]}
                    >
                      {formatTime(item.loginTime) || '-'}
                      {/* {item.loginTime.split(' ')[1] || '-'} */}
                    </Text>
                  </View>

                  <View style={styles.historyRow}>
                    <Text
                      style={[
                        styles.historyLabel,
                        { color: theme.colors.secondaryDark },
                      ]}
                    >
                      IP
                    </Text>
                    <Text
                      style={[
                        styles.historyValue,
                        { color: theme.colors.textTertiary },
                      ]}
                    >
                      {' '}
                      {item.ipAddress || '-'}
                    </Text>
                  </View>
                  <View style={styles.historyRow}>
                    <Text
                      style={[
                        styles.historyLabel,
                        { color: theme.colors.secondaryDark },
                      ]}
                    >
                      MAC
                    </Text>
                    <Text
                      style={[
                        styles.historyValue,
                        { color: theme.colors.textTertiary },
                      ]}
                    >
                      {' '}
                      {item.macAddress || '-'}
                    </Text>
                  </View>
                  <View style={styles.historyRow}>
                    <Text
                      style={[
                        styles.historyLabel,
                        { color: theme.colors.secondaryDark },
                      ]}
                    >
                      Longitude
                    </Text>
                    <Text
                      style={[
                        styles.historyValue,
                        { color: theme.colors.textTertiary },
                      ]}
                    >
                      {' '}
                      {item.longitude || '-'}
                    </Text>
                  </View>
                  <View style={styles.historyRow}>
                    <Text
                      style={[
                        styles.historyLabel,
                        { color: theme.colors.secondaryDark },
                      ]}
                    >
                      Latitude
                    </Text>
                    <Text
                      style={[
                        styles.historyValue,
                        { color: theme.colors.textTertiary },
                      ]}
                    >
                      {' '}
                      {item.latitude || '-'}
                    </Text>
                  </View>

                  <View style={styles.historyRow}>
                    <Text
                      style={[
                        styles.historyLabel,
                        { color: theme.colors.secondaryDark },
                      ]}
                    >
                      Status
                    </Text>
                    <Text
                      style={[
                        styles.historyValue,
                        { color: theme.colors.textTertiary },
                      ]}
                    >
                      {' '}
                      {item.status || '-'}
                    </Text>
                  </View>
                  {/* <View>
                    <Text>App Version:</Text>
                    <Text>1.0.2</Text>
                  </View> */}
                </View>
              ))}
            </ScrollView>
          )}
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
                value={pswd.curpswd}
                onChangeText={text =>
                  setPswd(pre => ({ ...pre, curpswd: text }))
                }
                placeholder="Enter New Password"
                placeholderTextColor={theme.colors.textTertiary}
                secureTextEntry={showPswd}
              />
              <TouchableOpacity
                style={styles.eyeIconContainer}
                onPress={() => setShowPswd(!showPswd)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={showPswd ? 'eye-off-outline' : 'eye-outline'}
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
              Confirm Password
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
                value={pswd.newpswd}
                onChangeText={text =>
                  setPswd(pre => ({ ...pre, newpswd: text }))
                }
                placeholder="Confirm your Password"
                placeholderTextColor={theme.colors.textTertiary}
                secureTextEntry={showNewPswd}
              />
              <TouchableOpacity
                style={styles.eyeIconContainer}
                onPress={() => setShowNewPswd(!showNewPswd)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={showNewPswd ? 'eye-off-outline' : 'eye-outline'}
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
  historyScroll: {
    width: '100%',
  },
  historyScrollContent: {
    paddingVertical: AppSizes.Padding_Horizontal_10,
  },
  historyItem: {
    backgroundColor: '#F7F7F7',
    borderRadius: AppSizes.Radius_15,
    padding: AppSizes.Padding_Horizontal_10,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    marginBottom: AppSizes.Margin_Vertical_10,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  historyLabel: {
    fontSize: 14,
    fontFamily: fonts.medium,
  },
  historyValue: {
    fontSize: 14,
    fontFamily: fonts.regular,
    textAlign: 'right',
    flex: 1,
    marginLeft: 12,
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
