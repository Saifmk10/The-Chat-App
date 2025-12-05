// this is the screen that pops up when the user wants to add a stock or clicks on the add stock button , here the user will be able to add the stocks they needs by searching for it or by clicking on the trending stock

import { Modal, View, Text, Button, TouchableOpacity, StyleSheet, TextInput, ScrollView ,  } from 'react-native';
import colors from "D:\\PROJECTS\\The-Chat-App\\Assets\\colors.js";
import DeleteLogo from '../../Assets/images/agents/stockAgent/deleteLogo';
import AddedStocksList from './addedStocksList';

import { getAuth } from '@react-native-firebase/auth';
import { getFirestore, collection, doc, addDoc, setDoc, deleteDoc } from "@react-native-firebase/firestore";
import React from 'react';


// there are the code for accessing the data in the db , not used yet may come into use 
const delStockDetails = async (pressed: any) => {

    const fireBaseUser = getAuth();
    const db = getFirestore()
    const loggedinUser = fireBaseUser.currentUser?.uid;
    console.log("TO DELETE DATA FROM addedStockPopUp.tsx",pressed)
    // code to del the data from the database when the button is clicked
    if (loggedinUser) {
        try {

            await deleteDoc(
                doc(db, "Users", loggedinUser!, "Agents", "Finance", "Stock_Added", pressed) // the name of each doc has been added to be as the stock name that was clicked on
            );
            console.log("DATA WAS DELETED")
            // AddedStocksList()

        }
        catch (error) {
            console.warn(error)
        }
    }

}

const Popupmessage = ({ stockName, stockPrice, buttonText1, buttonText2, visible, onClose }: { stockName: any, stockPrice: any, buttonText1: any, buttonText2: any, visible: any, onClose: any }) => {

    return (
        // this is modal where we get the popup like feature so never remove the modal tag
        <Modal visible={visible} animationType="fade" transparent>
            <View style={modalStyle.mainParent}>
                <View style={modalStyle.parentContainer}>

                    {/* displays the heading , STOCK NAME */}
                    <View style={modalStyle.headingDesign}>
                        <Text style={modalStyle.fontcolor}>{stockName}</Text>
                    </View>


                    {/* with the help of the stock array parameter passed form the addstocksoptions.tsx */}
                    <View style={modalStyle.stockNameAndPrice}>
                        <View style={modalStyle.stockLabelParent}>
                            <Text style={modalStyle.stocksLabel}>ADDED PRICE</Text>
                            <Text style={modalStyle.stocksLabel}>ADDED DATE</Text>
                            <Text style={modalStyle.stocksLabel}>TODAY'S PRICE</Text>
                        </View>


                        <View style={modalStyle.stockDetailsParent}>
                            <Text style={modalStyle.stockDetails}>₹{stockPrice}</Text> {/** price when the stock was added */}
                            <Text style={modalStyle.stockDetails}>12-NOV-25</Text> {/** stock added date */}
                            <Text style={modalStyle.stockDetails}>₹28750</Text> {/** current stock price */}
                        </View>
                    </View>


                    {/* button to close the pop up message */}
                    <View style={modalStyle.buttonsPlacement}>
                        {/* button to del the stock from the data base */}
                        <TouchableOpacity style={modalStyle.deleteButtonDesign} onPress={()=> delStockDetails(stockName)}>
                            <View>
                                <DeleteLogo />
                            </View>
                        </TouchableOpacity>

                        {/* button to close the popup */}
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
        fontSize: 20,

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

    headingDesign: {
        display: "flex",
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: "#000000",
        borderRadius: 2,
        padding: 10,
    },

    stockDetailsDesign: {
        display: "flex",
        alignItems: 'flex-start',
    },


    stockNameAndPrice: {
        // backgroundColor: "#000000",
        color: "#ffffff",
        padding: 10,
        marginTop: 20,
        marginBottom: 20,
        borderRadius: 20,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
    },


    stockLabelParent: {
        display: "flex",
        alignItems: "flex-start"
    },

    stocksLabel: {
        backgroundColor: "#000000",
        color: "#ffffff",
        padding: 10,
        margin: 4,
        borderRadius: 20,
    },

    stockDetailsParent: {
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "flex-end",
        alignContent: "flex-end"
    },
    stockDetails: {
        backgroundColor: "#5F48F5",
        color: "#ffffff",
        padding: 10,
        margin: 4,
        borderRadius: 20,
        width: "auto",
    },

    buttonsPlacement: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center"
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

    deleteButtonDesign : {
        backgroundColor: "#FF1212",
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

    buttonText: {
        color: colors.secondary,
        fontFamily: "Jura-Bold",
        fontSize: 15,
    },


})

export default Popupmessage;