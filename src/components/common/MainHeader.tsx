import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import Ionicons from '@react-native-vector-icons/ionicons';
import { AppSizes } from '../../utils/AppSizes';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { logout } from '../../redux/slices/authSlice';
import { showMessage } from 'react-native-flash-message';
import { CommonStyles } from '../../styles/GlobalStyle';

interface MainHeaderProps {
  title: string;
  subTitle: string;
}

const MainHeader: React.FC<MainHeaderProps> = ({ title, subTitle }) => {
  const navigation = useNavigation();
  const { theme } = useTheme();

  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          dispatch(logout());

          showMessage({
            message: 'Logged out successfully',
            type: 'success',
            style: CommonStyles.sucsses,
          });
        },
      },
    ]);
  };

  return (
    <View
      style={[styles.header, { backgroundColor: theme.colors.secondaryDark }]}
    >
      <TouchableOpacity
        // onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        style={styles.menuButton}
        accessibilityLabel="Open drawer"
      >
        <View
          style={{
            padding: AppSizes.Padding_Horizontal_8,
            backgroundColor: theme.colors.surfaceVariant,
            borderColor: theme.colors.white,
            borderWidth: 1,
            borderRadius: AppSizes.Radius_30,
          }}
        >
          <Ionicons
            name="person-outline"
            size={28}
            color={theme.colors.secondaryDark}
          />
        </View>
      </TouchableOpacity>
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
          onPress={handleLogout}
          name="log-out-outline"
          size={AppSizes.Icon_Height_30}
          color={theme.colors.error}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '10%',

    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
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
});

export default MainHeader;
