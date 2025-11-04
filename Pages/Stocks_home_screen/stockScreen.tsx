import React from "react";
import MainStockPrice from "../../Widgets/Stock_screen_widgets/mainStockPrice";
import {SafeAreaView , Text , StyleSheet , View} from "react-native"


const stockScreen = () =>{
    return (
        <SafeAreaView >
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
        paddingTop : 20
    }
})

export default stockScreen;