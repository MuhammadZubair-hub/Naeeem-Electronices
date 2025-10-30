import { API_Config } from '../../services/apiServices';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/slices/authSlice';
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

    try {
      const response = await API_Config.loginUser(
        values.empId.trim(),
        values.password.trim(),
      );
      //console.log('API Response:', response);

      if (response?.data?.status) {
        const role = response.data.data.designation;
        const fullAuth = response.data.data.fullAuth;
        //console.log('User Role:', role);
        //console.log('Full Auth:', fullAuth);

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

  return { credentials, handleChange, handleLogin, isLoading };
};
