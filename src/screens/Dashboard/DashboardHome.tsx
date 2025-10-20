import { View, ActivityIndicator, ImageBackground } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Role } from '../../types';
import { screenName } from '../../navigation/ScreenName';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../navigation/AppNavigator';
import Loader from '../../components/common/Loader';

export const DashboardHome: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user) {
      // ensure navigation happens after initial render
      setTimeout(() => {
        navigateToRoleDashboard();
      }, 1000);
    }
  }, [user]);

  const navigateToRoleDashboard = () => {
    if (!user) return;

    console.log('user role in DashboardHome:', user);
    const designation = user?.designation?.toUpperCase();
    console.log('user designation in DashboardHome:', designation);

    switch (designation) {
      case Role.CEO:
      case Role.GM:
        navigation.navigate(screenName.CEO_GM_Dashboard);
        console.log('first case');
        break;
      case Role.RM:
      case Role.ZM:
        navigation.navigate(screenName.RM_ZM_Dashboard);
        break;
      case Role.BR:
        navigation.navigate(screenName.BR_AVO_Dashboard);
        break;
      case Role.AVO:
        navigation.navigate(screenName.AVO_AllCustomers);
        break;
      default:
        navigation.navigate(screenName.AVO_AllCustomers);
    }
  };

  // loader until redirect
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Loader />
    </View>
    
  );
};


