// hooks/useBackHandler.ts
import { useCallback } from 'react';
import { BackHandler, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';

interface BackHandlerOptions {
  message?: string;
  title?: string;
  cancelText?: string;
  confirmText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export const useBackHandler = (options: BackHandlerOptions = {}) => {
  const dispatch = useDispatch();

  const {
    title = 'Hold On',
    message = 'Do you want to exit the app?',
    cancelText = 'Cancel',
    confirmText = 'YES',
    onConfirm = () => { dispatch(logout()); BackHandler.exitApp(); },
    onCancel = () => null,
  } = options;

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        Alert.alert(
          title,
          message,
          [
            {
              text: cancelText,
              onPress: onCancel,
              style: 'cancel',
            },
            {
              text: confirmText,
              onPress: onConfirm,
            },
          ],
          { cancelable: true },
        );
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      return () => backHandler.remove();
    }, [title, message, cancelText, confirmText, onConfirm, onCancel]),
  );
};
