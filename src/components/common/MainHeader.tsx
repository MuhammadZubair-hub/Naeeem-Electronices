import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import Ionicons from '@react-native-vector-icons/ionicons';
import { AppSizes } from '../../utils/AppSizes';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { logout } from '../../redux/slices/authSlice';
import { showMessage } from 'react-native-flash-message';
import { CommonStyles } from '../../styles/GlobalStyle';
import BaseModal from './BaseModal';

interface MainHeaderProps {
  title: string | undefined;
  subTitle: string | undefined;
}

const MainHeader: React.FC<MainHeaderProps> = ({ title, subTitle }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const [menuVisible, setMenuVisible] = useState(false);
  const [logoutConfirmVisible, setLogoutConfirmVisible] = useState(false);

  const handleLogout = () => {
    setMenuVisible(false);
    setLogoutConfirmVisible(true);
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
      onPress: () => setMenuVisible(false),
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
});

export default MainHeader;
