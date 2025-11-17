// this is the finance agent widget code , here some logic realted to the database will happen on click for the first time and nothing more , but this code is static as of now

import React from "react";
import StockGraphImage from "../../Assets/images/agents/stockGraph"
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";


const stockAgent = () => {

    return (
        <SafeAreaView >
            
            <TouchableOpacity>
                <LinearGradient colors={['#000000', '#372A8F']}  locations={[0.02, 1]} style={style.parentContainer}>
            
                    <View style={style.parentDisplay}>
                        <StockGraphImage />

                        <Text style={style.mainText}>FINANCE</Text>
                        <Text style={style.subText}>Analyze • Learn • Implement</Text>
                    </View>
                </LinearGradient>
            </TouchableOpacity>
        </SafeAreaView>
    )
}


const style = StyleSheet.create({
    parentContainer: {
        height: 180,
        width: 180,
        backgroundColor: "#372A8F",
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center", 

        borderWidth : 1,
        borderColor : "#FFFF"
    },
    parentDisplay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    


    mainText: {
        color: "#ffff", 
        fontFamily: "Jura-Bold",
        fontSize : 20

    },

    subText : {
         color: "#ffff", 
        fontFamily: "Jura-Bold",
        fontSize : 10
    }
})
export default stockAgent