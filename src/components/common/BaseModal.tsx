import React, { ReactNode, useState } from 'react';
import { Modal, View, ScrollView, StyleSheet, Text, ActivityIndicator } from 'react-native';

import LottieView from 'lottie-react-native';
import { useTheme } from '../../hooks/useTheme';
import Ionicons from '@react-native-vector-icons/ionicons';
import { AppSizes } from '../../utils/AppSizes';
import { fonts } from '../../assets/fonts/Fonts';
import { SafeAreaView } from 'react-native-safe-area-context';


interface BaseModalProps {
  headerText: string,
  visible: boolean,
  onClose: () => void,
  children: ReactNode,
  modalHeight?: any,

}


const BaseModal = ({
  headerText,
  visible = false,
  onClose,
  children,
  modalHeight = '90%',
}: BaseModalProps) => {
  const { theme } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView  style={[styles.modalOverlay]}>
        <View style={[styles.modalContainer, { backgroundColor: theme.colors.white, borderColor: theme.colors.secondaryDark, maxHeight: modalHeight, }
        ]}>


          <View style={{ justifyContent: 'space-between', flexDirection: 'row', padding: 5 }}>
            <Text style={{ fontSize: AppSizes.Font_16, fontFamily: fonts.semiBold, color: theme.colors.secondaryDark }}>{headerText}</Text>
            <Ionicons
              name="close"
              onPress={onClose}
              color={'red'}
              size={AppSizes.Icon_Height_30}
            />
          </View>
          {children}


        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default BaseModal;



const styles = StyleSheet.create({

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: AppSizes.Radius_20,
    // height:'100%',

    borderTopRightRadius: AppSizes.Radius_20,

    //borderTopWidth: 2,
    padding: AppSizes.Padding_Horizontal_10,
    width: '100%',
  },

})