import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import DeleteLogo from "../../Assets/images/agents/stockAgent/deleteLogo";
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore, collection, doc, addDoc, setDoc, getDocs, deleteDoc } from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";

import Popupmessage from "./addedStockDetailsPopUp";
import { assets } from "../../react-native.config";

const AddedStocksList = () => {

    const fireBaseUser = getAuth();
    const db = getFirestore()
    const loggedinUser = fireBaseUser.currentUser?.uid;

    const [stocks, setStocks] = useState<{ stockName: string; stockPrice: string }[]>([]) // this is used to render the stock details in this widget itself , the bellow ones render it in th pop up
    const [emptyStock, setEmptyStock] = useState(Boolean)

    const [visbilityStat, setVisbilityStat] = useState(false); //  setting the visisbility value for the pop up that shows stock details
    const [stockNamePopUp, setStockName] = useState<string>(); // used to give the addedStockPopUp.tsx the access to the data so that it can render the stock details
    const [stockPricePopUp, setStockPrice] = useState<string>(); //  used to give the addedStockPopUp.tsx the access to the data so that it can render the stock details



    const fetchingAddedStock = async () => {
        // checking if the user has been logged in so the user will access only his account details
        if (loggedinUser) {
            try {
                const refCollectionn = collection(db, "Users", loggedinUser!, "Agents", "Finance", "Stock_Added")
                const snapshot = await getDocs(refCollectionn)

                const fetchedData = snapshot.docs.map((doc: any) => doc.data()) // fetching the data , the this data is added to the bellow state for rendering
                setStocks(fetchedData)

                if (fetchedData.length === 0) {
                    setEmptyStock(false)
                    console.log("THIS IS EMPTY" , emptyStock)
                }
                else {
                    setEmptyStock(true)
                    console.log("FETCHED DATA OF STOCKS FROM addedStockList.tsx", fetchedData , emptyStock)
                }

            }
            catch (error) {
                console.log("FETCHED DATA OF STOCKS FROM addedStockList.tsx error", error)
            }
        }
    }

    const deleteAddedStock = async (DelItem: string) => {
        if (loggedinUser) {
            try {

                // this will perform the the deletion and also the error handling 
                try {
                    await deleteDoc(doc(db, "Users", loggedinUser!, "Agents", "Finance", "Stock_Added", DelItem))
                    console.log(`YOU HAVE REMOVED ${DelItem} FROM STOCK ANALYSIS`)
                }
                catch (error) {
                    console.log("ERROR IN DELETION SCTOCK ERROR :", error)
                }

            }
            catch (error) {
                console.log("FETCHED DATA OF STOCKS FROM addedStockList.tsx error", error)
            }
        }
    }

    const test = (name: string, price: string) => {
        console.log("CLICKED AND RETURNED FROM addedStockList.tsx:", name)
        console.log("CLICKED AND RETURNED FROM addedStockList.tsx:", price)
    }



    // all the stock details will be rendered as soon as the user clicks in the stocks section
    useEffect(() => {
        fetchingAddedStock()
    }, [])

    const refreshOnDel = async () => {
        await fetchingAddedStock()
    }






    return (

        <View>

            {/* header row */}
            <View style={style.headingStyle}>
                <Text style={style.text}>Stocks Added For Analysis</Text>
                {/* <Text style={style.text}>Price</Text>
                <Text style={style.text}>Date</Text> */}
            </View>

            {/* scrollable list with proper layout */}
            <ScrollView
            >
                <View>


                    {!emptyStock ?

                        (
                            <View style={style.emptyStockMessage}>
                                <Text style={style.emptyStockMessageText}>No stocks have been added for analysis. Please add stocks to begin receiving regular market updates.</Text>
                                <Text style={style.emptyStockMessageTextLearnMore}>Learn More</Text>
                            </View>
                        ) : 
                        
                        (   
                            stocks.map((items, index) => (
                                <TouchableOpacity style={style.mainContainerParent} onPress={() => { setVisbilityStat(true); setStockName(items.stockName); setStockPrice(items.stockPrice); test(items.stockName, items.stockPrice); console.log("CLICKED FROM addedStocksList.tsx:", items) }}>
                                    <View key={index} style={style.stockDetailsParentStyle}>
                                        <Text style={style.stockName}>{items.stockName.slice(0, 8) + ".."}</Text>
                                        <Text style={style.stockPrice}>{"₹"}{items.stockPrice}</Text>
                                        <Text style={style.stockAddDate}>15-12-2025</Text>
                                    </View>
                                    <TouchableOpacity style={style.deleteButtonStyle} onPress={() => { deleteAddedStock(items.stockName), refreshOnDel() }}>
                                        <DeleteLogo />
                                    </TouchableOpacity>
                                </TouchableOpacity>
                            ))
                        )

                    }




                    <Popupmessage
                        visible={visbilityStat}
                        stockName={stockNamePopUp}
                        stockPrice={stockPricePopUp}
                        buttonText1="ADD"
                        buttonText2="CLOSE"
                        onClose={() => setVisbilityStat(false)}
                    // stockArray={dataAsArray}    
                    />
                </View>
            </ScrollView>


        </View>
    );


}


const style = StyleSheet.create({
    text: {
        color: "#ffff",
        fontFamily: "Jura-Bold",
        fontSize: 15
    },
    headingStyle: {
        display: "flex",
        flexDirection: "row",
        // gap: 50 ,
        // paddingRight: 40, 
        // marginLeft : 10
        alignItems: "center",
        justifyContent: "center"
    },

    // style section for the stock price name and date container
    mainContainerParent: {
        marginTop: 20,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    stockDetailsParentStyle: {
        backgroundColor: "#D9D9D9",
        flexDirection: "row",
        width: 280,
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#5F48F5",
        alignItems: "center",
    },

    emptyStockMessage:{
        backgroundColor : "#D9D9D9",
        marginTop : 20,
        padding : 20,
        borderRadius : 20,
        
    },
    emptyStockMessageText:{
        color : "#000000",
        
    },
    emptyStockMessageTextLearnMore :{
        marginTop : 5,
        color : "#000000",
        textDecorationLine : "underline"
    },

    stockName: {
        flex: 1,
        fontFamily: "Jura-Bold",
        fontSize: 13,
    },

    stockPrice: {
        flex: 1,
        textAlign: "center",
        fontFamily: "Jura-Bold",
        fontSize: 13,
    },

    stockAddDate: {
        flex: 1,
        textAlign: "right",
        fontFamily: "Jura-Bold",
        fontSize: 13,
    },

    deleteButtonStyle: {
        backgroundColor: "#f40b0bff",
        padding: 5,
        margin: 5,

        borderRadius: 10,
    }

})


export default AddedStocksList;