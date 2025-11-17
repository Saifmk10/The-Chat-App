// this is the file that hold the code for the adding stock button currently is running as a test in the main screen , will be added to a different section under the agent menu
// this contains the logic for the api fetching to show trending stocks in the add stock pop up

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import Popupmessage from './popupToSelectStock';



// function that is responsible for the fetching of data from the api end point , in case api throws any error change the end point bcs end point keeps updating as the api is upgraded
const mainStockApiFetching = async () => {


    try {

        const response = await fetch("https:///api/stockrecom.py");
        const jsonResponse = await response.json();
        console.log(`PRINTING THE API RESPONSE JSON FROM addStockOptionButton.tsx : `, jsonResponse);  
        return jsonResponse;
    }
    catch (error) {
        console.log(`PRINTING THE API RESPONSE FROM addStockOptionButton.tsx   , check function mainStockApiFetching() comment[ERROR] : ${error}`);
    }


}


const mainStockPrice = () => {

    // the button to add the stock wil be by default set to false so once the button is clicked it becomes true and with that the function call is handles
    const [visbilityStat, setVisbilityStat] = useState(false);

    // in this hook the data that is fetched from the api is stored as a array so it can be used to map in the popupToSelectStock.tsx file where the pop up is managed
    const [dataAsArray, setDataAsArray] = useState<any[]>([])
    
        
        // funciton that takes the data that has been fetched from the mainStockApiFetching function and then the ouput is fomatted and managed here
        const fetchData = async () => {
                try {
                    const data = await mainStockApiFetching();
                    console.log("PRINTING THE API RESPONSE FROM mainStockPrice.tsx :", data);
    
                    // safely access trending_stocks array
                    const trending = data?.["STOCKS :"]?.trending_stocks;
    
                    if (Array.isArray(trending)) {
                        setDataAsArray(trending);
                        console.log("STOCK LIST (Array):", trending);  
    
                        // this loop is used for debuggin pupose onlt
                        for (let i = 0; i < trending.length; i++) {
    
                            console.log("STOCK DETAILS FROM ARRAY:", trending[i].name, trending[i].price);
    
                        }
    
                    } else {
                        console.warn("PROVIDED RESPONSE IS NOT AN ARRAY RESPONSE , FROM ", data);
                    }
                } catch (error) {
                    console.error("Error fetching:", error);
                }
            };
            
            
            // the function is called here based in the hook the hook is true when the pop up is open and its false when the pop up is closed it becomes false , this statement makes the data realtime 
            if(visbilityStat){
                fetchData()
            }


    return (
        <SafeAreaView style={style.stockHolderParent}>

            
            <TouchableOpacity onPress={() => setVisbilityStat(true)}>
                <View style={style.stockPrice}>
                    <Text style={style.textColor}>ADD STOCK NAME</Text>
                </View>
            </TouchableOpacity>

            <View>
                {/* the param is added here to pass the details into the popupToAddStock.tsx file */}
                <Popupmessage
                    visible={visbilityStat}
                    message="ADD STOCK"
                    buttonText1="ADD"
                    buttonText2="CLOSE"
                    onClose={() => setVisbilityStat(false)}
                    stockArray={dataAsArray}    
                />
            </View>

        </SafeAreaView>
    )
}

const style = StyleSheet.create({
    textColor: {
        color: "#ffffff",
        alignContent: "center"
    },

    stockHolderParent: {
        display: "flex",
        flexDirection: "row",
        gap: 10
    },

    stockPrice: {
        backgroundColor: "#000000",
        color: "#D9D9D9",
        height: 50,
        width: 300,

        borderRadius: 50,
        borderStyle: "dashed",
        borderColor: "#5b43bbff",
        borderWidth: 1.5,

        display: "flex",
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center"

    },

})

export default mainStockPrice;