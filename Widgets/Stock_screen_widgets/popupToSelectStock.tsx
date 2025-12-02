// this is the screen that pops up when the user wants to add a stock or clicks on the add stock button , here the user will be able to add the stocks they needs by searching for it or by clicking on the trending stock

import { Modal, View, Text, Button, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';
import colors from "D:\\PROJECTS\\The-Chat-App\\Assets\\colors.js";


import { getAuth } from '@react-native-firebase/auth';
import { getFirestore, collection, doc, addDoc, setDoc } from "@react-native-firebase/firestore";


const handlingSelectedStock = (pressed: any) => {
    console.log(pressed.name)
}


const addStockToDb = async (pressed: any) => {

    const fireBaseUser = getAuth();
    const db = getFirestore()
    const loggedinUser = fireBaseUser.currentUser?.uid;
    // console.warn(loggedinUser)
    const stockName = pressed.name
    console.log(pressed.name)
    console.log(pressed.price)
    // code to access the doc inside the db and add the data into the doc of the users db
    if (loggedinUser) {
        try {

            await setDoc(
                doc(db, "Users", loggedinUser!, "Agents", "Finance", "Stock_Added", pressed.name), // the name of each doc has been added to be as the stock name that was clicked on
                {
                    stockName: pressed.name,
                    stockPrice: pressed.price,
                    addedDate: new Date().toLocaleString()
                }
            );


        }
        catch (error) {
            console.warn(error)
        }
    }

}

const Popupmessage = ({ message, buttonText1, buttonText2, visible, onClose, stockArray }: { message: any, buttonText1: any, buttonText2: any, visible: any, onClose: any, stockArray: any[] }) => {

    // useEffect(() =>{
    //     addStockToDb()
    // }, [])

    return (
        // this is modal where we get the popup like feature so never remove the modal tag
        <Modal visible={visible} animationType="fade" transparent>
            <View style={modalStyle.mainParent}>
                <View style={modalStyle.parentContainer}>

                    {/* text that holds the message that is being displayed */}
                    <Text style={modalStyle.fontcolor}>{message}</Text>
                    <Text>Select a stock to add it to the analysis</Text>


                    {/* this is the search option */}
                    <View>
                        <TextInput placeholder="Enter Stock Name" placeholderTextColor="#ffffff" style={modalStyle.stockInputSearch}></TextInput>
                    </View>

                    <Text>TRENDING TODAY</Text>

                    {/* with the help of the stock array parameter passed form the addstocksoptions.tsx */}
                    <ScrollView>
                        {stockArray.map((stock, index) => (
                            <TouchableOpacity key={index} style={modalStyle.stockNameAndPrice} onPress={() => addStockToDb(stock)}>
                                <Text style={modalStyle.stockName}>{stock.name}: </Text>
                                <Text style={modalStyle.stockPrice}>₹{stock.price}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>


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
        height: 650,
        width: 300,
        backgroundColor: colors.secondary,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: colors.gradient_secondary,

        display: 'flex',
        alignItems: 'center',
        // justifyContent: 'center'
    },

    imageDesign: {
        padding: 20
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

    stockInputSearch: {
        margin: 10,
        backgroundColor: "#000000",
        width: 250,
        borderRadius: 20,

    },

    stockNameAndPrice: {
        backgroundColor: "#000000",
        color: "#ffffff",
        padding: 2,
        margin: 4,
        borderRadius: 20
    },
    stockName: {
        color: "#ffffff",
        padding: 2,
        margin: 4,
    },
    stockPrice: {
        color: "#ffffff",
        padding: 2,
        margin: 4,
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