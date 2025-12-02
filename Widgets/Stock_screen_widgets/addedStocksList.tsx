import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from "react-native";
import DeleteLogo from "../../Assets/images/agents/stockAgent/deleteLogo";
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore, collection, doc, addDoc, setDoc, getDocs } from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";

const AddedStocksList = () => {

    const fireBaseUser = getAuth();
    const db = getFirestore()
    const loggedinUser = fireBaseUser.currentUser?.uid;

    const [stocks, setStocks] = useState<{ stockName: string; stockPrice: string }[]>([])

    const fetchingAddedStock = async () => {



        if (loggedinUser) {
            try {
                const refCollectionn = collection(db, "Users", loggedinUser!, "Agents", "Finance", "Stock_Added")
                const snapshot = await getDocs(refCollectionn)

                const fetchedData = snapshot.docs.map((doc: any) => doc.data())
                setStocks(fetchedData)
                console.log("FETCHED DATA OF STOCKS FROM addedStockList.tsx", fetchedData)
            }
            catch (error) {
                console.log("FETCHED DATA OF STOCKS FROM addedStockList.tsx error", error)
            }
        }
    }

    useEffect(() => {
        fetchingAddedStock()
    }, [])

    return (



        <View>

            {/* header row */}
            <View style={style.headingStyle}>
                <Text style={style.text}>Stock Name</Text>
                <Text style={style.text}>Price</Text>
                <Text style={style.text}>Date</Text>
            </View>

            {/* scrollable list with proper layout */}
            <ScrollView
            >
                <View>
                    {
                        stocks.map((items, index) => (

                            <View style={style.mainContainerParent}>

                                <View key={index} style={style.stockDetailsParentStyle}>
                                    <Text style={style.stockName}>{items.stockName.slice(0,8) + ".."}</Text>
                                    <Text style={style.stockPrice}>{items.stockPrice}</Text>
                                    <Text style={style.stockAddDate}>15-12-2025</Text>
                                </View>

                                {/* <TouchableOpacity style={style.deleteButtonStyle}>
                                    <DeleteLogo />
                                </TouchableOpacity> */}
                            </View>



                        ))
                    }
                </View>
            </ScrollView>


        </View>
    );

    // return (
    //     <Text style={style.text}>Hellow</Text>
    // );

}


const style = StyleSheet.create({
    text: {
        color: "#ffff",
        fontFamily: "Jura-Bold",
    },
    headingStyle: {
        display: "flex",
        flexDirection: "row",
        gap: 55 ,
        paddingRight: 40, 
        // marginLeft : 10
    }, 

    // style section for the stock price name and date container
    mainContainerParent : {
        marginTop : 20,
        display : "flex",
        flexDirection : "row", 

        alignItems : "center"
    },
    stockDetailsParentStyle :{
        backgroundColor: "#D9D9D9", 
        display: "flex",
        flexDirection : "row",
        width : 300,
        gap : 10,
        padding : 15,

        borderRadius : 10, 
        borderWidth : 1,
        borderColor : "#5F48F5"
    },

    stockName : {
         width: 100,
        paddingLeft: 10,
        fontFamily: "Jura-Bold",
        fontSize: 13,
    },
    stockPrice : {
         width: 70,
        paddingLeft: 10,
        fontFamily: "Jura-Bold",
        fontSize: 13,
    },
    stockAddDate : {
        width: 120,
        paddingLeft: 10,
        fontFamily: "Jura-Bold",
        fontSize: 13,
    },
    deleteButtonStyle : {
        backgroundColor : "#f40b0bff", 
        padding : 10, 
        margin : 5, 

        borderRadius: 10,
    }
    
})


export default AddedStocksList;