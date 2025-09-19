import { ActivityIndicator, Modal, View } from "react-native";
import { Colors } from "../../../Theme/Color";
import { scale } from "../../../Theme/resposive";

interface LoadingModalProps {
  visible: boolean,
}

export const LoadingBaseModal = (
  {

    visible = false,
  }: LoadingModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType='none'
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <View style={{
          backgroundColor: Colors.white, borderColor: Colors.black, shadowColor: Colors.secondary, borderRadius: scale(10),
          shadowOpacity: 0.9,
          elevation: 9,
          padding: scale(35),
          width: '45%',
          justifyContent: 'center'
        }}>
          <ActivityIndicator size={'large'} color={Colors.secondary} />
        </View>
      </View>
    </Modal>
  )
}