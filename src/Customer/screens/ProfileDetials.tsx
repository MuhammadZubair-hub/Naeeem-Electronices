import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../components/common/Header';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import { AppSizes } from '../../utils/AppSizes';
import { fonts } from '../../assets/fonts/Fonts';

const ProfileDetails = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();

  // Dummy profile data (later bind with backend API)
  const customer = {
    code: 'C-1-12',
    name: 'Naeem Ahmed',
    cnic: '42101-9876543-1',
    phone: '+92 300 1234567',
    email: 'naeem.ahmed@example.com',
    branch: 'Karachi Main Branch',
    branchContact: '+92 21 34567890',
    image: require('../../assets/images/logo.png'),
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header
        title="Profile Details"
        onBackPress={() => navigation.goBack()}
        showBackButton
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        {/* Profile Picture Section */}
        <View style={styles.profileWrapper}>
          <Image
            source={customer.image}
            style={[styles.profileImage, { borderColor: theme.colors.secondaryDark }]}
          />
          <Text style={[styles.profileName, { color: theme.colors.black }]}>
            {customer.name}
          </Text>
          <Text style={[styles.customerCode, { color: theme.colors.gray700 }]}>
            {customer.code}
          </Text>
        </View>

        {/* Information Section */}
        <View style={[styles.infoCard, { backgroundColor: theme.colors.white, shadowColor: theme.colors.shadow }]}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>CNIC</Text>
            <Text style={styles.value}>{customer.cnic}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Phone Number</Text>
            <Text style={styles.value}>{customer.phone}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{customer.email}</Text>
          </View>
        </View>

        <View style={[styles.infoCard, { backgroundColor: theme.colors.white, shadowColor: theme.colors.shadow }]}>
          <Text style={styles.sectionTitle}>Branch Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Branch Name</Text>
            <Text style={styles.value}>{customer.branch}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Contact Details</Text>
            <Text style={styles.value}>{customer.branchContact}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  profileWrapper: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  profileImage: {
    borderWidth: 3,
    width: AppSizes.Margin_Vertical_100 + 20,
    height: AppSizes.Margin_Vertical_100 + 20,
    borderRadius: 80,
    resizeMode: 'cover',
  },
  profileName: {
    fontSize: AppSizes.Font_18,
    fontFamily: fonts.bold,
    marginTop: 10,
  },
  customerCode: {
    fontSize: AppSizes.Font_14,
    fontFamily: fonts.medium,
    marginTop: 2,
  },
  infoCard: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 16,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: AppSizes.Font_16,
    fontFamily: fonts.semiBold,
    color: '#444',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontFamily: fonts.medium,
    color: '#666',
    fontSize: AppSizes.Font_14,
  },
  value: {
    fontFamily: fonts.semiBold,
    color: '#111',
    fontSize: AppSizes.Font_14,
  },
});
