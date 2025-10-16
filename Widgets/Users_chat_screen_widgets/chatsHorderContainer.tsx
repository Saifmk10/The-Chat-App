// this is a file that is responsible for holding and rendering of all the chats if the users . both being send and that incoming chats too in realtime
// this is planned to be implemented with some simple logic where the data is fetched from the reatime db based on the user unique key that was generated in the chatInputFeild.tsx , using this well fetch the data from the document and then segrigate the doc based on the user id from which the message was sned and then render that into some particular widget

import * as REACT from "react"
import React, { useEffect, useState } from "react";
import { View, TextInput, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, Text } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"



const chatHolderContainer = () => {
    return (

        // this is the container that is gonna hold the code for the container that is gonna hold the text message that is being send from the user and which will be initially white in color 
        <View >

            <View style = {design.senderContainerParent}>
                <Text style={design.senderContainerDesign} >
                    Hellow this is the new keyboard from whcih ive been trying to code from and kinda feel its a bit hard to code on this as its a bit too complex to handle
                </Text>
            </View>


            <View>
                <Text style={design.recievedMessageContainerDesign} >
                    Maybe itll feel a bit hard in the starting , but as the time passes ull get used to it so dont worry , the broken keyboard on ur laptop will now be a problem once u get used to it
                </Text>
            </View>

        </View>


    );
}

const design = StyleSheet.create({

    // this is currently used to move the sender message to the extreme right of the screen , same class has not been implemented with ther recieved message as it has been placed in the left by default
    senderContainerParent : {
        alignItems : "flex-end"
        
    },

    // design for the sender code design
    senderContainerDesign: {

        backgroundColor: "#D9D9D9",
        width: 250,
        height: "auto",
        padding: 10,
        margin : 10,
        borderRadius: 15,

        fontFamily: "Jura-Bold",
        lineHeight: 20,


    },

    // design for the message being send to the logged in user from the other user
    recievedMessageContainerDesign: {

        backgroundColor: "#5F48F5",
        width: 250,
        height: "auto",
        padding: 10,
        margin : 10, 
        borderRadius: 15,

        fontFamily: "Jura-Bold",
        color: "#D9D9D9",
        lineHeight: 20,


    },



})


export default chatHolderContainer