// hooks/useBackHandler.ts
import { useCallback } from 'react';
import { BackHandler, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

interface BackHandlerOptions {
  message?: string;
  title?: string;
  cancelText?: string;
  confirmText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export const useBackHandler = (options: BackHandlerOptions = {}) => {
  const {
    title = '',
    message = 'Do you want to exit the app?',
    cancelText = 'Cancel',
    confirmText = 'YES',
    onConfirm = () => BackHandler.exitApp(),
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
