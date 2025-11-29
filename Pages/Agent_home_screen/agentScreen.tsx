// this screen holds all the agents that are avaialbale within the app , this screen has no logical or backend going on it completely front end and static

import React from "react";
import MainStockPrice from "../../Widgets/Stock_screen_widgets/addStockOptionButton";
import StockAgent from "../../Widgets/Agent_selection_widgets/stockAgent"
import {SafeAreaView , Text , StyleSheet , View} from "react-native"


const AgentScreen = () =>{
    return (
        <SafeAreaView >
            <View style = {style.mainStockPriceStyle}>
                {/* from here the navigation will happen to the stockAgentPage.tsx , the navigation logic is within the widget */}
                <StockAgent/>
            </View>
        </SafeAreaView>
    )
}

const style = StyleSheet.create({
    textColor : {
        color : "#ffffff"
    },

    mainStockPriceStyle : {
        paddingTop : 20,
        display : "flex",
        justifyContent : "flex-start",
        alignItems : "flex-start"
    } 
})

export default AgentScreen;