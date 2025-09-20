import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Modal } from './Modal';
import { useTheme } from '../../hooks/useTheme';

interface LoadingModalProps {
  visible: boolean;
  message?: string;
}

export const LoadingModal: React.FC<LoadingModalProps> = ({
  visible,
  message = 'Loading...',
}) => {
  const { theme } = useTheme();

  return (
    <Modal
      visible={visible}
      onClose={() => {}}
      showCloseButton={false}
      animationType="fade"
    >
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.message, { color: theme.colors.textPrimary }]}>
          {message}
        </Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  message: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    marginTop: 16,
    textAlign: 'center',
  },
});
