// The user name is being fetched in the userChatHeader.tsx file itself nothing else happeing there other than this fetching. 
// The User Key has been created in the chatInputField.tsx where most of the chat logic is gonna be happening. 
// This file is only ment to merge all of those together so if any complexity or updates only ref to the above files mentioned 

import React from "react";
import { View , Text , StyleSheet , KeyboardAvoidingView , Platform , ScrollView} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "../../Widgets/Users_chat_screen_widgets/userChatHeader.tsx"
import ChatInput from "../../Widgets/Users_chat_screen_widgets/chatInputField.tsx"
import ChatHolderContainer from "../../Widgets/Users_chat_screen_widgets/chatsHorderContainer.tsx"


const UsersChatPage = () =>{ 

    return (

        <SafeAreaView style = {design.homeScreenColor}>
        <KeyboardAvoidingView style = {{flex : 1}} behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}  >
            
            <View>
                <Header/>
            </View>
          
          <ScrollView>
            <View style={design.chatArea}>
                <ChatHolderContainer/>
            </View>
          </ScrollView>
            
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
        flexGrow : 1,
        padding : 10
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