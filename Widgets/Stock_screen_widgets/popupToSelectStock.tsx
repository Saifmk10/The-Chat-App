// this is the screen that pops up when the user wants to add a stock or clicks on the add stock button , here the user will be able to add the stocks they needs by searching for it or by clicking on the trending stock

import { Modal, View, Text, Button, TouchableOpacity, StyleSheet, TextInput, ScrollView, Pressable } from 'react-native';
import colors from "D:\\PROJECTS\\The-Chat-App\\Assets\\colors.js";
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore, collection, doc, addDoc, setDoc } from "@react-native-firebase/firestore";
import { useEffect, useState } from 'react';


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
const Popupmessage = ({ message, buttonText1, buttonText2, visible, onClose }: { message: any, buttonText1: any, buttonText2: any, visible: any, onClose: any }) => {


    const [searched, setSearched] = useState(""); // used to store the user searched stock and then later is passed into the api for the data fetching
    const [searchedStockName, setSearchedStockName] = useState(""); // used to fetch the searched stock name so it can be rendered in the ui later
    const [searchedStockPrice, setSearchedStockPrice] = useState<number | null>(null); // used to fetch the price and later can be rendered
    const [isSearched, setIsSearched] = useState(Boolean) // checks is the user has searched for any stock, if searched then the data will be shown if not then the trending stock be displayed
    const [dataAsArray, setDataAsArray] = useState<any[]>([]) // in this hook the data that is fetched from the api is stored as a array so it can be used to map in the popuptoSelectStock.tsx file where the pop up is managed
    const [activeTab, setActiveTab] = useState("most");

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

    

    const mainStockApiFetching = async () => {
        const URL_MOSTACTIVE  = "https://stock-api.saifmk.website/mostActive"
        const URL_GAINER = "https://stock-api.saifmk.website/gainer"
        const URL_LOOSER = "https://stock-api.saifmk.website/looser"
        let URL = ""

        if(activeTab === "most"){
            URL = URL_MOSTACTIVE
        }
        else if(activeTab === "gainer"){
            URL = URL_GAINER
        }
        else{
            URL = URL_LOOSER
        }

        try {



            const response = await fetch(URL);
            const jsonResponse = await response.json();
            console.log(`PRINTING THE API RESPONSE JSON FROM addStockOptionButton.tsx : `, jsonResponse);
            return jsonResponse;
        }
        catch (error) {
            console.log(`PRINTING THE API RESPONSE FROM addStockOptionButton.tsx   , check function mainStockApiFetching() comment[ERROR] : ${error}`);
            return error
        }


    }




    // funciton that takes the data that has been fetched from the mainStockApiFetching function and then the ouput is fomatted and managed here
    const fetchData = async () => {
        try {
            const data = await mainStockApiFetching();
            console.log("PRINTING THE API RESPONSE FROM mainStockPrice.tsx :", data);
            // safely access trending_stocks array
            const trending = data?.trending_stocks;

            if (Array.isArray(trending)) {
                setDataAsArray(trending);
                console.log("STOCK LIST (Array):", trending);
                

                //  uncomment for debugging ONLY
                // this loop is used for debuggin pupose onlt
                // for (let i = 0; i < trending.length; i++) {
                //     console.log("STOCK DETAILS FROM ARRAY:", trending[i].name, trending[i].price);
                // }

            } else {
                console.warn("PROVIDED RESPONSE IS NOT AN ARRAY RESPONSE , FROM ", data);
            }
        } catch (error) {
            console.error("Error fetching:", error);
        }
    };

    const stockArray = dataAsArray

    // the function is called here based in the hook the hook is true when the pop up is open and its false when the pop up is closed it becomes false , this statement makes the data realtime 
    if (visible) {
        // fetchData()


    }

    useEffect(()=>{

        if(visible){
            fetchData()
        }

        const interval = setInterval(() =>{
            fetchData()
        } , 3000)


        return () => clearInterval(interval)
    },[visible , activeTab])

    return (
 

       




        // this is modal where we get the popup like feature so never remove the modal tag
        <Modal visible={visible} animationType="fade" transparent statusBarTranslucent>

            <Pressable onPress={onClose} style={{flex:1 , backgroundColor: "rgba(0,0,0,0.4)",}}>
            {/* <Pressable> */}
            <View style={modalStyle.mainParent}>
                <View style={modalStyle.parentContainer}>



                    {/* this is the search option */}
                    <View>
                        <TextInput placeholder="Enter Stock Name" placeholderTextColor="#ffffff" style={modalStyle.stockInputSearch} value={searched} onChangeText={setSearched} returnKeyType="search" onSubmitEditing={() => { searchedStock(searched), setIsSearched(true); }} />
                    </View>

                    {/* <Text>TRENDING TODAY</Text> */}







                    {
                        isSearched ? (
                            // this is the search option , when the user search for a stock the stock details are redered from here
                            <View style={modalStyle.searchedStockDesign}>
                                <TouchableOpacity style={modalStyle.stockNameAndPrice} onPress={() => { addStockToDb(searchedStockName) }}>
                                    <Text style={modalStyle.stockName}>{searchedStockName}: </Text>
                                    <Text style={modalStyle.stockPrice}>₹{searchedStockPrice}</Text>
                                </TouchableOpacity>
                            </View>

                        ) :

                            (
                                <View>
                                    <View style={modalStyle.stockTypeNavigationParent}>

                                        <Pressable
                                            onPress={() => setActiveTab("most")}
                                            style={({ pressed }) => [
                                                modalStyle.stockTypeNavigationButtons,
                                                activeTab === "most" && modalStyle.stockTypeNavigationButtonsClicked,
                                                pressed && { opacity: 0.7 },
                                            ]}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: "Jura-Bold", fontSize: 14,
                                                    color: activeTab === "most" ? "#fff" : "#000000",
                                                }}
                                            >
                                                Most Active
                                            </Text>
                                        </Pressable>


                                        <Pressable
                                            onPress={() => setActiveTab("gainer")}
                                            style={({ pressed }) => [
                                                modalStyle.stockTypeNavigationButtons,
                                                activeTab === "gainer" && modalStyle.stockTypeNavigationButtonsClicked,
                                                pressed && { opacity: 0.7 },
                                            ]}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: "Jura-Bold", fontSize: 14,
                                                    color: activeTab === "gainer" ? "#fff" : "#000000",

                                                }}
                                            >
                                                Gainers
                                            </Text>
                                        </Pressable>



                                        <Pressable
                                            onPress={() => setActiveTab("looser")}
                                            style={({ pressed }) => [
                                                modalStyle.stockTypeNavigationButtons,
                                                activeTab === "looser" && modalStyle.stockTypeNavigationButtonsClicked,
                                                pressed && { opacity: 0.7 },
                                            ]}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: "Jura-Bold", fontSize: 14,
                                                    color: activeTab === "looser" ? "#fff" : "#000000",

                                                }}
                                            >
                                                Losers
                                            </Text>
                                        </Pressable>




                                    </View>
                                    {/* //  this is the trending stock , looser , gainer stock rendering section */}
                                    <ScrollView contentContainerStyle={modalStyle.stockListContainer}>
                                        {dataAsArray.map((stock, index) => (

                                            
                                            
                                            <View >
                                                <TouchableOpacity key={index} style={modalStyle.stockNameAndPrice} onPress={() => { addStockToDb(stock) }}>
                                                    <Text style={modalStyle.stockName}>{stock.name}: </Text>
                                                    <View style={modalStyle.stockPriceParent}>
                                                        {

                                                            dataAsArray.length > 0 ? 
                                                            (
                                                                <>
                                                                <Text style={modalStyle.stockPrice}>₹{stock.price}</Text>
                                                                <Text style={[modalStyle.currentStockPrice , {color : Number(String(stock.current).replace(/[^\d.-]/g, "")) > 0 ? "green" : "red"}]}>{stock.current}</Text>
                                                                </>
                                                            ) :

                                                            (

                                                                <Text style={modalStyle.stockPrice}>STOCK API NOT ACTIVE</Text>

                                                            )

                                                        }
                                                        
                                                    </View>
                                                    
                                                </TouchableOpacity>
                                            </View>
                                        ))}
                                    </ScrollView>
                                </View>
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
            </Pressable>
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
        height: 660,
        width: 350,
        backgroundColor: colors.secondary,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: "#ffff",
        // overflow: "hidden",

        // display: 'flex',
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
        margin: 20,
        backgroundColor: "#000000",
        width: 250,
        borderRadius: 20,
        color: "#ffff",
        alignItems: "center"

    },
    searchedStockDesign: {
        justifyContent: "flex-start",
        alignItems: "flex-start"
    },

    stockTypeNavigationParent: {
        display: "flex",
        justifyContent: "center",
        flexDirection: "row",
        gap: 20,
        margin: 10,
        padding: 10,
        // backgroundColor: "#5F48F5", 
        borderRadius: 15,
    },

    stockTypeNavigationButtons: {
        // backgroundColor : "#0000",
        // backgroundColor : "#000000",
        borderBlockColor: "#000000",
        borderRadius: 15,
        borderWidth: 2,
        padding: 5

    },

    stockTypeNavigationFonts: {
        // color:"#D9D9D9",

    },

    stockTypeNavigationButtonsClicked: {
        borderBlockColor: "#000000",
        backgroundColor: "#000000",
        // color : "#D9D9D9",
        borderRadius: 15,
        borderWidth: 2,
        padding: 5
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
        height: 130,

        // flexDirection:"column",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
    },
    stockName: {
        color: "#ffffff",
        padding: 2,
        margin: 4,
        fontSize: 13
    },

    stockPriceParent:{
        display : "flex",
        flexDirection : "column"
    },

    stockPrice: {
        color: "#ffffff",
        padding: 2,
        // margin: 4,
        fontSize: 15
    },

    currentStockPrice:{
        fontWeight : 600,
        padding: 2,
        // margin: 4,
        fontSize: 13
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