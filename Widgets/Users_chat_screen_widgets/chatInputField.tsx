// this file is responsible for creating the unique chat id for all the users with hooks called USER_KEY
// this file also contains the whole chat logic , connection to the realtime db any errors occur in the chat logic have a look into the 

import * as REACT from "react"
import React, { useEffect, useState } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity , FlatList} from "react-native"
import { useRoute } from "@react-navigation/native";
import SendButton from "../../Assets/images/chatScreen_userProfile/sendButton"

import auth from '@react-native-firebase/auth';
import firestore, { firebase, Timestamp } from '@react-native-firebase/firestore';
import { getDatabase, ref, push, set } from '@react-native-firebase/database';
import database from '@react-native-firebase/database';
import { getApp } from '@react-native-firebase/app';


const ChatInput = () => {


    // this route is used to fetch the user name and the user id from the rendered chat name .
    const route = useRoute<any>();
    const { UserName, userUID } = route.params;

    

    // fetching the user id of the current logged in user
    const user = auth().currentUser;
    const currentUserID = user?.uid;

    // usestate prop used to take the the user input from the text feild
    const[Message , SetMessage] = useState("");
    const [USER_KEY , SETUSER_KEY] = useState<string>("");


    // logic functions bellow 


    // function that is responsible for generating the unique USER_KEY for each new chat
    const creatingUserKey = async () => {

        console.log(`USER ${currentUserID} READY TO CHAT WITH ${userUID} FROM chatInputFeild.tsx`)
        let key : string = "";

        // creating a user key so that each time a user opens a new chat it doesnt need to create unique session ids , and using the user key we can store that data easily
        if (currentUserID && userUID) {
            key = currentUserID < userUID ? `${currentUserID}_${userUID}` : `${userUID}_${currentUserID}`;
            SETUSER_KEY(key);
            console.log(`USER KEY CREATED : ${key} FROM chatInputField.tsx`);
        }
        else {
            console.log("Missing user IDs — couldn't create chat key FROM chatInputField.tsx");
        }

        console.log(`USER KEY OF THE USERS MESSAGING IS : ${key} FROM chatInputField.tsx`);

        return key;
    }


    // function that is used to push the message from the input feild to the realtime database
    const sendingMessage = async (USER_KEY: string, userId: string ) => {

        try {
            let time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const db = getDatabase(getApp(), "https://the-chat-44e8e-default-rtdb.asia-southeast1.firebasedatabase.app"); // here ive added this url as the firebase has asked to add the url if the location of the realtime db is not set as default location , im my case ive changed the location
            const messageRef = push(ref(db, `UserChat/${USER_KEY}`));
            await set(messageRef, {
                Sender: userId,
                Message: Message, 
                Time: time
            });
            console.log(`MESSAGE SENT TO FIRE BASE FROM chatInputField.tsx to ${USER_KEY}`);
        } catch (error) {
            console.error("ERROR IN SENDING MESSAGE FROM chatInputField.tsx", error);
        }

    };



    // calling the function responsible for creating the USER_KEY a unique key so that as soon as the user clicks on to chat with another user the key is generated instantly 
    useEffect(() => {
        creatingUserKey()
    }, [])



    return (
        <View style={design.parent}>

            {/* <TouchableOpacity > */}
            <TextInput style={design.inputFieldDesign} placeholder="Message" autoCorrect multiline numberOfLines={6} onChangeText={text =>SetMessage(text)} value={Message}/>

            <TouchableOpacity
                style={design.buttonDesign}
                onPress={async () => {
                    if(currentUserID){
                        sendingMessage(USER_KEY , currentUserID)
                        SetMessage("");
                    }
                    else{
                        console.log("ERROR FROM THE FUNCTION CALL FROM chatInputFeild.tsx")
                    }
                    
                }}
            >
                <SendButton />
            </TouchableOpacity>
            {/* </TouchableOpacity> */}


        </View>
    )
}

const design = StyleSheet.create({
    parent: {
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        flexDirection: "row",
        gap: 15
    },

    buttonDesign: {
        padding: 5
    },

    inputFieldDesign: {
        height: "auto",
        width: 280,
        backgroundColor: "#000000",

        borderColor: "#D9D9D9",
        borderWidth: 2,
        borderRadius: 15,
        padding: 10,
        fontFamily: "Jura-Bold",
        color: "#FFFFFF",

    }
})

export default ChatInput    