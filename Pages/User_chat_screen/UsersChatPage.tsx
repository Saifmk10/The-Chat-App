import React from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "../../Widgets/Users_chat_screen_widgets/userChatHeader.tsx";
import ChatInput from "../../Widgets/Users_chat_screen_widgets/chatInputField.tsx";
import ChatHolderContainer from "../../Widgets/Users_chat_screen_widgets/chatsHorderContainer.tsx";


const UsersChatPage = () => {
    return (
        <SafeAreaView style={design.homeScreenColor}>
            <View>
                <Header />
            </View>
            
            {/* Wrap the chat area and input in KeyboardAvoidingView */}
            <KeyboardAvoidingView 
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
            >
                <ScrollView 
                    contentContainerStyle={design.chatArea} 
                    keyboardShouldPersistTaps="handled" // Essential for input focus
                >
                    <ChatHolderContainer />
                </ScrollView>
                
                {/* The input field is now inside the keyboard-aware view */}
                <View style={design.chatInputDesign}>
                    <ChatInput />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const design = StyleSheet.create({
    homeScreenColor: {
        flex: 1,
        backgroundColor: "#000000"
    },
    // The chatArea style now belongs to the ScrollView's contentContainerStyle
    chatArea: {
        flexGrow: 1,
        padding: 10
    },
    chatInputDesign: {
        borderTopWidth: 1,
        borderTopColor: "#222",
        padding: 10,
        justifyContent: "flex-end",
    }
});

export default UsersChatPage;

