import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";


const StockWindowSelctor = ({ windowChecker, setWindowCheker }: { windowChecker?: any, setWindowCheker?: any }) => {
    // ({ checker, setCheckerTo }: { checker: any, setCheckerTo: any })
    return (
        <SafeAreaView style={style.screenParent}>

            {/* buttons used to select the  */}
            <View style={style.selctorParent}>
                <TouchableOpacity onPress={() => setWindowCheker("intraday")}>
                    <Text style={windowChecker === "intraday" ? style.selectorButtonChecked : style.selectorButton}>Intraday</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setWindowCheker("1week")}>
                    <Text style={windowChecker === "1week" ? style.selectorButtonChecked : style.selectorButton}>1 week</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setWindowCheker("2week")}>
                    <Text style={windowChecker === "2week" ? style.selectorButtonChecked : style.selectorButton}>2 weeks</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setWindowCheker("3week")}>
                    <Text style={windowChecker === "3week" ? style.selectorButtonChecked : style.selectorButton}>3 weeks</Text>
                </TouchableOpacity>
            </View>



            {/*  */}
            <View style={style.cardParent}>
                <View>
                    <Text style={style.stockName}>
                        REDINGTON
                    </Text>
                </View>

                <View>
                    <Text style={style.summary}>
                        BPCL shows a bullish bias as buyers lifted prices from the open, though the mid-range close indicates consolidation. Risk is low. SUZLON also maintains a bullish bias with buyers in control, yet the rejection of peaks suggests consolidation. Despite a wide range, indecision prevails. Both assets see buyers leading, but sellers are successfully capping gains, preventing breakouts and maintaining a low-risk environment as prices settle away from their highs.
                    </Text>
                </View>

                <TouchableOpacity style ={style.stockDetails}>
                    <Text style={style.percet}>+18%</Text>
                    <View style={style.otherDetailsParent}>
                        <Text style={style.otherDeatilsHeading}>OPENING</Text>
                        <Text style={style.otherDetailsPrice}>123</Text>
                    </View>
                    <View style={style.otherDetailsParent}>
                        <Text style={style.otherDeatilsHeading}>CLOSING</Text>
                        <Text style={style.otherDetailsPrice}>123</Text>
                    </View>
                    <View style={style.otherDetailsParent}>
                        <Text style={style.otherDeatilsHeading}>HIGHEST</Text>
                        <Text style={style.otherDetailsPrice}>123</Text>
                    </View>
                    <View style={style.otherDetailsParent}>
                        <Text style={style.otherDeatilsHeading}>LOWEST</Text>
                        <Text style={style.otherDetailsPrice}>123</Text>
                    </View>
                    {/* <View>
                        <Text style={style.otherDeatilsHeading}>AVG VOL</Text>
                        <Text>123</Text>
                    </View> */}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )

}


const primaryColor = "#D9D9D9"
const secondaryColor = "#5F48F5"

const style = StyleSheet.create({

    screenParent:{
        // display: "flex",
        flex: 1,
        alignItems : "center",
        flexDirection : "column"
        // justifyContent : "center"
    },

    selctorParent: {
        display: "flex",
        flexDirection: "row",
        gap: 25
    },


    selectorButton: {
        backgroundColor: primaryColor,
        // color : "#0000"
        color: "#000",
        padding : 7,
        borderRadius : 15,
        borderWidth : 1,
        borderColor : primaryColor,
        
        fontFamily: 'Jura-Bold',
        fontSize: 12,
    },

    selectorButtonChecked: {
        backgroundColor: secondaryColor,
        color: primaryColor,
        padding : 7,
        borderRadius : 15,
        borderWidth : 1,
        borderColor : primaryColor,

        fontFamily: 'Jura-Bold',
        fontSize: 12,
        fontWeight : "bold"
    },


    // DESIGN FOR THE CARDS

    cardParent:{
        backgroundColor : primaryColor,
        margin : 20, 
        borderRadius: 20
    }, 
    stockName:{
        backgroundColor : "#000",
        color : primaryColor,
        margin : 10,
        padding : 10,
        alignSelf: "flex-start", 
        borderRadius : 20,

        fontFamily: 'Jura-Bold',
    },
    summary:{
        margin : 10,
        // padding : 10

        fontFamily: 'Jura-Bold',
    },
    stockDetails:{
        display : "flex",
        flexDirection : "row",
        alignItems : "center",
        padding : 5,
        gap : 10,
        backgroundColor : "#000",
        margin : 5,
        borderRadius : 15, 
        height : 60,
        // padding : 10

    },
    percet:{
        fontSize : 20,
        padding : 5, 
        color : "#43fb00",

        fontFamily: 'Jura-Bold',
    }, 
    otherDetailsParent:{
        display : "flex", 
        alignItems : "center",
    },
    otherDeatilsHeading:{
        fontSize : 12, 
        color : primaryColor,

        fontFamily: 'Jura-Bold',
    },
    otherDetailsPrice:{
        fontSize : 14, 
        color : primaryColor , 

        fontFamily: 'Jura-Bold',
    }



})

export default StockWindowSelctor