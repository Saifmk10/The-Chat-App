import React from "react";
import { View , Text , StyleSheet , KeyboardAvoidingView , Platform} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "../../Widgets/Users_chat_screen_widgets/userChatHeader.tsx"
import ChatInput from "../../Widgets/Users_chat_screen_widgets/chatInputField.tsx"



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