import React from 'react';
import { View,  Modal } from 'react-native';

import { useTheme } from '../../hooks/useTheme';
import LottieView from 'lottie-react-native';

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
    <Modal visible={visible} transparent={true} animationType="none">
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            backgroundColor: 'white',
            borderColor: 'black',
            shadowColor: theme.colors.secondary,
            borderRadius: 10,
            shadowOpacity: 0.9,
            elevation: 9,
            //padding: AppSizes.Gap_30,
            width: '35%',
            justifyContent: 'center',
          }}
        >
          <LottieView
            source={require('../../assets/Loader/newLoader.json')}
            autoPlay
            loop
            style={{ width: 100, height: 100, alignSelf: 'center' }}
          />

           </View>
      </View>
    </Modal>
  );
};


