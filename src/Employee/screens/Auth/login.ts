import { API_Config } from '../../services/apiServices';

import DeviceInfo from 'react-native-device-info';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { CommonStyles } from '../../../styles/GlobalStyle';
import { showMessage } from 'react-native-flash-message';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';
import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';
import { loginSuccess } from '../../../redux/slices/authSlice';
import { markSessionStartedByLogin } from '../../../hooks/useSessionTimeout';

export const useLoginUser = () => {
  const [credentials, setCredentials] = useState({ empId: '', password: '' });
  const [coordinates, setCoordinates] = useState({ latitude: 0, longitude: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [deviceId, setDeviceId] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [ipAddress, setIpAddress] = useState('');

  const dispatch = useDispatch();
  const navigation: any = useNavigation();

  const handleChange = (field: string, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
  };

  const EmptyCredentials = () => {
    setCredentials({ empId: '', password: '' });
  };

  const getDeviceId = async () => {
    try {
      const uniqueId = await DeviceInfo.getUniqueId();

      // return 'a77a54bf13da6f87';
      return uniqueId;
    } catch (error) {
      console.error('Error getting device ID:', error);
      return null;
    }
  };

  const getDeviceName = async () => {
    try {
      const deviceName = await DeviceInfo.getDeviceName();
      console.log('🚀 ~ :37 ~ getDeviceId ~ deviceName:', deviceName);
      return deviceName;
    } catch (error) {
      console.error('Error getting device ID:', error);
      return null;
    }
  };

  const getIPAddress = async () => {
    try {
      const response = await fetch('https://api.ipify.org');
      const ip = await response.text();
      console.log('🚀 ~ :49 ~ getIPAddress ~ ip:', ip);
      setIpAddress(ip);
      return ip;
    } catch (error) {
      console.error('Error getting IP address:', error);
      return '';
    }
  };

  const getCurrCorrdinates = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return;
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        console.log('Coordinates are : ', latitude, longitude);
        setCoordinates({ latitude, longitude });
        // getLocationNameFromCoordinates(latitude, longitude);
      },
      error => {
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  const getLocationNameFromCoordinates = async (lat: any, lon: any) => {
    try {
      setIsLoading(true);
      console.log('here: ', lat, lon);
      // lat = '37.421998'
      // lon = '-122.084'
      // For iOS and newer Android versions
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'Naeem_Electronics/1.0', // Add this - it's required!
            Accept: 'application/json',
          },
        },
      );

      console.log('Response status:', response);
      console.log('Response headers:', response.headers);

      // Check if response is OK
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response body:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text(); // Get as text first to see what's coming
      console.log('Raw response:', text.substring(0, 200)); // Log first 200 chars
      console.log('Text is :', text);
      // Try to parse JSON
      try {
        const data = JSON.parse(text);
        if (data && data.display_name) {
          console.log('Loaction is ', data.display_name);
          return data.display_name;
        }
        return 'Unknown Location';
      } catch (parseError) {
        console.log('JSON parse error. Raw response:', text);
        return 'Location name unavailable';
      }
    } catch (error: any) {
      console.log('Geocoding error:', error.message);
      return 'Location name unavailable';
    } finally {
      setIsLoading(false);
    }
  };

  const showSettingsAlert = (message: string) => {
    Alert.alert(
      'Location Required',
      message,
      [
        {
          text: 'Open Settings',
          onPress: () => Linking.openSettings(),
        },
      ],
      { cancelable: false },
    );
  };

  const requestLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'ios') {
      const auth = await Geolocation.requestAuthorization('whenInUse');
      if (auth === 'granted') return true;

      showSettingsAlert(
        'Location access is required to use this app. Please enable it in Settings.',
      );
      return false;
    }

    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app requires your location to proceed.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) return true;

      if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        showSettingsAlert(
          'Location permission is permanently denied. Please enable it in Settings to continue.',
        );
      } else {
        Alert.alert(
          'Location Required',
          'Location access is required to use this app. Please grant the permission to proceed.',
          [
            {
              text: 'Grant Permission',
              onPress: () => getCurrCorrdinates(),
            },
          ],
          { cancelable: false },
        );
      }
      return false;
    }

    return false;
  };

  useFocusEffect(
    React.useCallback(() => {
      const init = async () => {
        EmptyCredentials();
        const id = await getDeviceId();
        setDeviceId(id as any);
        const dname = await getDeviceName();
        setDeviceName(dname as any);
        await getIPAddress();
      };

      init();
      getCurrCorrdinates();
    }, []),
  );

  const handleLogin = async (values: { empId: string; password: string }) => {
    // await getIPAddress();

    if (ipAddress === '') {
      showMessage({
        message: 'Network Error',
        description:
          'Unable to obtain IP address, Please check your network and restart the app',
        type: 'danger',
        style: CommonStyles.error,
      });
      return;
    }
    if (!values.empId || !values.password) {
      showMessage({
        message: 'Validation Error',
        description: 'Please enter both User ID and Password',
        type: 'danger',
        style: CommonStyles.error,
      });
      return;
    }
    if (coordinates.latitude === 0) {
      showMessage({
        message: 'Permission Error',
        description: 'Please allow Location Permision to Proceed',
        type: 'danger',
        style: CommonStyles.error,
      });
      return;
    }
    setIsLoading(true);

    console.log(
      'Sending values to API: ',
      values.empId.trim(),
      values.password.trim(),
      deviceId,
      ipAddress,
      coordinates.latitude.toString(),
      coordinates.longitude.toString(),
      deviceName,
      'N',
    );

    const payloadforOTP = {
      employeeId: values.empId.trim(),
      password: values.password.trim(),
      deviceId: deviceId,
      ipAddress: ipAddress,
      latitude: coordinates.latitude.toString(),
      longitude: coordinates.longitude.toString(),
      deviceName,
      verified: 'Y',
    };

    // console.log('payloadforOTP: ', payloadforOTP);

    try {
      const response = await API_Config.loginUser(
        values.empId.trim(),
        values.password.trim(),
        deviceId,
        ipAddress,
        coordinates.latitude.toString(),
        coordinates.longitude.toString(),
        deviceName,
        'N',
      );

      // const response:any = {
      //   data: {
      //     status: true,
      //     message: 'EmployeeInfo retrieved successfully.',
      //     data: {
      //       empId: '1',
      //       firstName: 'Naeemer Afzal',
      //       active: 'Y',
      //       password: '1234',
      //       designation: 'RCO',
      //       region: '',
      //       zone: '',
      //       branch: 'HO',
      //       assignedId: '1',
      //       fullAuth: 'N',
      //       macAddress: '62eaea749334d89d',
      //     },
      //   },
      // };

      console.log('Login API Response:', response);
      if (response?.data?.status) {
        const role = response?.data?.data?.designation;
        const Region = response?.data?.data?.region;
        const Zone = response?.data?.data?.zone;
        const fullAuth = response?.data?.data?.fullAuth;
        console.log('User Role:', role);
        //console.log('Full Auth:', fullAuth);

        // if (Region == 'N/A') {
        //   showMessage({
        //     message: 'Logged in Failed',
        //     description: 'You do not have permission to access the apps',
        //     type: 'danger',
        //     style: CommonStyles.error,
        //   });
        //   return;
        // }
        // if (Zone == 'N/A') {
        //   showMessage({
        //     message: 'Logged in Failed',
        //     description: 'You do not have permission to access the app',
        //     type: 'danger',
        //     style: CommonStyles.error,
        //   });
        //   return;
        // }

        if (
          /// have to confirm role in otp andwell
          role !== 'Master Admin' &&
          role !== 'CEO' &&
          role !== 'RM' &&
          role !== 'ZM' &&
          role !== 'AGM' &&
          role !== 'Area General Manager' &&
          role !== 'AVO' &&
          role !== 'AVM' &&
          fullAuth !== 'Y'
        ) {
          if (fullAuth == 'N') {
            showMessage({
              message: 'Access Denied',
              description: 'You are not Authorised.',
              type: 'danger',
              style: CommonStyles.error,
            });
            return;
          } else {
            console.log('ere');
            showMessage({
              message: 'Access Denied',
              description: 'You are not Authorised.',
              type: 'danger',
              style: CommonStyles.error,
            });
            return;
          }
        }

        if (response?.data?.message === 'Please Verify OTP') {
          navigation.navigate('otp', {
            res: response?.data?.data,
            payloadforOTP,
          });
        } else {
          markSessionStartedByLogin();
          dispatch(
            loginSuccess({ data: response.data, token: response.data.token }),
          );
          showMessage({
            message: 'Logged in successfully',
            type: 'success',
            style: CommonStyles.sucsses,
          });
        }
      } else {
        console.log('in else');
        if (response?.data?.message === 'Please Verify OTP') {
          const role = response?.data?.data?.design;
          const fullAuth = response?.data?.data?.auth;
          console.log(role, fullAuth);
          if (
            role !== 'Master Admin' &&
            role !== 'CEO' &&
            role !== 'RM' &&
            role !== 'ZM' &&
            role !== 'AGM' &&
            role !== 'Area General Manager' &&
            role !== 'AVM' &&
            role !== 'AVO' &&
            fullAuth !== 'Y'
          ) {
            if (fullAuth == 'N') {
              console.log('objects  1');
              showMessage({
                message: 'Access Denied',
                description: 'You are not Authorised.',
                type: 'danger',
                style: CommonStyles.error,
              });
              return;
            } else {
              console.log('objects');
              showMessage({
                message: 'Access Denied',
                description: 'You are not Authorised.',
                type: 'danger',
                style: CommonStyles.error,
              });
              return;
            }
          }

          navigation.navigate('otp', {
            // res: '03000734015',
            res: response?.data?.data?.mobile,
            payloadforOTP,
          });
          showMessage({
            message: 'Please Verify OTP',
            type: 'success',
            style: CommonStyles.sucsses,
          });
        } else {
          // EmptyCredentials();
          showMessage({
            message: 'Logged in Failed',
            description:
              response?.data?.message || 'Login failed. Please try again.',
            type: 'danger',
            style: CommonStyles.error,
          });
        }
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (empId: string, newPassword: string) => {
    if (!empId || !newPassword) {
      showMessage({
        message: 'Validation Error',
        description: 'Please enter both User ID and New Password',
        type: 'danger',
        style: CommonStyles.error,
      });
      return;
    }
    setIsLoading(true);

    console.log('coming data is : ', empId.trim(), newPassword.trim());

    const user = empId.trim();
    const pswd = newPassword.trim();

    try {
      const response = await API_Config.updateUserPassword(user, pswd);

      console.log('Login API Response:', response);

      if (response?.data?.status) {
        console.log('response is : ', response.data);

        setCredentials({ empId: '', password: '' });

        showMessage({
          message: 'Password Updated',
          description: response?.data?.message || 'Your password is update',
          type: 'success',
          style: CommonStyles.sucsses,
        });

        // navigation.goBack();
        navigation.navigate('MainAuth');
      } else {
        console.log('erroosssr: ', response?.data?.message);
        showMessage({
          message: 'Logged in Failed',
          description:
            response?.data?.message || 'Login failed. Please try again.',
          type: 'danger',
          style: CommonStyles.error,
        });
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    credentials,
    handleChange,
    handleLogin,
    isLoading,
    handleUpdatePassword,
    ipAddress,
  };
};
