// this is the screen that pops up when the user wants to add a stock or clicks on the add stock button , here the user will be able to add the stocks they needs by searching for it or by clicking on the trending stock

import { Modal, View, Text, Button, TouchableOpacity, StyleSheet, TextInput, ScrollView , Pressable } from 'react-native';
import colors from "D:\\PROJECTS\\The-Chat-App\\Assets\\colors.js";
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore, collection, doc, addDoc, setDoc } from "@react-native-firebase/firestore";
import { useState } from 'react';


// import { fetchingAddedStock } from './addedStocksList';

// const handlingSelectedStock = (pressed: any) => {
//     console.log(pressed.name)

// }


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





// this is used as a function , which means all the data displayed here is coming form the addStockOptionButton
const Popupmessage = ({ message, buttonText1, buttonText2, visible, onClose, stockArray }: { message: any, buttonText1: any, buttonText2: any, visible: any, onClose: any, stockArray: any[] }) => {


    const [searched, setSearched] = useState(""); // used to store the user searched stock and then later is passed into the api for the data fetching
    const [searchedStockName, setSearchedStockName] = useState(""); // used to fetch the searched stock name so it can be rendered in the ui later
    const [searchedStockPrice, setSearchedStockPrice] = useState<number | null>(null); // used to fetch the price and later can be rendered
    const [isSearched, setIsSearched] = useState(Boolean) // checks is the user has searched for any stock, if searched then the data will be shown if not then the trending stock be displayed


    // function used to fetch the user searched stock details, done with native api
    const searchedStock = async (searched: string) => {
        console.log("USER SEARCHED FOR :", searched)

        try {
            const URL = `https://stock-api.saifmk.website/search/${encodeURIComponent(searched)}`
            const request = await fetch(URL)
            const data = await request.json()

            setSearchedStockName(data.stockName)
            setSearchedStockPrice(data.stockPrice)


            console.log("API DATA:", data.stockName, data.stockPrice);
        }
        catch (error) {
            console.log(error)
        }

    }





    return (
        // this is modal where we get the popup like feature so never remove the modal tag
        <Modal visible={visible} animationType="fade" transparent statusBarTranslucent>

            {/* <Pressable onPress={onClose} style={{flex:1 , backgroundColor: "rgba(0,0,0,0.4)",}}> */}
            {/* <Pressable> */}
            <View style={modalStyle.mainParent}>
                <View style={modalStyle.parentContainer}>

                    {/* text that holds the message that is being displayed */}
                    {/* <Text style={modalStyle.fontcolor}>{message}</Text> */}
                    {/* <Text>Click a stock to add it to the analysis</Text> */}


                    {/* this is the search option */}
                    <View>
                        <TextInput placeholder="Enter Stock Name" placeholderTextColor="#ffffff" style={modalStyle.stockInputSearch} value={searched} onChangeText={setSearched} returnKeyType="search" onSubmitEditing={() => { searchedStock(searched), setIsSearched(true); }} />
                    </View>

                    <Text>TRENDING TODAY</Text>

                    {/* with the help of the stock array parameter passed form the addstocksoptions.tsx */}

                    {
                        isSearched ? (

                            <View style={modalStyle.searchedStockDesign}>
                                <TouchableOpacity style={modalStyle.stockNameAndPrice} onPress={() => { addStockToDb(searchedStockName) }}>
                                    <Text style={modalStyle.stockName}>{searchedStockName}: </Text>
                                    <Text style={modalStyle.stockPrice}>₹{searchedStockPrice}</Text>
                                </TouchableOpacity>
                            </View>

                        ) :

                            (
                                <ScrollView contentContainerStyle={modalStyle.stockListContainer}>
                                    {stockArray.map((stock, index) => (
                                        <View >
                                            <TouchableOpacity key={index} style={modalStyle.stockNameAndPrice} onPress={() => { addStockToDb(stock) }}>
                                                <Text style={modalStyle.stockName}>{stock.name}: </Text>
                                                <Text style={modalStyle.stockPrice}>₹{stock.price}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </ScrollView>
                            )

                    }





                    {/* button to close the pop up message */}
                    <View style={modalStyle.buttonsPlacement}>
                        {/* <TouchableOpacity style={modalStyle.buttonDesign} onPress={onClose}>
                            <Text style={modalStyle.buttonText}>{buttonText1}</Text>
                        </TouchableOpacity> */}
                        <TouchableOpacity style={modalStyle.buttonDesign} onPress={onClose}>
                            <Text style={modalStyle.buttonText}>{buttonText2}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            {/* </Pressable> */}
            {/* </Pressable> */}
        </Modal>
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
        justifyContent: "flex-end",
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.8)'
    },


    parentContainer: {
        //height kept auto here
        height: 650,
        width: 350,
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
        color: "#ffff"

    },
    searchedStockDesign: {
        justifyContent: "flex-start",
        alignItems: "flex-start"
    },

    stockListContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        // justifyContent: "space-between",
        alignItems: "center",
        justifyContent: "center"
    },

    stockNameAndPrice: {
        backgroundColor: "#000000",
        color: "#ffffff",
        padding: 10,
        margin: 4,
        borderRadius: 20,
        width: 150,
        height: 100
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