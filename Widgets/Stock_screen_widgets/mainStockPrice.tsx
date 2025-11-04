import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';


const mainStockApiFetching = async () => {


    try {
        const response = await fetch("https://the-chat-app-jbnwld16e-saifmks-projects.vercel.app/api/gascraping.py");
        const jsonResponse = await response.json();
        console.log(`PRINTING THE API RESPONSE JSON FROM mainStockPrice.tsx : ` , jsonResponse);

        // setStockName(jsonResponse.bse.stockName)
        // console.log(stockName)
        return jsonResponse ;
    }
    catch (error) {
        console.log(`PRINTING THE API RESPONSE FROM mainStockPrice.tsx  [ERROR] : ${error}`);
    }
}


const mainStockPrice = () => {

    const [stockName, setStockName] = useState(null);
    const [stockPrice, setStockPrice] = useState(null);
    const [dataAsArray , setDataAsArray] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await mainStockApiFetching(); 
                const dataAsArrayConversion = Object.values(data)
                console.log("PRINTING THE API RESPONSE FROM mainStockPrice.tsx :", dataAsArray); 
                // setDataAsArray()
                setStockName(data.bse.stockName);
                setStockPrice(data.bse.stockPrice);
            } catch (error) {
                console.error("Error fetching:", error);
            }
        };

        fetchData();
    }, []);


    return (
        <SafeAreaView style={style.stockHolderParent}>

            {
                dataAsArray
            }

            <View style={style.stockPrice}>
                <Text>{stockName}</Text>
                <Text>{stockPrice}</Text>
            </View>

            {/* <View style={style.stockPrice}>
                <Text>hello world</Text>
                <Text> hello</Text>
            </View>

            <View style={style.stockPrice}>
                <Text>hello world</Text>
                <Text> hello</Text>
            </View> */}
        </SafeAreaView>
    )
}

const style = StyleSheet.create({
    textColor: {
        color: "#ffffff"
    },

    stockHolderParent: {
        display: "flex",
        flexDirection: "row",
        gap: 10
    },

    stockPrice: {
        backgroundColor: "#D9D9D9",
        color: "#D9D9D9",
        height: 50,
        width: 80,

        borderRadius: 10
    },

})

export default mainStockPrice;