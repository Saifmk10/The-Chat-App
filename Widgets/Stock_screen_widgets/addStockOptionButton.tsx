// this is the file that hold the code for the adding stock button currently is running as a test in the main screen , will be added to a different section under the agent menu
// this contains the logic for the api fetching to show trending stocks in the add stock pop up

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import Popupmessage from './popupToSelectStock';



// function that is responsible for the fetching of data from the api end point , in case api throws any error change the end point bcs end point keeps updating as the api is upgraded



const mainStockPrice = () => {

    // the button to add the stock wil be by default set to false so once the button is clicked it becomes true and with that the function call is handles
    const [visbilityStat, setVisbilityStat] = useState(false);

    
    
        

    return (
        <View style={style.stockHolderParent}>

            
            <TouchableOpacity onPress={() => setVisbilityStat(true)}>
                <View style={style.stockPrice}>
                    <Text style={style.textColor}>ADD STOCK</Text>
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
                    // stockArray={dataAsArray}    
                />
            </View>

        </View>
    )
}

const style = StyleSheet.create({
    textColor: {
        color: "#ffffff",
        alignContent: "center"
    },

    stockHolderParent: {
        display: "flex",
        flexDirection: "column",
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