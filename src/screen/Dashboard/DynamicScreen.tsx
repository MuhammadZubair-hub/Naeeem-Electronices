import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import Basescreen from '../../Resuseable/BaseScreen';
import PrimaryHeader from '../../Resuseable/Components/Header/PrimaryHeader';
import { Colors } from '../../Theme/Color';
import { AppSizes } from '../../Theme/appsizes';
import { Fonts } from '../../Theme/Fonts';
import Icon from '../../Resuseable/Icon';
import { scale } from '../../Theme/resposive';
import BaseModal from '../../Resuseable/Components/BaseModal';

type AVM = {
    AVM_name: string;
    AVM_total_AD: string;
    AVM_total_In: string;
    AVM_total_AR: string;
};

type Branch = {
    name: string;
    B_total_AD: string;
    B_total_In: string;
    B_total_AR: string;
    B_AVO: string;
    B_AVM: AVM[];
};

type RootStackParamList = {
    DynamicScreen: {
        branches: Branch[];
    };
};

type DynamicScreenRouteProp = RouteProp<RootStackParamList, 'DynamicScreen'>;

const DynamicScreen = () => {
    const route = useRoute<DynamicScreenRouteProp>();
    const { branches } = route.params;
    const [expandedBranches, setExpandedBranches] = useState<Record<string, boolean>>({});
    const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    const toggleBranch = (branchName: string) => {
        setExpandedBranches(prev => ({
            ...prev,
            [branchName]: !prev[branchName]
        }));
    };

    const handleBranchPress = (branch: Branch) => {
        setSelectedBranch(branch);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedBranch(null);
    };

    return (
        <Basescreen scroable>
            <PrimaryHeader headerText='All branches Data' />
            {branches.map((item) => (
                <View key={item.name}>
                    <TouchableOpacity
                        style={styles.branchmainContainer}
                        onPress={() => toggleBranch(item.name)}
                    >
                        <Text style={styles.branchmainContainerText}>
                            {item.name}
                        </Text>
                        <View style={{ alignSelf: 'center' }}>
                            <Icon
                                type='MaterialIcons'
                                name={expandedBranches[item.name] ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                                size={scale(30)}
                                color={Colors.white}
                            />
                        </View>
                    </TouchableOpacity>

                    {expandedBranches[item.name] && (
                        <View style={styles.expandedBranchmainContainer}>
                            <TouchableOpacity
                                style={styles.expandedBranchSubContainer}
                                onPress={() => handleBranchPress(item)}
                            >
                                <View style={styles.rowView}>
                                    <Text style={styles.expandedText1}>Area Verification Officer :</Text>
                                    <Text style={styles.expandedText2}>{item.B_AVO}</Text>
                                </View>
                                <View style={styles.rowView}>
                                    <Text style={styles.expandedText1}>Total Invoices :</Text>
                                    <Text style={styles.expandedText2}>{item.B_total_In}</Text>
                                </View>
                                <View style={styles.rowView}>
                                    <Text style={styles.expandedText1}>Total Amount Received :</Text>
                                    <Text style={[styles.expandedText2, { color: 'green' }]}>{item.B_total_AR}</Text>
                                </View>
                                <View style={styles.rowView}>
                                    <Text style={styles.expandedText1}>Total Amount Due :</Text>
                                    <Text style={[styles.expandedText2, { color: 'red' }]}>{item.B_total_AD}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            ))}

            <BaseModal visible={modalVisible} onClose={closeModal} headerText={selectedBranch?.name || ''}>
                {selectedBranch && (
                    <View style={{ padding: 10 }}>

                        <View style={{ rowGap: AppSizes.Gap_10 }}>
                            <View style={styles.rowView}>
                                <Text style={{ color: Colors.black, fontSize: AppSizes.Font_16, fontFamily: Fonts.SemiBold }}>Area Verification Officer:</Text>
                                <Text>{selectedBranch.B_AVO}</Text>
                            </View>
                            <View style={styles.rowView}>
                                <Text style={[styles.expandedText1, { color: Colors.black }]}>Total Invoices:</Text>
                                <Text style={styles.expandedText2}>{selectedBranch.B_total_In}</Text>
                            </View>
                            <View style={styles.rowView}>
                                <Text style={{ color: Colors.black, fontSize: AppSizes.Font_14, fontFamily: Fonts.SemiBold }}>Total Amount Received:</Text>
                                <Text style={[styles.expandedText2, { color: 'green' }]}>{selectedBranch.B_total_AR}</Text>
                            </View>

                            <View style={styles.rowView}>
                                <Text style={{ color: Colors.black, fontSize: AppSizes.Font_14, fontFamily: Fonts.SemiBold }}>Total Amount Due:</Text>
                                <Text style={[styles.expandedText2, { color: 'red' }]}>{selectedBranch.B_total_AD}</Text>
                            </View>
                        </View>

                        {selectedBranch.B_AVM.length > 0 && (
                            <ScrollView
                                style={{ marginTop: 15 }}
                                contentContainerStyle={{ rowGap: 10 }}
                            >
                                <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>AVM Details:</Text>
                                {selectedBranch.B_AVM.map((avm, index) => (
                                    <View style={{
                                        borderWidth: 1,
                                        borderColor: Colors.primaryDark,
                                        borderRadius: AppSizes.Radius_15,
                                        width: "100%",
                                        //alignSelf: 'center',
                                    }}>
                                        <View key={index} style={styles.expandedBranchSubContainer}>
                                            <Text style={[styles.expandedText1, { fontSize: AppSizes.Font_14 }]}>{avm.AVM_name}</Text>
                                            <View style={styles.rowView}>
                                                <Text style={[styles.expandedText1, { fontSize: AppSizes.Font_14 }]}>Total Invoices:</Text>
                                                <Text style={styles.expandedText2}>{avm.AVM_total_In}</Text>
                                            </View>
                                            <View style={styles.rowView}>
                                                <Text style={[styles.expandedText1, { fontSize: AppSizes.Font_14 }]}>Total Amount Received:</Text>
                                                <Text style={[styles.expandedText2, { color: 'green' }]}>{avm.AVM_total_AR}</Text>
                                            </View>
                                            <View style={styles.rowView}>
                                                <Text style={[styles.expandedText1, { fontSize: AppSizes.Font_14 }]}>Total Amount Due:</Text>
                                                <Text style={[styles.expandedText2, { color: 'red' }]}>{avm.AVM_total_AD}</Text>
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </ScrollView>
                        )}
                    </View>
                )}
            </BaseModal>
        </Basescreen>
    );
};

export default DynamicScreen;

const styles = StyleSheet.create({
    branchmainContainer: {
        backgroundColor: Colors.secondary,
        borderRadius: AppSizes.Radius_15,
        alignSelf: 'center',
        justifyContent: 'space-between',
        width: '95%',
        marginVertical: AppSizes.Margin_Vertical_10,
        paddingHorizontal: AppSizes.Padding_Horizontal_10,
        flexDirection: 'row'
    },
    branchmainContainerText: {
        color: Colors.white,
        fontFamily: Fonts.SemiBold,
        fontSize: AppSizes.Font_18,
        textAlign: 'center',
        marginLeft: AppSizes.Margin_Vertical_10,
        paddingVertical: AppSizes.Padding_Vertical_15,
    },
    expandedBranchmainContainer: {
        borderWidth: 1,
        borderColor: Colors.primaryDark,
        borderRadius: AppSizes.Radius_15,
        width: "95%",
        alignSelf: 'center',
    },
    expandedBranchSubContainer: {
        alignSelf: 'center',
        width: "98%",
        backgroundColor: '#DBEDFF',
        marginVertical: AppSizes.Margin_Vertical_5,
        padding: AppSizes.Padding_Horizontal_10,
        borderRadius: AppSizes.Radius_15,
    },
    rowView: { flexDirection: 'row', justifyContent: 'space-between' },
    expandedText1: { color: Colors.primaryDark, fontSize: AppSizes.Font_12, fontFamily: Fonts.SemiBold },
    expandedText2: { color: Colors.secondary, fontSize: AppSizes.Font_12, fontFamily: Fonts.SemiBold }
});