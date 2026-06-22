import React, { use } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import Ionicons from '@react-native-vector-icons/ionicons';
import { AppSizes } from '../../utils/AppSizes';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { screenName } from '../../Employee/navigation/ScreenName';
import { fonts } from '../../assets/fonts/Fonts';
import { colors } from '../../styles/theme';

interface HeaderProps {
  title: string;
  subtitle?: string;
  Id: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightButton?: React.ReactNode;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBackButton = false,
  onBackPress,
  style,
  titleStyle,
  subtitleStyle,
  Id,
}) => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const role = useSelector((state: RootState) =>
    state?.auth?.user?.designation.toLocaleUpperCase(),
  );
  const navigateToDashboard = () => {
    if (role === 'CEO' || role === 'GM') {
      navigation.navigate(screenName.CEO_GM_Dashboard as never);
    } else if (role === 'RM') {
      navigation.navigate(screenName.RM_ZM_Dashboard as never);
    } else if (role === 'ZM') {
      navigation.navigate(screenName.ZM_BR_Dashboard as never);
    } else if (role === 'AVM') {
      navigation.navigate(screenName.BR_AVO_Dashboard as never);
    } else if (role === 'AVO') {
      navigation.navigate(screenName.BR_AVO_Dashboard as never);
    } else {
      navigation.navigate(screenName.CEO_GM_Dashboard as never);
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.secondaryDark },
        style,
      ]}
    >
      <View style={styles.leftSection}>
        {showBackButton && (
          <TouchableOpacity
            onPress={onBackPress || (() => navigation.goBack())}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-back-circle"
              size={AppSizes.Icon_Height_35}
              color={theme.colors.white}
            />
          </TouchableOpacity>
        )}

        <View>
          
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              // gap: 10,
              width:'87%',
              // backgroundColor:colors.accentDark,
              alignItems:'center'
            }}
          >
            <Text
              style={[styles.title, { color: theme.colors.white }, titleStyle]}
            >
              {title}
            </Text>
            <Text
            style={[
              styles.title,
              { color: theme.colors.white, justifyContent: 'center' },
            ]}
          >
            EmpID : {Id}
            {/* EmpID : <Text style={{fontSize:15, fontFamily:fonts.regular}}>{Id}</Text> */}
          </Text>
          </View>
          {subtitle && (
            <Text
              style={[
                styles.subtitle,
                { color: theme.colors.white },
                subtitleStyle,
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      {/* <View style={styles.rightSection}>
        <TouchableOpacity
          onPress={navigateToDashboard}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons
            name="home-outline"
            size={AppSizes.Icon_Height_25}
            color={theme.colors.white}
          />
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: AppSizes.Padding_Horizontal_15,

    paddingTop: 24,
    paddingBottom: 12,
    borderBottomLeftRadius: AppSizes.Radius_30,
    borderBottomRightRadius: AppSizes.Radius_30,
    // backgroundColor moved to inline style in component
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  backText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
  },
  id: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    //marginTop: 2,
  },
  rightSection: {
    marginLeft: 12,
  },
});
