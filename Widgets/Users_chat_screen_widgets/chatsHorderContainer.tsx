// this is a file that is responsible for holding and rendering of all the chats if the users . both being send and that incoming chats too in realtime
// this is planned to be implemented with some simple logic where the data is fetched from the reatime db based on the user unique key that was generated in the chatInputFeild.tsx , using this well fetch the data from the document and then segrigate the doc based on the user id from which the message was sned and then render that into some particular widget

import * as REACT from "react"
import React, { useEffect, useState } from "react";
import { View, TextInput, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, Text } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import FetchingUserKey from "../Users_chat_screen_widgets/chatInputField";

import { getDatabase, ref, push, set, onValue, query } from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import { getApp } from '@react-native-firebase/app';






const chatHolderContainer = () => {

    // create a function that is gonna fetch the current user 
    // then within the same function write the logic for the user message segrigation according to the users user id
    // provide a way in whcih all the messages can be rendered using the key property

    // const checking = UserKeyCreation()

    // useEffect(()=>{console.log(`PRINTING THE USERS ID FOR TESTING FROM THE chatsHorderConatainer,tsx : ${checking}`)} , [])




    // this route is used to fetch the user name and the user id from the rendered chat name .
    const route = useRoute<any>();
    const { UserName, userUID } = route.params;

    // fetching the user id of the current logged in user
    const user = auth().currentUser;
    const currentUserID = user?.uid;

    // usestate prop used to take the the user input from the text feild
    const [USER_KEY, SETUSER_KEY] = useState<string>("");
    let key: string = "";

    // logic functions bellow 


    // this function is responsiblke for fetching the userKey and cheking that particular user key to check for any messages available and will be rendering it after the segregation
    const cheakingForUserKey = async () => {

        console.log(`USER ${currentUserID} READY TO CHAT WITH ${userUID} FROM chatsholderContainer.tsx`)


        // creating a user key so that each time a user opens a new chat it doesnt need to create unique session ids , and using the user key we can store that data easily
        if (currentUserID && userUID) {
            key = currentUserID < userUID ? `${currentUserID}_${userUID}` : `${userUID}_${currentUserID}`;
            SETUSER_KEY(key);

        }
        else {
            console.log("Missing user IDs — couldn't create chat key FROM chatsholderContainer.tsx");
        }

        console.log(`USER KEY CREATED : ${key} FROM chatsholderContainer.tsx `);

    }

    const fetchingChatFormIndividualUsers = () => {
        const db = getDatabase(
            getApp(),
            "https://the-chat-44e8e-default-rtdb.asia-southeast1.firebasedatabase.app"
        );

        if (!USER_KEY) {
            console.log(" USER_KEY not found — cannot fetch messages. FROM chatsHolderContainer.tsx");
            return;
        }

        const messageRef = ref(db, `UserChat/${USER_KEY}`);
        console.log(`Fetching messages from path: UserChat/${USER_KEY} FROM chatsHolderContainer.tsx`);

        onValue(messageRef, (snapshot) => {
            if (snapshot.exists()) {
                console.log(
                    ` MESSAGES FETCHED FROM chatHolderContainer.tsx (${USER_KEY}):`,
                    snapshot.val()
                );
            } else {
                console.log(` No data found for this user key (${USER_KEY}) FROM chatsHolderContainer.tsx`);
            }


            let messageMetaData = snapshot.val()


            const messageArray = Object.keys(messageMetaData).map(key => {
                return {
                    id: key,
                    ...messageMetaData[key]
                }
            })

            console.log(` MESSAGE META DATA HAS BEEN FETCHED FORM THE SNAPSHOT : ${JSON.stringify(messageArray, null, 2)}`);

            const messagesWithSender = messageArray.map(item => ({
                message: item.Message,
                sender: item.Sender
            }))

            console.log("Messages with sender:", messagesWithSender);
        });
    };




    // running the function as soon as the screen is loaded to reduce the delay and to ensure smooth operation
    useEffect(() => {


        if (USER_KEY) {
            fetchingChatFormIndividualUsers();
        }

        cheakingForUserKey()


    }, [USER_KEY])




    return (

        // this is the container that is gonna hold the code for the container that is gonna hold the text message that is being send from the user and which will be initially white in color 
        <View >

            <View style={design.senderContainerParent}>
                <Text style={design.senderContainerDesign} >
                    Hello this is the new keyboard from whcih ive been trying to code from and kinda feel its a bit hard to code on this as its a bit too complex to handle
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
    senderContainerParent: {
        alignItems: "flex-end"

    },

    // design for the sender code design
    senderContainerDesign: {

        backgroundColor: "#D9D9D9",
        width: 250,
        height: "auto",
        padding: 10,
        margin: 10,
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
        margin: 10,
        borderRadius: 15,

        fontFamily: "Jura-Bold",
        color: "#D9D9D9",
        lineHeight: 20,


    },



})


export default chatHolderContainer   