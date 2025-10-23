import { API_Config } from '../../services/apiServices';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/slices/authSlice';
import { Alert } from 'react-native';
import { CommonStyles } from '../../styles/GlobalStyle';
import { showMessage } from 'react-native-flash-message';

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

      if (response?.data?.status) {

        const role = response.data.data.designation ;

        if(role !== 'CEO' && role !== 'GM' && role !== 'RM' && role !== 'ZM' && role !== 'AVM' && role !== 'AVO'){
          // Alert.alert(
          //   'Access Denied',
          //   'You do not have permission to access this application.',
          //   [{ text: 'OK', onPress: () => null }],
          //   { cancelable: true },
          // );

          showMessage({
            message: 'Access Denied',
            description: `You do not have permission to access this application.`,
            type: 'danger',
            style: CommonStyles.error,
          });
          return;
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
        //console.log('Login successfulss:', response.data.designation);
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

  return { credentials, handleChange, handleLogin, isLoading };
};
