// this module plays a very important role , this component plays a role where it fetched all the users that the current user had added to text with, it fetched and renders the user info in a widget format

import React, { useEffect, useState } from "react";
import { View, Image, Text, StyleSheet, Touchable, TouchableOpacity , } from "react-native";
import colors from "../../Assets/colors";
import Userlogo from "../../Assets/images/user/user_logo";

import firestore from '@react-native-firebase/firestore';
import { getFirestore, collection, doc, addDoc, getDoc } from "@react-native-firebase/firestore";
import { getAuth } from '@react-native-firebase/auth';
import UserName from "../Users_chat_screen_widgets/userChatHeader";


//  function responsible for fetching all the user info
const fetchingAddedUsersInfo = async () => {

    // let [userName, setUserName] = useState<string[]>([]); 

    // fetching the current user so i can fetch all the user the current user has added to chat with
    const db = getFirestore();
    const auth = getAuth();
    const user = auth.currentUser;
    const currentUserID = user?.uid;

    let userNameArray: string[] = [];
    let userUID: string[] = [];


    console.log(`CURRRENT USER : ${currentUserID} FETCHED FROM UserChatWidget.tsx`);
    // creating a variable to hold the collection from which all the data from the db will be fetched

    // const dbRef = collection(db, "Users", currentUserID!, "userChat");
    const querySnapshot = await firestore().collection("Users").doc(currentUserID!).collection("userChat").get();


    // bellow is the function the prints all the users connection from userChats collection , uncomment only for debug purpose
    // querySnapshot.forEach(doc => {
    //     // from here ill need to fetch the data of the user name of invididiual users so i can render it down
    //     console.log("Chat doc:", doc.id, "=>", doc.data().messengerId);
    // });

    // function that is responsible for fetching all the user name from the userChat collection
    // WORK FLOW OF THE FUNCTION IS GONNA BE : fetched all the users added --> fetched the user UID from doc id --> From that user UID it fetched the username --> so well have both UID and the username (username to display , UID for the chat initialization)

    for (const doc of querySnapshot.docs) {
        
        const userDoc = await firestore()
            .collection("Users")
            .doc(doc.data().messengerId)
            .get();

        const userData = userDoc.data();

        userNameArray.push(userData?.Username)
        userUID.push(doc.data().messengerId) 

        // console.log("USERS UID FROM userChatWidget.tsx: " , )
        console.log("Chat DOC FROM userChatWidget.tsx:", doc.id, "=>", doc.data().messengerId);
        console.log("USER NAME FROM userChatWidget.tsx:", userData?.Username);
        console.log(`USER NAME ARRAY FROM userChatWidget.tsx: USERNAMES : ${userNameArray} , ${userUID}` );

    }

    return [userNameArray , userUID]; 
}





const UserChat = () => {
    const [userData, setUserData] = useState<{ userNameArray: string[], userUID: string[] }>({ userNameArray: [], userUID: [] });

    // useEffect has been implemented to run the fucntion as soon as the app is loaded
    useEffect(() => {
  const autoCalling = async () => {
    const [userNameArray, userUID] = await fetchingAddedUsersInfo();
    setUserData({ userNameArray, userUID });
  };
  autoCalling();
}, []);   

    return (


        
        <View>
           
            {userData.userNameArray.map((name, index) => (
                <TouchableOpacity key={index} onPress={async () => { await fetchingAddedUsersInfo() }}>
                    <View style={userchatStyle.parentDesign}>
                        <Userlogo style={userchatStyle.userLogo} />

                        <View style={userchatStyle.userDetailsParent}>
                            <Text style={userchatStyle.userName}>{name}</Text>
                            <Text style={userchatStyle.userRecentMessage}>This is a new chat app</Text>
                        </View>

                        <View style={userchatStyle.userMessageCount}>
                            <Text style={userchatStyle.userMessageCountNumber}>1</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            ))}
        
            

        </View>
    )

}


const userchatStyle = StyleSheet.create({
    parentDesign: {
        backgroundColor: colors.primary,
        height: 65,
        width: 320,
        marginBottom : 15,

        borderRadius: 30,
        borderWidth: 2,
        borderColor: colors.secondary,

        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden'
    },

    userLogo: {
        height: 10,
        width: 10,
        margin: 5
    },


    userDetailsParent: {
        display: 'flex',
        overflow: 'hidden',
        marginLeft: 5
    },

    userName: {
        color: colors.secondary,
        fontFamily: "Jura-Bold",
        fontSize: 18
    },

    userRecentMessage: {
        color: colors.secondary,
        fontFamily: "Jura-Bold",
        fontSize: 12

    },

    userMessageCount: {
        backgroundColor: colors.message_notification,
        width: 25,
        height: 25,
        borderRadius: 30,

        marginLeft: 60,

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },

    userMessageCountNumber: {
        color: colors.secondary
    }
})

export default UserChat;