// this screen will contains all the options that are available within the stock agent. This contains the stocks , doashboard , bots. 
// here the rendering of each screen according to the button clicked will be managed 

import { useState } from "react";
import MainStockPrice from "../../Widgets/Stock_screen_widgets/addStockOptionButton";
import { SafeAreaView, Text, StyleSheet, View, TouchableOpacity } from "react-native"
import BackButton from "../../Assets/images/stockAgentScreen/backbutton";
import { useNavigation, useRoute } from "@react-navigation/native";

import ToggleButtons from "../../Widgets/Stock_screen_widgets/toggleButtons";


const StockAgentOperationsScreen = () => {
    const navigation = useNavigation<any>();
    const [checker, setCheckerTo] = useState("stocks")


    return (
        <SafeAreaView style={{ backgroundColor: "#000000", flex: 1 }}>

            <View style={style.backButtonHeadingStyle}>

                {/* back arrow to go back to the previous screen */}
                <TouchableOpacity onPress={() => { (navigation).goBack(); }}>
                    <BackButton />
                </TouchableOpacity>

                {/* heading for the agent */}
                <View style={style.headingParentStyle}>
                    <Text style={style.headingStyle}>FINANCE</Text>
                </View>

                <View style={{ width: 40 }} /> {/* added to balance the centered look of the heading no other purpose */}

            </View>

            {/* this is the section where the toggle button will be managed , according to each click the checker changes making it easy to navigate to next screen */}
            <View style={style.stockAdditionStyle}>
                <ToggleButtons checker={checker} setCheckerTo={setCheckerTo} />
            </View>


            {
                checker === "stocks" ?
                    <View style={style.stockAdditionSection}>
                        < MainStockPrice />
                    </View>
                    : checker === "my stocks" ?
                    <View style={style.stockAdditionStyle}>
                       <Text style = {style.textColor}>hello this is my stocks</Text>
                    </View>
                    : 
                    <View style={style.stockAdditionStyle}>
                       <Text style = {style.textColor}>hello this is differnt</Text>
                    </View>
            }



        </SafeAreaView>


    )
}

const style = StyleSheet.create({
    textColor: {
        color: "#ffffff"
    },

    backButtonHeadingStyle: {
        paddingTop: 40,
        paddingLeft: 15,

        // display : "flex",
        flexDirection: "row",
        alignItems: "center",
        // gap : 75,

        borderWidth: 1,
        borderBottomColor: "#D9D9D9",
        borderRadius: 1
    },
    headingParentStyle: {
        // display : "flex",
        // justifyContent : "center", 
        flex: 1,
        alignItems: "center"
    },
    headingStyle: {
        color: "#D9D9D9",
        fontFamily: "Jura-Bold",
        fontSize: 25,
    },

    stockAdditionStyle: {
        paddingTop: 20,
        display : "flex",
        flex : 1,
        // justifyContent : "center",
        alignItems : "center", 

        backgroundColor: "#000000"
    }, 

    stockAdditionSection: {
        padding: 20,
        display : "flex",
        flex : 1,
        justifyContent : "flex-end",
        alignItems : "center", 

        backgroundColor: "#000000"
    }
})

export default StockAgentOperationsScreen;