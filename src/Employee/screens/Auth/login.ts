import { Region, Zone } from './../../../types/index';
import { API_Config } from '../../services/apiServices';

import DeviceInfo from 'react-native-device-info';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../../redux/slices/authSlice';
import { CommonStyles } from '../../../styles/GlobalStyle';
import { showMessage } from 'react-native-flash-message';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

export const useLoginUser = () => {
  const [credentials, setCredentials] = useState({ empId: '', password: '' });
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

  useFocusEffect(
    React.useCallback(() => {
      const fetchDeviceId = async () => {
        EmptyCredentials();
        const id = await getDeviceId();
        setDeviceId(id as any);
      };

      fetchDeviceId();
    }, []),
  );

  const handleLogin = async (values: { empId: string; password: string }) => {
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
      const response = await API_Config.loginUser(
        values.empId.trim(),
        values.password.trim(),
        deviceId,
      );
      console.log('API Response:', response);

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
