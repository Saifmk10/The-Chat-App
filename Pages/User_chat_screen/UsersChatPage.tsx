import React from "react";
import { View , Text , StyleSheet , KeyboardAvoidingView , Platform} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "../../Widgets/Users_chat_screen_widgets/userChatHeader.tsx"
import ChatInput from "../../Widgets/Users_chat_screen_widgets/chatInputField.tsx"

// The user name is being fetched in the userChatHeader.tsx file itself nothing else happeing there other than this fetching. 
// The User Key has been created in the chatInputField.tsx where most of the chat logic is gonna be happening. 
// This file is only ment to merge all of those together so if any complexity or updates only ref to the above files mentioned 


const UsersChatPage = () =>{ 

    return (

        <SafeAreaView style = {design.homeScreenColor}>
        <KeyboardAvoidingView style = {{flex : 1}} behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}  >
            
            <View>
                <Header/>
            </View>


            <View style={design.chatArea}>
                {/* chat here */}
            </View>
            
            <View style = {design.chatInputDesign}>
                <ChatInput/>
            </View>
        </KeyboardAvoidingView>
        </SafeAreaView>
        
    )

    

}

const design = StyleSheet.create({
    homeScreenColor : {
        flex:1,
        backgroundColor : "#000000"
    },

    headerDesign : {
        padding : 20
    },

    chatArea : {
        flex : 1,
        flexGrow : 1
    },
    

    chatInputDesign :{
        borderTopWidth: 1,
        // borderTopColor: "#222",
        padding: 10,
        justifyContent: "flex-end",
        // backgroundColor: "#000",
        
    }
})

export default UsersChatPage;