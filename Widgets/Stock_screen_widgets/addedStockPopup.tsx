// this is the screen that pops up when the user wants to add a stock or clicks on the add stock button , here the user will be able to add the stocks they needs by searching for it or by clicking on the trending stock

import { Modal, View, Text, Button, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';
import colors from "D:\\PROJECTS\\The-Chat-App\\Assets\\colors.js";


import { getAuth } from '@react-native-firebase/auth';
import { getFirestore, collection, doc, addDoc, setDoc } from "@react-native-firebase/firestore";


// there are the code for accessing the data in the db , not used yet may come into use 
// const addStockToDb = async (pressed: any) => {

//     const fireBaseUser = getAuth();
//     const db = getFirestore()
//     const loggedinUser = fireBaseUser.currentUser?.uid;
//     // console.warn(loggedinUser)
//     const stockName = pressed.name
//     console.log(pressed.name)
//     console.log(pressed.price)
//     // code to access the doc inside the db and add the data into the doc of the users db
//     if (loggedinUser) {
//         try {

//             await setDoc(
//                 doc(db, "Users", loggedinUser!, "Agents", "Finance", "Stock_Added", pressed.name), // the name of each doc has been added to be as the stock name that was clicked on
//                 {
//                     stockName: pressed.name,
//                     stockPrice: pressed.price,
//                     addedDate: new Date().toLocaleString()
//                 }
//             );


//         }
//         catch (error) {
//             console.warn(error)
//         }
//     }

// }

const Popupmessage = ({stockName , stockPrice ,buttonText1, buttonText2, visible, onClose}: {stockName:any, stockPrice:any ,buttonText1: any, buttonText2: any, visible: any, onClose: any }) => {

    return (
        // this is modal where we get the popup like feature so never remove the modal tag
        <Modal visible={visible} animationType="fade" transparent>
            <View style={modalStyle.mainParent}>
                <View style={modalStyle.parentContainer}>

                    {/* displays the heading , STOCK NAME */}
                    <View style = {modalStyle.headingDesign}>
                        <Text style={modalStyle.fontcolor}>{stockName}</Text>
                    </View>
                    

                    {/* with the help of the stock array parameter passed form the addstocksoptions.tsx */}
                    <View >
                            <View style={modalStyle.stockNameAndPrice}>
                                <Text style={modalStyle.stockName}>ADDED PRICE</Text>
                                <Text style={modalStyle.stockPrice}>₹{stockPrice}</Text>
                            </View>

                            <View style={modalStyle.stockNameAndPrice}>
                                <Text style={modalStyle.stockName}>ADDED DATE</Text>
                                <Text style={modalStyle.stockPrice}>12-NOV-25</Text>
                            </View>

                            <View style={modalStyle.stockNameAndPrice}>
                                <Text style={modalStyle.stockName}>TODAY'S PRICE</Text>
                                <Text style={modalStyle.stockPrice}>₹28750</Text>
                            </View>
                    </View>


                    {/* button to close the pop up message */}
                    <View style={modalStyle.buttonsPlacement}>
                        <TouchableOpacity style={modalStyle.buttonDesign} onPress={onClose}>
                            <Text style={modalStyle.buttonText}>{buttonText1}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={modalStyle.buttonDesign} onPress={onClose}>
                            <Text style={modalStyle.buttonText}>{buttonText2}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal >
    );
};


const modalStyle = StyleSheet.create({
    fontcolor: {
        color: colors.primary,
        fontFamily: "Jura-Bold",
        fontSize: 25,

        marginLeft: 10,
        marginRight: 10
    },

    mainParent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.8)'
    },

    parentContainer: {
        //height kept auto here
        height: "auto",
        width: 300,
        backgroundColor: colors.secondary,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: colors.gradient_secondary,

        display: 'flex',
        // alignItems: 'center',
        // justifyContent: 'center'
    },

    headingDesign : {
        display : "flex", 
        alignItems: 'center',
    },

    stockDetailsDesign : {
        display : "flex", 
        alignItems: 'flex-start',
    },

    buttonDesign: {
        backgroundColor: colors.gradient_secondary,
        height: 35,
        width: 90,
        borderRadius: 15,
        margin: 15,

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

        borderWidth: 2,
        borderColor: colors.primary
    },


    stockNameAndPrice: {
        // backgroundColor: "#000000",
        color: "#ffffff",
        padding: 5,
        margin: 4,
        borderRadius: 20,
        display : "flex",
        flexDirection : "row",
        gap : 20, 
    },
    stockName: {
        backgroundColor: "#000000",
        color: "#ffffff",
        padding: 10,
        margin: 4,
        borderRadius: 20,
    },
    stockPrice: {
        backgroundColor : "#5F48F5",
        color: "#ffffff",
        padding: 10,
        margin: 4,
        borderRadius: 20,
    },

    buttonsPlacement: {
        display: "flex",
        flexDirection: "row"
    },

    buttonText: {
        color: colors.secondary,
        fontFamily: "Jura-Bold",
        fontSize: 15,
    },


})

export default Popupmessage;