// need to add more data , like the vol data 

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, LayoutAnimation } from "react-native";
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore, collection, doc, addDoc, setDoc, getDoc, deleteDoc } from "@react-native-firebase/firestore";
// import json

const StockWindowSelctor = ({ windowChecker, setWindowCheker }: { windowChecker?: any, setWindowCheker?: any }) => {

    // database realted 
    

    




    return (
        <View style={style.screenParent}>

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


        </View>
    )

}


const primaryColor = "#D9D9D9"
const secondaryColor = "#5F48F5"

const style = StyleSheet.create({

    screenParent: {
        alignItems: "center",
        flexDirection: "column",
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
        padding: 7,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: primaryColor,

        fontFamily: 'Jura-Bold',
        fontSize: 12,
    },

    selectorButtonChecked: {
        backgroundColor: secondaryColor,
        color: primaryColor,
        padding: 7,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: primaryColor,

        fontFamily: 'Jura-Bold',
        fontSize: 12,
        fontWeight: "bold"
    },


    // DESIGN FOR THE CARDS

    cardParent: {
        backgroundColor: primaryColor,
        margin: 20,
        borderRadius: 20
    },
    stockName: {
        backgroundColor: "#000",
        color: primaryColor,
        margin: 10,
        padding: 10,
        alignSelf: "flex-start",
        borderRadius: 20,

        fontFamily: 'Jura-Bold',
    },
    summary: {
        margin: 10,
        // padding : 10

        fontFamily: 'Jura-Bold',
    },

    stockDetailsParent: {
        display: "flex",
        flexDirection: "column"
    },

    stockDetails: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: 5,
        gap: 10,
        backgroundColor: "#000",
        margin: 5,
        borderRadius: 15,
        height: 60,
        // padding : 10
    },
    percet: {
        fontSize: 20,
        padding: 5,
        color: "#43fb00",

        fontFamily: 'Jura-Bold',
    },
    otherDetailsParent: {
        display: "flex",
        alignItems: "center",
    },
    otherDeatilsHeading: {
        fontSize: 12,
        color: primaryColor,

        fontFamily: 'Jura-Bold',
    },
    otherDetailsPrice: {
        fontSize: 14,
        color: primaryColor,

        fontFamily: 'Jura-Bold',
    }



})

export default StockWindowSelctor