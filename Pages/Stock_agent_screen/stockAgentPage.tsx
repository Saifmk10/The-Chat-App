// this screen holds all the agents that are avaialbale within the app , this screen has no logical or backend going on it completely front end and static

import React from "react";
import MainStockPrice from "../../Widgets/Stock_screen_widgets/addStockOptionButton";
import {SafeAreaView , Text , StyleSheet , View} from "react-native"


const stockAgentScreen = () =>{
    return (
        <SafeAreaView>
            <View style = {style.mainStockPriceStyle}>
                < MainStockPrice/>
            </View>
        </SafeAreaView>
    )
}

const style = StyleSheet.create({
    textColor : {
        color : "#ffffff"
    },

    mainStockPriceStyle : {
        paddingTop : 40,
        display : "flex",
        justifyContent : "center",
        alignItems : "center", 

        backgroundColor : "#000000ff"
    } 
})

export default stockAgentScreen;