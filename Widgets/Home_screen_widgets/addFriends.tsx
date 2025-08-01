import React, { useState } from "react";
import { View, Image , Text , StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import colors from "../../Assets/colors";
import Userlogo from "../../Assets/images/user_logo";
import AddButton from "../../Assets/images/addFriends/add_button_image";
import Popupmessage from "../../modal/popupMessage";

import FetchingAllUserNames from "../../DataFetching/fetchingAllUserNames"


const UserChat = () => {
    // need to add this dialogue box in new update
    const [checker , setChecker] = useState(true)
    console.log({checker});


    const [userName , setUserName] = useState("loading...") // state of user name is set to default and later fetched within the fetchUserName()

    // this fucntion is used to fetch the username data that is being called form the server in the file fetchingAllUserNames.tsx
        const fetchUserName = async () =>{
            try{
                const output  = await FetchingAllUserNames();
                return setUserName(output);
            }
            catch (error){
                console.log("ERROR IN FETCHING USER NAME IN FILE addFriends.tsx , error is :" , error);
            }

            
        }
        fetchUserName() //calling the function
    
        console.log("FINAL OUTPUT FROM addFriends.tsx : " , userName);


    return (

        
        
        <View style = {addFriendsStyle.mainContentParent}>

            <View style = {addFriendsStyle.introParentDesign}>
                <Text style = {addFriendsStyle.introTextDesign}>BUILD NEW CONNECTION</Text>
            </View>

            
            <View style = {addFriendsStyle.parentDesign}>
                <Userlogo style = {addFriendsStyle.userLogo}/>

                <View style = {addFriendsStyle.userDetailsParent}>
                    <Text style = {addFriendsStyle.userName}>{userName}</Text>
                    <Text style = {addFriendsStyle.newUserCaption }>Hey there let's connect</Text>
                </View>

                 <TouchableOpacity style = {addFriendsStyle.addFriendButton} onPress={() => setChecker(prev => !prev)}>
                    <AddButton/>
                </TouchableOpacity>
            </View>

            {/* in the current situation this doesnt work as of now the pop up message isnt working  */}
            {/* <View style = {{display: checker ? 'flex' : 'none' }}>
                <Popupmessage message='Welcome Back ' buttonText='Close' />
            </View> */}
            

        </View>
    )

}


const addFriendsStyle = StyleSheet.create({

    mainContentParent : {
        // marginTop : 300
    },

    introTextDesign : {
        color : colors.secondary,
        fontFamily: "Jura-Bold",
        fontSize : 20,
        
    },

    introParentDesign : {
        margin : 9
    },



    parentDesign : {
        backgroundColor : colors.primary, 
        height : 65,
        width : 320, 

        borderRadius : 30,
        borderWidth : 2,
        borderColor : colors.secondary,

        display: 'flex',
        flexDirection : 'row',
        alignItems : 'center',
        overflow : 'hidden'
    },

    userLogo : {
        height : 10, 
        width : 10, 
        margin : 5
    },


    userDetailsParent : {
        display : 'flex',
        overflow : 'hidden',
        marginLeft : 5
    },
    
    userName : {
        color : colors.secondary,
        fontFamily: "Jura-Bold",
        fontSize : 18
    },

    newUserCaption : {
        color : colors.secondary,
        fontFamily: "Jura-Bold",
        fontSize : 12
        
    },

    addFriendButton : {
        display : 'flex',
        alignSelf : 'center',

        marginLeft : 50
    }
})

export default UserChat;