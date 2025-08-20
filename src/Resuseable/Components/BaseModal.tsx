import React, { ReactNode, useState } from 'react';
import { Modal, View,StyleSheet, Text, ViewStyle,} from 'react-native';
import { Colors } from '../../Theme/Color';
import { Fonts } from '../../Theme/Fonts';
import { AppSizes } from '../../Theme/appsizes';
import Icon from '../Icon';
import { scale } from '../../Theme/resposive';



interface BaseModalProps {
  headerText: string,
  visible: boolean,
  onClose: () => void,
  children: ReactNode,
  modalHeight?: ViewStyle['height'],

}

const BaseModal = ({
  headerText,
  visible = false,
  onClose,
  children,
  modalHeight = '90%',
}: BaseModalProps) => {
  

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.modalOverlay]}>
        <View style={[styles.modalContainer, { backgroundColor: Colors.white, borderColor: Colors.primaryDark, maxHeight: modalHeight, }
        ]}>


          <View style={{ justifyContent: 'space-between', flexDirection: 'row', padding: 5 }}>
            <Text style={{ fontSize: AppSizes.Font_16, fontFamily: Fonts.SemiBold, color: Colors.secondary }}>{headerText}</Text>
            <Icon
              name="close"
              type="Ionicons"
              onPress={onClose}
              color={'red'}
              size={scale(30)}
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
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: AppSizes.Radius_30,
    borderTopRightRadius: AppSizes.Radius_30,
    borderWidth: 2,
    padding:10,
    width: '100%',
  },

})