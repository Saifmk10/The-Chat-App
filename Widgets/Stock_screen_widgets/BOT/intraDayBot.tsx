// this module plays a very important role , this component plays a role where it fetched all the users that the current user had added to text with, it fetched and renders the user info in a widget format
// there is a bug in this even when a user is deleted its shown as user so need to check individual users db
import auth from '@react-native-firebase/auth';
import { getDatabase, ref, push, set } from '@react-native-firebase/database';
import { getApp } from '@react-native-firebase/app';
import React, { useEffect, useState } from "react";
import { View, Image, Text, StyleSheet, Touchable, TouchableOpacity, } from "react-native";
import { useNavigation } from '@react-navigation/native';
import colors from "../../../Assets/colors";
import Userlogo from "../../../Assets/images/user/user_logo";




    const user = auth().currentUser;
    const currentUserID = user?.uid;
    const botId = "BOT"

    // usestate prop used to take the the user input from the text feild
    


    // useEffect(()=>{
    //     creatingUserKey()
    // })


const IntraDayBot = () => {


    const[Message , SetMessage] = useState("");
    SetMessage("WELCOME TO AI")
    const [USER_KEY , SETUSER_KEY] = useState<string>("");




    // function that is responsible for generating the unique USER_KEY for each new chat
    const creatingUserKey = async () => {

        console.log(`USER ${currentUserID} READY TO CHAT WITH ${botId} FROM chatInputFeild.tsx`)
        let key : string = "";

        // creating a user key so that each time a user opens a new chat it doesnt need to create unique session ids , and using the user key we can store that data easily
        if (currentUserID && botId) {
            key = currentUserID < botId ? `${currentUserID}_${botId}` : `${botId}_${currentUserID}`;
            SETUSER_KEY(key);
            console.log(`USER KEY CREATED : ${key} FROM chatInputField.tsx`);
        }
        else {
            console.log("Missing user IDs — couldn't create chat key FROM chatInputField.tsx");
        }

        console.log(`USER KEY OF THE USERS MESSAGING IS : ${key} FROM chatInputField.tsx`);

        if (key){
            const db = getDatabase(getApp(), "https://the-chat-44e8e-default-rtdb.asia-southeast1.firebasedatabase.app"); // here ive added this url as the firebase has asked to add the url if the location of the realtime db is not set as default location , im my case ive changed the location
            const messageRef = push(ref(db, `UserChat/${key}`));
        }

        return key;
    }

    // i feel ill add this to send the welcome message and the instruction for the bot
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





    const navigation = useNavigation<any>();

    const [userData, setUserData] = useState<{ userName: string; userUID: string }[]>([]);

    // need to implement another function here that will navigate into the users chat page along with the UID
    const fetchingUserInfo = (UserName: String, userUID: String) => {
        console.log(`USER CLICKED ON ${UserName}`)
        console.log(`USER ID : ${userUID}`)

        navigation.navigate("UsersChatPage", { UserName, userUID });
        return [UserName, userUID]
    }

    return (



        <View>

            {/* {userData.map((user, index) => ( */}
                {/* // this checks if there is a user name present in the doc that was creted in the  */}
                {/* // user?.userName ? ( */}
                    {/* <TouchableOpacity key={index} onPress={() => fetchingUserInfo(user.userName, user.userUID)}></TouchableOpacity> */}
                    <TouchableOpacity onPress={()=>{creatingUserKey()}}>
                        <View style={userchatStyle.parentDesign}>
                            <Userlogo style={userchatStyle.userLogo} />

                            <View style={userchatStyle.userDetailsParent}>
                                {/* <Text style={userchatStyle.userName}>{user.userName}</Text> */}
                                <Text style={userchatStyle.userName}>INTRA DAY</Text>
                                <Text style={userchatStyle.userRecentMessage}>This is a new chat app</Text>
                            </View>


                            {/* this is the notification section , currently removed but needs to be added later  */}
                            {/* <View style={userchatStyle.userMessageCount}>
                            <Text style={userchatStyle.userMessageCountNumber}>1</Text>
                        </View> */}
                        </View>
                    </TouchableOpacity>

                {/* // ) : null */}

            {/* ))} */}



        </View>
    )

}


const userchatStyle = StyleSheet.create({
    parentDesign: {
        backgroundColor: colors.primary,
        height: 65,
        width: 320,
        marginBottom: 15,

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

export default IntraDayBot;