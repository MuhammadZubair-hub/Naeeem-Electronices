import { Region, Zone } from './../../../types/index';
import { API_Config } from '../../services/apiServices';

import DeviceInfo from 'react-native-device-info';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../../redux/slices/authSlice';
import { CommonStyles } from '../../../styles/GlobalStyle';
import { showMessage } from 'react-native-flash-message';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';
import { colors } from '../../../styles/theme';
import { PermissionsAndroid, Platform } from 'react-native';
import { G } from 'react-native-svg';
import { LineGraph } from '../../../components/charts/LineGraph';

export const useLoginUser = () => {
  const [credentials, setCredentials] = useState({ empId: '', password: '' });
  const [coordinates, setCoordinates] = useState({ latitude: 0, longitude: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const navigation = useNavigation();
  const handleChange = (field: string, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
  };
  const EmptyCredentials = () => {
    setCredentials({ empId: '', password: '' });
  };

  const [deviceId, setDeviceId] = useState('');

  const getDeviceId = async () => {
    try {
      // // For Android - returns Android ID
      // const androidId = await DeviceInfo.getAndroidId();
      // console.log('Android ID:', androidId);

      // // For both platforms - device specific ID
      // const deviceId = DeviceInfo.getDeviceId();
      // console.log('Device ID:', deviceId);

      //    // Instance ID (for Android)
      // const instanceId = await DeviceInfo.getInstanceId();
      // console.log('Instance ID:', instanceId);

      // Unique ID (varies by platform)
      const uniqueId = await DeviceInfo.getUniqueId();
      // console.log('Unique ID:', uniqueId);

      return uniqueId;
    } catch (error) {
      console.error('Error getting device ID:', error);
      return null;
    }
  };

  const getCurrCorrdinates = async () => {
    const hasPermission = await requestLocationPermission();

    if (!hasPermission) return;
    await Geolocation.getCurrentPosition(
      position => {
        console.log('Coordinates are : ', position);
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );

    getLocationNameFromCoordinates(coordinates.latitude, coordinates.longitude);
  };

  const getLocationNameFromCoordinates = async (lat, lon) => {
    try {
      console.log('here');
      // For iOS and newer Android versions
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'YourAppName/1.0', // Add this - it's required!
            Accept: 'application/json',
          },
        },
      );

      console.log('Response status:', response.status);
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
    } catch (error) {
      console.log('Geocoding error:', error.message);
      return 'Location name unavailable';
    }
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const auth = await Geolocation.requestAuthorization('whenInUse');
      return auth === 'granted';
    }

    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchDeviceId = async () => {
        EmptyCredentials();
        const id = await getDeviceId();
        setDeviceId(id as any);
      };

      fetchDeviceId();
      getCurrCorrdinates();
    }, []),
  );

  const handleLogin = async (values: { empId: string; password: string }) => {
    console.log('Corr: ', coordinates);
    if (!values.empId || !values.password) {
      showMessage({
        message: 'Validation Error',
        description: 'Please enter both User ID and Password',
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
    );

    try {
      // const response = await API_Config.loginUser(
      //   values.empId.trim(),
      //   values.password.trim(),
      //   deviceId,
      // );
      // console.log('API Response:', response);

      const response = {
        data: {
          status: true,
          message: 'EmployeeInfo retrieved successfully.',
          data: {
            empId: '1',
            firstName: 'Naeem Afzal',
            active: 'Y',
            password: '1234',
            designation: 'CEO',
            region: '',
            zone: '',
            branch: 'HO',
            assignedId: '1',
            fullAuth: 'Y',
            macAddress: '7c755e6c3af45fda',
          },
        },
      };

      if (response?.data?.status) {
        console.log('API Responsesdfsdfdssdfdsf');
        const role = response.data.data.designation;
        const Region = response.data.data.region;
        const Zone = response.data.data.zone;
        const fullAuth = response.data.data.fullAuth;
        console.log('User Role:', role);
        //console.log('Full Auth:', fullAuth);

        if (Region == 'N/A') {
          showMessage({
            message: 'Logged in Failed',
            description: 'You do not have permission to access the apps',
            type: 'danger',
            style: CommonStyles.error,
          });
          return;
        }
        if (Zone == 'N/A') {
          showMessage({
            message: 'Logged in Failed',
            description: 'You do not have permission to access the apps',
            type: 'danger',
            style: CommonStyles.error,
          });
          return;
        }

        if (
          role !== 'RM' &&
          role !== 'ZM' &&
          role !== 'AVM' &&
          role !== 'AVO'
        ) {
          if (fullAuth == 'N') {
            showMessage({
              message: 'Access Denied',
              description: 'You do not have access to this application.',
              type: 'danger',
              style: CommonStyles.error,
            });
            return;
          }
        }

        dispatch(
          loginSuccess({ data: response.data, token: response.data.token }),
        );
        showMessage({
          message: 'Logged in successfully',
          type: 'success',
          style: CommonStyles.sucsses,
        });
        setCredentials({ empId: '', password: '' });
      } else {
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

      console.log('API Response:', response);

      if (response?.data?.status) {
        console.log('response is : ', response.data);

        setCredentials({ empId: '', password: '' });

        showMessage({
          message: 'Password Updated',
          description: response?.data?.message || 'Your password is update',
          type: 'success',
          style: CommonStyles.sucsses,
        });

        navigation.goBack();
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
  };
};
