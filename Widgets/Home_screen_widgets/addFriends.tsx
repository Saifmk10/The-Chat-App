// file that is responsible add addind a new users chat into the logedin user this is a widget that is later added into the UserChatPage.tsx file where all the widgets are added together
// this is also responsible for showing all the users that have been signed up into the application under the BUILD NEW CONNECTIONS
// contains verious operations such as adding a user by creating a new file for each user in the db 

import React, { useEffect, useState } from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

import { getAuth } from '@react-native-firebase/auth';
import { getFirestore, collection, doc, addDoc } from "@react-native-firebase/firestore";
import firestore from '@react-native-firebase/firestore';


import colors from "../../Assets/colors";
import Userlogo from "../../Assets/images/user/user_logo";
import AddButton from "../../Assets/images/addFriends/add_button_image";
import Popupmessage from "../../modal/popupMessage";

import FetchingAllUserNames from "../../Backend_logics/fetchingAllUserNames"


const AddFriends = () => {
    // need to add this dialogue box in new update
    const [checker, setChecker] = useState(true)
    console.log({ checker });


    const [userName, setUserName] = useState<string[]>([]); // state of user name is set to default and later fetched within the fetchUserName()
    const [numberOfUsers, setNumberOfUsers] = useState<number>(0); // fetching the number of user so all the users can be displayed
    const [userId, setUserId] = useState<string[]>([]);

    // this fucntion is used to fetch the username data that is being called form the server in the file fetchingAllUserNames.tsx
    const fetchUserName = async () => {
        try {
            const output = await FetchingAllUserNames();
            if (output) {
                const [name, count, uid] = output;

                // this part is responsible for fetching all the user names from the db 

                if (Array.isArray(name)) {
                    setUserName(name); // fetched user name 
                }
                if (Array.isArray(uid)) {
                    setUserId(uid); // fetched user name 
                }
                if (typeof count === "number") {
                    setNumberOfUsers(count); // fetched total user count
                }
                // fetched total user count
            }
        }
        catch (error) {
            console.log("ERROR IN FETCHING USER NAME IN FILE addFriends.tsx , error is :", error);

        }


    }

    // the function is being added into the useEffect() to avoid repeated function calls 
    useEffect(() => {
        fetchUserName() //calling the function
    }, [])



    console.log("FINAL OUTPUT FROM addFriends.tsx : ", userName);
    console.log("NUMBER OF USERS FROM addFriends.tsx : ", numberOfUsers)
    console.log("NUMBER OF USERS FROM addFriends.tsx : ", userId)


    // function responsible for adding the users into the logged in user chat
    const clickedOnUser = async (userid: string, userName: string) => {

        const db = getFirestore();
        const auth = getAuth();
        const user = auth.currentUser; 
        const currentUserID = user?.uid

        // checking ig the uid is null before running the code
        if (currentUserID) {
            try {
                console.log(`${currentUserID} CLICKED ON | USER ID : ${userid} & USER NAME :${userName} FROM addFriend.tsx`)

        //add linear search here to check preexisting uid 

                const userChatAdditionCollection = collection(db, "Users", currentUserID!, "userChat")
                const addingNewChat = await addDoc(userChatAdditionCollection, { messengerId: userid })

                console.log(`USER ${addingNewChat} HAS BEEN ADDED TO DB OF ${currentUserID} FROM addFriend.tsx`)
            }
            catch (error) {
                console.log(`${error} FROM addFriend.tsx`)
            }
        }

    }

    return (



        <View style={addFriendsStyle.mainContentParent}>

            <View style={addFriendsStyle.introParentDesign}>
                <Text style={addFriendsStyle.introTextDesign}>BUILD NEW CONNECTION</Text>
            </View>


            {/* using map here to connect the array of users and the number of user */}
            {userName.map((name, index) => (

                // the key is used the let the component know how many components it needs to render
                <TouchableOpacity onPress={async () => { await clickedOnUser(userId[index], userName[index]) }}>
                    <View key={index} style={addFriendsStyle.parentDesign}>
                        <Userlogo style={addFriendsStyle.userLogo} />

                        <View style={addFriendsStyle.userDetailsParent}>
                            <Text style={addFriendsStyle.userName}> 
                                {name}
                            </Text>
                            <Text style={addFriendsStyle.newUserCaption}>
                                Hey there let's connect
                            </Text>
                        </View>

                        <TouchableOpacity style={addFriendsStyle.addFriendButton} onPress={() => setChecker(prev => !prev)}>
                            <AddButton />
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>

            ))}


            {/*  */}

            {/* in the current situation this doesnt work as of now the pop up message isnt working  */}
            {/* <View style = {{display: checker ? 'flex' : 'none' }}>
                <Popupmessage message='Welcome Back ' buttonText='Close' />
            </View> */}


        </View>
    )

}


const addFriendsStyle = StyleSheet.create({

    mainContentParent: {
        // marginTop : 300
    },

    introTextDesign: {
        color: colors.secondary,
        fontFamily: "Jura-Bold",
        fontSize: 20,

    },

    introParentDesign: {
        margin: 9
    },



    parentDesign: {
        backgroundColor: colors.primary,
        height: 65,
        width: 320,

        marginTop: 15,

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

    newUserCaption: {
        color: colors.secondary,
        fontFamily: "Jura-Bold",
        fontSize: 12

    },

    addFriendButton: {
        display: 'flex',
        alignSelf: 'center',

        marginLeft: 50
    }
})

export default AddFriends;