import { API_Config } from '../../services/apiServices';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/slices/authSlice';
import { Alert } from 'react-native';

export const useLoginUser = () => {
  const [credentials, setCredentials] = useState({ empId: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (field: string, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
  };

  const handleLogin = async (values: { empId: string; password: string }) => {
    console.log('Logging in with', values);
    setIsLoading(true);

    try {
      const response = await API_Config.loginUser(
        values.empId,
        values.password,
      );
      console.log('API Response:', response);

      // ✅ Correct check for success

      if (response?.data?.status) {
        dispatch(
          loginSuccess({ data: response.data, token: response.data.token }),
        );
        console.log('Login successfulss:', response.data.designation);
      } else {
        Alert.alert('Login Failed', 'Please check your credentials.');
        console.log('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
      setCredentials({ empId: '', password: '' });
    }
  };

  return { credentials, handleChange, handleLogin, isLoading };
};
