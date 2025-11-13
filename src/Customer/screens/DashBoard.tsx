import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    Touchable,
    TouchableOpacity,
    View,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import MainHeader from '../../components/common/MainHeader';
import { Card } from '../../components/common';
import { AppSizes } from '../../utils/AppSizes';
import { useTheme } from '../../hooks/useTheme';
import { fonts } from '../../assets/fonts/Fonts';
import { data } from './data';
import { useNavigation } from '@react-navigation/native';

const DashBoard = () => {
    const { theme } = useTheme();
    const [isExpended, setIsExpended] = useState(false);
    const items = data.invoices;

    const navigation = useNavigation();

    const renderInvoice = ({ item }: { item: any }) => {
        console.log('Rendering item:', item);

        // if (!item?.receiptDate || item?.receiptDate === 'N/A') {
        //   return null;
        // }

        return (
            <View
                // key={index}
                style={{
                    flexGrow: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    // backgroundColor: '#f9f9f9',
                    backgroundColor: theme.colors.gray200,
                    paddingVertical: 10,
                    paddingHorizontal: 15,
                    marginHorizontal: 15,
                    borderRadius: 8,
                    marginVertical: 5,
                    shadowColor: '#000',
                    shadowOpacity: 0.1,
                    shadowRadius: 3,
                    elevation: 2,
                }}
            >
                <View style={{ flexDirection: 'row', columnGap: 25 }}>
                    <Text
                        style={{
                            // flex: 1,
                            color: theme.colors.black,
                            fontSize: AppSizes.Font_14,
                            fontFamily: fonts.medium,
                        }}
                    >
                        {item.paidAmount}
                    </Text>

                    <Text
                        style={{
                            // flex: 1,
                            color: theme.colors.black,
                            fontSize: AppSizes.Font_14,
                            fontFamily: fonts.medium,
                        }}
                    >
                        {item?.dueDate || 'N/A'}
                    </Text>

                    <Text
                        style={{
                            // flex: 1,
                            color: theme.colors.black,
                            fontSize: AppSizes.Font_14,
                            fontFamily: fonts.medium,
                        }}
                    >
                        {item?.totalInstallment || 'N/A'}
                    </Text>

                    <Text
                        style={{
                            // flex: 1,
                            color: theme.colors.black,
                            fontSize: AppSizes.Font_14,
                            fontFamily: fonts.medium,
                        }}
                    >
                        {item?.installmentDue || 'N/A'}
                    </Text>

                    <Text
                        style={{
                            // flex: 1,
                            color: theme.colors.black,
                            fontSize: AppSizes.Font_14,
                            fontFamily: fonts.medium,
                        }}
                    >
                        {item?.status || 'N/A'}
                    </Text>

                    <Text
                        style={{
                            // flex: 1,
                            color: theme.colors.black,
                            fontSize: AppSizes.Font_14,
                            fontFamily: fonts.medium,
                        }}
                    >
                        {item?.remarks || 'N/A'}
                    </Text>
                    <Text
                        style={{
                            // flex: 1,
                            color: theme.colors.black,
                            fontSize: AppSizes.Font_14,
                            fontFamily: fonts.medium,
                        }}
                    >
                        {item?.branch || 'N/A'}
                    </Text>

                    <View
                        style={{
                            backgroundColor: 'green',
                            padding: 5,
                            borderRadius: 5,
                            //flex: 1,
                            width: 25,
                            marginHorizontal: 20,
                        }}
                    ></View>
                </View>
            </View>
        );
    };

    const renderInvoice1 = ({ item }: { item: any }) => {
        console.log('Rendering item:', item);

        // if (!item?.receiptDate || item?.receiptDate === 'N/A') {
        //   return null;
        // }

        const statusColor = getStatusColor(item?.status);


        function getStatusColor(status: string) {
            switch (status) {
                case 'Paid':
                    return 'green';
                case 'current month due':
                    return 'yellow';
                case 'Overdue':
                    return 'red';
                default:
                    return 'gray';
            }
        };


        return (
            <View
                // key={index}
                style={{
                    flexGrow: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    // backgroundColor: '#f9f9f9',
                    backgroundColor: theme.colors.gray200,
                    paddingVertical: 10,
                    paddingHorizontal: 5,
                    marginHorizontal: 15,
                    borderRadius: 8,
                    marginVertical: 5,
                    shadowColor: '#000',
                    shadowOpacity: 0.1,
                    shadowRadius: 3,
                    elevation: 2,
                }}
            >
                <View style={{ flex: 1 }}>
                    <View>
                        {/* heading s view */}
                        <View
                            style={{
                                flexDirection: 'row',
                                marginVertical: 2,
                                backgroundColor: theme.colors.secondaryLight,
                                borderRadius: 8,
                                padding: 5,
                                alignItems: 'center'
                            }}
                        >

                            <Text
                                style={{
                                    flex: 2,
                                    color: theme.colors.black,
                                    fontSize: AppSizes.Font_14,
                                    fontFamily: fonts.medium,
                                }}
                            >
                                Due Date
                            </Text>

                            <Text
                                style={{
                                    flex: 1,
                                    color: theme.colors.black,
                                    fontSize: AppSizes.Font_14,
                                    fontFamily: fonts.medium,
                                }}
                            >
                                Status
                            </Text>
                            <Text
                                style={{
                                    flex: 1,
                                    color: theme.colors.black,
                                    fontSize: AppSizes.Font_14,
                                    fontFamily: fonts.medium,
                                }}
                            >
                                Pay
                            </Text>
                        </View>

                        <View
                            style={{
                                flexDirection: 'row',
                                marginVertical: AppSizes.Margin_Horizontal_5,
                            }}
                        >
                            <Text
                                style={{
                                    flex: 2,
                                    color: theme.colors.black,
                                    fontSize: AppSizes.Font_14,
                                    fontFamily: fonts.medium,
                                }}
                            >
                                {item?.dueDate || 'N/A'}
                            </Text>

                            <Text
                                style={{
                                    flex: 1,
                                    color: statusColor,
                                    fontSize: AppSizes.Font_14,
                                    fontFamily: fonts.medium,
                                }}
                            >
                                {item?.status || 'N/A'}
                            </Text>

                            <View style={{flex:1}}>
                                <View
                                style={{
                                    // position: 'absolute',
                                    // top :55,
                                    // right: 0,
                                    //bottom: 20,
                                    backgroundColor: 'green',
                                    padding: 13,
                                    borderRadius: 5,
                                    //flex: 1,
                                    width: 25,
                                    marginHorizontal: 20,
                                }}
                            ></View>
                            </View>
                        </View>
                    </View>

                    {/* <View style={{height:2,backgroundColor:theme.colors.black,width:'100%'}}></View> */}

                    <View>
                        {/* heading views */}
                        <View
                            style={{
                                flexDirection: 'row',
                                marginVertical: AppSizes.Margin_Horizontal_5,
                                backgroundColor: theme.colors.secondaryLight,
                                borderRadius: 8,
                                padding: 5
                            }}
                        >
                            <Text
                                style={{
                                    flex: 2,
                                    color: theme.colors.black,
                                    fontSize: AppSizes.Font_14,
                                    fontFamily: fonts.medium,
                                }}
                            >
                                Total
                            </Text>

                                 <Text
                                style={{
                                    flex: 1,
                                    color: theme.colors.black,
                                    fontSize: AppSizes.Font_14,
                                    fontFamily: fonts.medium,
                                }}
                            >
                                Paid
                            </Text>


                            <Text
                                style={{
                                    flex: 1,
                                    color: theme.colors.black,
                                    fontSize: AppSizes.Font_14,
                                    fontFamily: fonts.medium,
                                }}
                            >
                                Due
                            </Text>
                        </View>

                        {/* values views */}
                        <View
                            style={{
                                flexDirection: 'row',
                                marginVertical: AppSizes.Margin_Horizontal_5,
                            }}
                        >
                            <Text
                                style={{
                                    flex: 2,
                                    color: theme.colors.black,
                                    fontSize: AppSizes.Font_14,
                                    fontFamily: fonts.medium,
                                }}
                            >
                                {item?.totalInstallment || 'N/A'}
                            </Text>
                            

                            <Text
                                style={{
                                    flex: 1,
                                    color: theme.colors.black,
                                    fontSize: AppSizes.Font_14,
                                    fontFamily: fonts.medium,
                                }}
                            >
                                {item.paidAmount}
                            </Text>
                            <Text
                                style={{
                                    flex: 1,
                                    color: theme.colors.black,
                                    fontSize: AppSizes.Font_14,
                                    fontFamily: fonts.medium,
                                }}
                            >
                                {item?.installmentDue || 'N/A'}
                            </Text>

                        </View>
                    </View>
                </View>

            </View>
        );
    };

    //     const renderInvoice1 = ({ item }: { item: any }) => {
    //   //console.log('Rendering item:', item);

    //   // Determine color based on status



    //   return (
    //     <View
    //       style={{
    //         flexGrow: 1,
    //         flexDirection: 'row',
    //         alignItems: 'center',
    //         justifyContent: 'space-between',
    //         backgroundColor: theme.colors.gray200,
    //         paddingVertical: 10,
    //         paddingHorizontal: 5,
    //         marginHorizontal: 15,
    //         borderRadius: 8,
    //         marginVertical: 5,
    //         shadowColor: '#000',
    //         shadowOpacity: 0.1,
    //         shadowRadius: 3,
    //         elevation: 2,
    //       }}
    //     >
    //       <View style={{ flex: 1 }}>
    //         {/* ===== Top Row ===== */}
    //         <View>
    //           <View
    //             style={{
    //               flexDirection: 'row',
    //               marginVertical: 2,
    //               backgroundColor: theme.colors.secondaryLight,
    //               borderRadius: 8,
    //               padding: 5,
    //               alignItems: 'center',
    //             }}
    //           >
    //             <Text
    //               style={{
    //                 flex: 1,
    //                 color: theme.colors.black,
    //                 fontSize: AppSizes.Font_14,
    //                 fontFamily: fonts.medium,
    //               }}
    //             >
    //               Paid
    //             </Text>

    //             <Text
    //               style={{
    //                 flex: 1.5,
    //                 color: theme.colors.black,
    //                 fontSize: AppSizes.Font_14,
    //                 fontFamily: fonts.medium,
    //               }}
    //             >
    //               Total Installment
    //             </Text>

    //             <Text
    //               style={{
    //                 flex: 2,
    //                 color: theme.colors.black,
    //                 fontSize: AppSizes.Font_14,
    //                 fontFamily: fonts.medium,
    //               }}
    //             >
    //               Due Date
    //             </Text>
    //           </View>

    //           {/* ===== Values ===== */}
    //           <View
    //             style={{
    //               flexDirection: 'row',
    //               marginVertical: AppSizes.Margin_Horizontal_5,
    //             }}
    //           >
    //             <Text
    //               style={{
    //                 flex: 1,
    //                 color: theme.colors.black,
    //                 fontSize: AppSizes.Font_14,
    //                 fontFamily: fonts.medium,
    //               }}
    //             >
    //               {item?.paidAmount || 'N/A'}
    //             </Text>

    //             <Text
    //               style={{
    //                 flex: 1.5,
    //                 color: theme.colors.black,
    //                 fontSize: AppSizes.Font_14,
    //                 fontFamily: fonts.medium,
    //               }}
    //             >
    //               {item?.totalInstallment || 'N/A'}
    //             </Text>

    //             <Text
    //               style={{
    //                 flex: 2,
    //                 color: theme.colors.black,
    //                 fontSize: AppSizes.Font_14,
    //                 fontFamily: fonts.medium,
    //               }}
    //             >
    //               {item?.dueDate || 'N/A'}
    //             </Text>
    //           </View>
    //         </View>

    //         {/* ===== Installment Section ===== */}
    //         <View>
    //           <View
    //             style={{
    //               flexDirection: 'row',
    //               marginVertical: AppSizes.Margin_Horizontal_5,
    //               backgroundColor: theme.colors.secondaryLight,
    //               borderRadius: 8,
    //               padding: 5,
    //             }}
    //           >
    //             <Text
    //               style={{
    //                 flex: 1.5,
    //                 color: theme.colors.black,
    //                 fontSize: AppSizes.Font_14,
    //                 fontFamily: fonts.medium,
    //               }}
    //             >
    //               Installment Due
    //             </Text>

    //             <Text
    //               style={{
    //                 flex: 1,
    //                 color: theme.colors.black,
    //                 fontSize: AppSizes.Font_14,
    //                 fontFamily: fonts.medium,
    //               }}
    //             >
    //               Status
    //             </Text>
    //           </View>

    //           <View
    //             style={{
    //               flexDirection: 'row',
    //               marginVertical: AppSizes.Margin_Horizontal_5,
    //               alignItems: 'center',
    //             }}
    //           >
    //             <Text
    //               style={{
    //                 flex: 1.5,
    //                 color: theme.colors.black,
    //                 fontSize: AppSizes.Font_14,
    //                 fontFamily: fonts.medium,
    //               }}
    //             >
    //               {item?.installmentDue || 'N/A'}
    //             </Text>

    //             <View
    //               style={{
    //                 flex: 1,
    //                 flexDirection: 'row',
    //                 alignItems: 'center',
    //                 gap: 6,
    //               }}
    //             >
    //               {/* Status color dot */}
    //               <View
    //                 style={{
    //                   width: 12,
    //                   height: 12,
    //                   borderRadius: 6,
    //                   backgroundColor: statusColor,
    //                 }}
    //               />
    //               <Text
    //                 style={{
    //                   color: statusColor,
    //                   fontSize: AppSizes.Font_14,
    //                   fontFamily: fonts.medium,
    //                 }}
    //               >
    //                 {item?.status || 'N/A'}
    //               </Text>
    //             </View>
    //           </View>
    //         </View>
    //       </View>
    //     </View>
    //   );
    // };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <MainHeader title="Coustomer" subTitle="C-11-2" />

            <ScrollView
                nestedScrollEnabled
                contentContainerStyle={{
                    paddingHorizontal: AppSizes.Padding_Horizontal_10,
                    paddingVertical: AppSizes.Padding_Vertical_5,
                    rowGap: AppSizes.Margin_Horizontal_20,
                }}
            >
                <Card
                    style={{ marginTop: AppSizes.Margin_Horizontal_20 }}
                    onPress={() => navigation.navigate('Profile')}
                >
                    <View
                        style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}
                    >
                        <Image
                            resizeMode="contain"
                            source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT09OjTZ_jsL_Se31E5J-sJyBi4kJfmaKbX2A&s' }}
                            style={{ height: 100, width: 100, borderRadius: 10 }}
                        ></Image>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text
                                style={{
                                    color: theme.colors.secondaryDark,
                                    fontSize: AppSizes.Font_14,
                                    fontFamily: fonts.semiBold,
                                }}
                            >
                                Customer Name
                            </Text>
                            <Text
                                style={{
                                    color: theme.colors.secondaryDark,
                                    fontSize: AppSizes.Font_14,
                                    fontFamily: fonts.semiBold,
                                }}
                            >
                                Father Name
                            </Text>
                            <Text
                                style={{
                                    color: theme.colors.secondaryDark,
                                    fontSize: AppSizes.Font_14,
                                    fontFamily: fonts.semiBold,
                                }}
                            >
                                Branch Name
                            </Text>
                        </View>
                    </View>

                    <Text
                        style={{
                            color: theme.colors.gray600,
                            fontSize: AppSizes.Font_14,
                            fontFamily: fonts.semiBold,
                            textAlign: 'right',
                            textDecorationLine: 'underline',
                        }}
                    >
                        see detials
                    </Text>
                </Card>

                <Card style={{}}>
                    <View style={{ justifyContent: 'center' }}>
                        <Text
                            style={{
                                color: theme.colors.secondaryDark,
                                fontFamily: fonts.semiBold,
                                fontSize: AppSizes.Font_18,
                                textAlign: 'center',
                                // marginTop: AppSizes.Font_20,
                                textDecorationLine: 'underline',
                            }}
                        >
                            Key Performance Indecator
                        </Text>
                        <View
                            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
                        >
                            <Text
                                style={{
                                    color: theme.colors.secondaryDark,
                                    fontSize: AppSizes.Font_14,
                                    fontFamily: fonts.semiBold,
                                }}
                            >
                                Products
                            </Text>
                            <Text
                                style={{
                                    color: theme.colors.gray600,
                                    fontSize: AppSizes.Font_14,
                                    fontFamily: fonts.medium,
                                }}
                            >
                                {' '}
                                Inverter
                            </Text>
                        </View>
                        <View
                            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
                        >
                            <Text
                                style={{
                                    color: theme.colors.secondaryDark,
                                    fontSize: AppSizes.Font_14,
                                    fontFamily: fonts.semiBold,
                                }}
                            >
                                Total
                            </Text>
                            <Text
                                style={{
                                    color: theme.colors.gray600,
                                    fontSize: AppSizes.Font_14,
                                    fontFamily: fonts.medium,
                                }}
                            >
                                {' '}
                                Inverter
                            </Text>
                        </View>

                        <View
                            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
                        >
                            <Text
                                style={{
                                    color: theme.colors.secondaryDark,
                                    fontSize: AppSizes.Font_14,
                                    fontFamily: fonts.semiBold,
                                }}
                            >
                                Balance
                            </Text>
                            <Text
                                style={{
                                    color: theme.colors.gray600,
                                    fontSize: AppSizes.Font_14,
                                    fontFamily: fonts.medium,
                                }}
                            >
                                {' '}
                                Inverter
                            </Text>
                        </View>
                    </View>
                    <Text
                        style={{
                            color: theme.colors.secondaryDark,
                            fontSize: AppSizes.Font_18,
                            fontFamily: fonts.semiBold,
                            textAlign: 'center',
                            marginTop: AppSizes.Font_20,
                            textDecorationLine: 'underline',
                        }}
                    >
                        Current Month Details
                    </Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginTop: AppSizes.Margin_Vertical_20,
                        }}
                    >
                        <View
                            style={[
                                styles.cardtitle,
                                { backgroundColor: theme.colors.secondaryDark },
                            ]}
                        >
                            <Text style={styles.cardSubtitle}>Total</Text>
                            <Text
                                style={{ color: theme.colors.white, fontFamily: fonts.medium }}
                            >
                                10000
                            </Text>
                        </View>
                        <View
                            style={[
                                styles.cardtitle,
                                { backgroundColor: theme.colors.success },
                            ]}
                        >
                            <Text style={styles.cardSubtitle}>Paid</Text>
                            <Text style={{ color: 'white', fontFamily: fonts.medium }}>
                                20000
                            </Text>
                        </View>

                        <View
                            style={[
                                styles.cardtitle,
                                { backgroundColor: theme.colors.warning },
                            ]}
                        >
                            <Text style={styles.cardSubtitle}>Due</Text>
                            <Text style={{ color: 'white', fontFamily: fonts.medium }}>
                                20000
                            </Text>
                        </View>
                    </View>
                </Card>

                <ScrollView
                    style={
                        {
                            // flex: 1,
                        }
                    }
                >
                    <TouchableOpacity
                        style={{
                            padding: 20,
                            backgroundColor: theme.colors.secondaryDark,
                            borderRadius: AppSizes.Radius_10,
                        }}
                        onPress={() => setIsExpended(!isExpended)}
                    >
                        <Text
                            style={{
                                color: theme.colors.white,
                                fontFamily: fonts.medium,
                                fontSize: AppSizes.Font_16,
                                textAlign: 'center'
                            }}
                        >
                            AC
                        </Text>
                    </TouchableOpacity>

                    {isExpended ? (
                        <ScrollView horizontal>
                            <View
                                style={{ backgroundColor: theme.colors.gray300, padding: 5 }}
                            >
                                <View
                                    // key={index}
                                    style={{
                                        flexGrow: 1,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        // backgroundColor: '#f9f9f9',
                                        backgroundColor: theme.colors.secondaryLight,
                                        paddingVertical: 10,
                                        paddingHorizontal: 15,
                                        marginHorizontal: 15,
                                        borderRadius: 8,
                                        marginVertical: 15,
                                        shadowColor: '#000',
                                        shadowOpacity: 0.1,
                                        shadowRadius: 3,
                                        elevation: 2,
                                    }}
                                >
                                    <View style={{ flexDirection: 'row', columnGap: 20 }}>
                                        <Text
                                            style={{
                                                // flex: 1,
                                                color: theme.colors.black,
                                                fontSize: AppSizes.Font_14,
                                                fontFamily: fonts.medium,
                                            }}
                                        >
                                            paid Amount
                                        </Text>

                                        <Text
                                            style={{
                                                // flex: 1,
                                                color: theme.colors.black,
                                                fontSize: AppSizes.Font_14,
                                                fontFamily: fonts.medium,
                                            }}
                                        >
                                            dueDate
                                        </Text>

                                        <Text
                                            style={{
                                                // flex: 1,
                                                color: theme.colors.black,
                                                fontSize: AppSizes.Font_14,
                                                fontFamily: fonts.medium,
                                            }}
                                        >
                                            total Installment
                                        </Text>

                                        <Text
                                            style={{
                                                // flex: 1,
                                                color: theme.colors.black,
                                                fontSize: AppSizes.Font_14,
                                                fontFamily: fonts.medium,
                                            }}
                                        >
                                            installment Due
                                        </Text>

                                        <Text
                                            style={{
                                                // flex: 1,
                                                color: theme.colors.black,
                                                fontSize: AppSizes.Font_14,
                                                fontFamily: fonts.medium,
                                            }}
                                        >
                                            status
                                        </Text>

                                        <Text
                                            style={{
                                                // flex: 1,
                                                color: theme.colors.black,
                                                fontSize: AppSizes.Font_14,
                                                fontFamily: fonts.medium,
                                            }}
                                        >
                                            remarks
                                        </Text>
                                        <Text
                                            style={{
                                                // flex: 1,
                                                color: theme.colors.black,
                                                fontSize: AppSizes.Font_14,
                                                fontFamily: fonts.medium,
                                            }}
                                        >
                                            branch
                                        </Text>
                                    </View>
                                </View>

                                {items.map((item, index) => {
                                    return renderInvoice({ item });
                                    // return (
                                    //   <View style={{ flexDirection: 'column' }}>
                                    //     {renderInvoice({ item })}
                                    //   </View>
                                    // );
                                })}
                            </View>
                        </ScrollView>
                    ) : null}

                    <View style={{ backgroundColor: 'black', height: 2, marginVertical: 20 }}></View>

                    {isExpended ? (
                        <ScrollView contentContainerStyle={{}}>
                            {items.map((item, index) => {
                                return renderInvoice1({ item });
                                // return (
                                //   <View style={{ flexDirection: 'column' }}>
                                //     {renderInvoice({ item })}
                                //   </View>
                                // );
                            })}
                        </ScrollView>
                    ) : null}
                </ScrollView>
            </ScrollView>
        </SafeAreaView>
    );
};

export default DashBoard;

const styles = StyleSheet.create({
    cardtitle: {
        alignItems: 'center',

        padding: AppSizes.Padding_Vertical_10,
        borderRadius: AppSizes.Radius_8,
        paddingHorizontal: AppSizes.Padding_Horizontal_30,
        rowGap: 5,
    },
    cardSubtitle: {
        fontSize: AppSizes.Font_16,
        fontFamily: fonts.medium,
        // fontWeight: 'bold',
        color: 'white',
    },
});
