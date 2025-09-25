import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import Ionicons from '@react-native-vector-icons/ionicons';
import { AppSizes } from '../../utils/AppSizes';

interface MainHeaderProps {
  title: string;
}

const MainHeader: React.FC<MainHeaderProps> = ({ title }) => {
  const navigation = useNavigation();
  const { theme } = useTheme();

  return (
    <View style={[styles.header, { backgroundColor: theme.colors.secondary }]}>
      <TouchableOpacity
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        style={styles.menuButton}
        accessibilityLabel="Open drawer"
      >
        <Ionicons name="menu" size={28} color={theme.colors.white} />
      </TouchableOpacity>
      <Text style={[styles.title, { color: theme.colors.white }]}>{title}</Text>
      <View style={{ width: 28 }} />
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
    flex: 1,
    fontSize: AppSizes.Font_20,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
  },
});

export default MainHeader;
