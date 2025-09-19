import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Basescreen from '../../Resuseable/BaseScreen'
import { Colors } from '../../Theme/Color'
import PrimaryHeader from '../../Resuseable/Components/Header/PrimaryHeader'
import MyInput from '../../Resuseable/Components/InputField/MyInput'
import { AppSizes } from '../../Theme/appsizes'
import { Fonts } from '../../Theme/Fonts'
import Icon from '../../Resuseable/Icon'

const ProfileScreen = () => {
    return (
        <Basescreen scroable={true} statusBarColor={Colors.secondary}>
            <PrimaryHeader headerText='Profile' mainDashboard={false} />


            <View style={{
                flex: 1,
                justifyContent: 'center',
                rowGap: AppSizes.Gap_30, marginHorizontal: AppSizes.Margin_Horizontal_20
            }}>

                    <ProfilePic
                    imageurl={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXQ8ie4kYhfvtBIsEJ8JHmZUh8Iz2TxeN53g&s'}
                    username='Manager'
                    />
                <MyInput
                    label={'Name'}
                    value=''
                    onchangetext={() => { }}
                    editabe={false}
                    placeholder='Manger'
                    icontype={'Ionicons'}
                    iconname={'lock-closed-outline'}
                />
                <MyInput
                    label={'Email'}
                    value=''
                    onchangetext={() => { }}
                    editabe={false}
                    placeholder='manager123@gmail.com'
                    icontype={'Ionicons'}
                    iconname={'mail-outline'}
                />
                <MyInput
                    label={'Company ID'}
                    value=''
                    onchangetext={() => { }}
                    editabe={false}
                    placeholder='Company ID'
                    icontype={'Ionicons'}
                    iconname={'id-card-outline'}
                />


            </View>

        </Basescreen>
    )
}

export default ProfileScreen



interface profilePics {
  username : string,
  imageurl : _SourceUri | string
}

export const ProfilePic = ({ username, imageurl }: profilePics) => {

  return (
    <View style={styles.profileWrapper}>
      <View style={styles.profileContainer}>
        <View style={{ position: 'relative' }}>
          <Image
            source={{ uri: `${imageurl}` }}
            style={[styles.profileImage, { borderColor: Colors.black }]}
          />
          <TouchableOpacity style={[styles.editIcon, { backgroundColor: Colors.secondary }]}>
            <Icon type="Ionicons" name="pencil" color={Colors.white} size={12} />
          </TouchableOpacity>
        </View>
        <Text style={[styles.profileName, { color: Colors.black }]}>{username}</Text>

      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  profileWrapper: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 999,
  },
  profileContainer: {
    padding: AppSizes.Padding_Horizontal_15,
    alignItems: 'center',
    borderRadius: 60,
  },
  profileImage: {
    borderColor: '#000',
    borderWidth: 2,
    width: 130,
    height: 130,
    borderRadius: 70,
    resizeMode: 'cover',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRadius: 10,
    padding: 4,
  },
  profileName: {
    fontSize: AppSizes.Font_16,
    fontFamily: Fonts.SemiBold,
  },
  profileEmail: {
    fontSize: AppSizes.Font_10,
    color: 'gray',
  },

})