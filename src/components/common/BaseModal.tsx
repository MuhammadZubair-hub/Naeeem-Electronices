import React, { ReactNode, useState } from 'react';
import { Modal, View, ScrollView, StyleSheet, Text, ActivityIndicator } from 'react-native';

import LottieView from 'lottie-react-native';
import { useTheme } from '../../hooks/useTheme';
import Ionicons from '@react-native-vector-icons/ionicons';
import { AppSizes } from '../../utils/AppSizes';
import { fonts } from '../../assets/fonts/Fonts';


interface BaseModalProps {
  headerText: string,
  visible: boolean,
  onClose: () => void,
  children: ReactNode,
  modalHeight?: string,

}


const BaseModal = ({
  headerText,
  visible = false,
  onClose,
  children,
  modalHeight = '90%',
}: BaseModalProps) => {
  const { theme } = useTheme();

  // const [showmodal,setShowModal] = useState(false);
  // const handleShowModal = ( ) =>{
  //   setShowModal(prev => (!prev));
  // }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.modalOverlay]}>
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
      </View>
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

    borderTopRightRadius: AppSizes.Radius_20,

    //borderTopWidth: 2,
    padding: AppSizes.Padding_Horizontal_10,
    width: '100%',
  },

})