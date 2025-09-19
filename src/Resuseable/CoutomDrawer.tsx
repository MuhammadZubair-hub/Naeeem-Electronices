import React, { ReactNode, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, ViewStyle } from 'react-native';



import { DrawerContentComponentProps } from '@react-navigation/drawer';
import Icon from './Icon';
import { Colors } from '../Theme/Color';
import { verticalScale } from '../Theme/resposive';
import { AppSizes } from '../Theme/appsizes';
import { Fonts } from '../Theme/Fonts';
import { useDispatch } from 'react-redux';
import { setUserToken } from '../utils/Shared/UserSlice';


const CustomDrawer = (props: DrawerContentComponentProps) => {

    return (
        <View style={styles.container}>
            <View style={styles.profileContainer}>
                <View style={{ position: 'relative' }}>
                    <Image
                        source={{ uri: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXQ8ie4kYhfvtBIsEJ8JHmZUh8Iz2TxeN53g&s` }}
                        style={styles.profileImage}
                    />
                    {/* <TouchableOpacity style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        backgroundColor: '#007BFF',
                        borderRadius: 10,
                        padding: 4
                    }}>
                        <Icon type='MaterialIcons' name="pencil" color="#fff" size={12} />
                    </TouchableOpacity> */}
                </View>
                <Text style={styles.profileName}>Manager</Text>
                <Text style={styles.profileEmail}>manger123@gmail.com</Text>
            </View>
            <View style={[styles.menuContainer, { backgroundColor: Colors.white }]}>
                <ScrollView
                    contentContainerStyle={{ rowGap: verticalScale(20) }}
                    showsVerticalScrollIndicator={false}>
                    <DrawerItem icon="dashboard" label="Dashboard"
                        onPress={() => props.navigation.navigate('UserDahsboard')} />
                    <DrawerItem icon="person" label="Profile"
                        onPress={() => props.navigation.navigate('ProfileScreen')} />
                    {/* <DrawerItem icon="clipboard-list" label="Setup"
                        onPress={() => props.navigation.navigate('Home', { screen: 'Setup' })}
                    />
                    <DrawerItem icon="cart" label="Orders"
                        onPress={() => props.navigation.navigate('Home', { screen: 'Orders' })}
                    />
                    <DrawerItem icon="file-document" label="Report"
                        onPress={() => props.navigation.navigate('Home', { screen: 'Reports' })}
                    /> */}
                    <View style={styles.divider} />

                    {/* <DrawerItem type={'MaterialCommunityIcons'}
                        onPress={()=>setThemeModal(prev=>!prev)}
                        icon={theme == 'dark' ? 'white-balance-sunny' : "weather-night"}
                        label={theme == 'dark' ? "Light Mode" : 'Dark Mode'} /> */}


                    <DrawerItem icon="settings" label="Settings" onPress={() => { }} />
                    {/* <DrawerItem icon="help-circle-outline" label="Help and Support" onPress={() => { }} /> */}

                    <View style={styles.divider} />
                </ScrollView>

                <Logout />

            </View>
        </View>
    );
};


interface DrawerItemProps {
    icon: string,
    label: string,
    type?: 'MaterialIcons' | 'Ionicons',
    onPress: () => void,
    renderRightComponent?: ReactNode
}

const DrawerItem = ({ icon, label, type = 'MaterialIcons', onPress, renderRightComponent }: DrawerItemProps) => {


    return (

        <TouchableOpacity style={styles.drawerItem} onPress={onPress}  >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon type={type} name={icon} size={AppSizes.Icon_Height_25} color={Colors.secondary} style={styles.drawerIcon} />
                <Text style={styles.drawerText}>{label}</Text>
            </View>
            {renderRightComponent}
        </TouchableOpacity>
    );
}

interface LogoutBtn {
    justifyContent?: ViewStyle['justifyContent']
}

export const Logout = ({ justifyContent }: LogoutBtn) => {
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(setUserToken(null));
    }

    return (
        <TouchableOpacity style={[styles.logoutContainer, { justifyContent: justifyContent }]}
            onPress={() => handleLogout()}
        >
            <Icon type={'MaterialIcons'} name="logout" size={AppSizes.Icon_Height_25} color="red" />
            <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#D6E5F0',
        borderTopRightRadius: 30,
        borderBottomRightRadius: 30,
    },
    profileContainer: {
        flex: 2,
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingVertical: verticalScale(20),
        paddingLeft: verticalScale(20)
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: Colors.white,
        resizeMode: 'contain'
    },
    profileName: {
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 10,
    },
    profileEmail: {
        fontSize: 14,
        color: '#555',
    },
    menuContainer: {
        flex: 8,
        justifyContent: 'space-between',
        //backgroundColor: '#FFFFFF',
        //borderTopRightRadius: 30,
        borderBottomRightRadius: 30,
        paddingHorizontal: verticalScale(9),
        paddingVertical: verticalScale(12),
    },
    drawerItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: verticalScale(5),
    },
    drawerIcon: {
        marginRight: 15,
    },
    drawerText: {

        //textAlign: 'center',
        fontSize: AppSizes.Font_16,
        marginTop: 4,
        fontWeight: '500',
        color: Colors.black,
        fontFamily: Fonts.Medium
    },
    divider: {
        height: 1,
        backgroundColor: Colors.primaryDark,
        marginVertical: AppSizes.Margin_Vertical_5,
    },
    logoutContainer: {

        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    logoutText: {
        color: 'red',
        marginLeft: 10,
        fontSize: AppSizes.Font_16,
        fontWeight: 'bold',
    },
});

export default CustomDrawer;
