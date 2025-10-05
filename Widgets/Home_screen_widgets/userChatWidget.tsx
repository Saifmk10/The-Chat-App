import React from "react";
import { View, Image , Text , StyleSheet, Touchable, TouchableOpacity } from "react-native";
import colors from "../../Assets/colors";
// import UserProfile from "../../Assets/images/user_profile";
import Userlogo from "../../Assets/images/user/user_logo";




const UserChat = () => {

    return (
        <View>
            {/* <Image source={require('The-Chat-App\\Assets\\images\\user_profile.svg')} /> */}
            {/* <UserProfile/> */}

            <View style = {userchatStyle.parentDesign}>
                <Userlogo style = {userchatStyle.userLogo}/>

                <View style = {userchatStyle.userDetailsParent}>
                    <Text style = {userchatStyle.userName}>SAIFMK</Text>
                    <Text style = {userchatStyle.userRecentMessage }>This is a new chat app</Text>
                </View>

                <View style = {userchatStyle.userMessageCount}>
                    <Text style = {userchatStyle.userMessageCountNumber}>1</Text>
                </View>
                
                
            </View>
        </View>
    )

}


const userchatStyle = StyleSheet.create({
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

    userRecentMessage : {
        color : colors.secondary,
        fontFamily: "Jura-Bold",
        fontSize : 12
        
    },

    userMessageCount : {
        backgroundColor : colors.message_notification,
        width : 25,
        height : 25,
        borderRadius : 30,

        marginLeft : 60,

        display : 'flex',
        alignItems : 'center',
        justifyContent : 'center'
    },

    userMessageCountNumber : {
        color : colors.secondary
    }
})

export default UserChat;