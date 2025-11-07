import React from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "../../Widgets/Users_chat_screen_widgets/userChatHeader";
import ChatInput from "../../Widgets/Users_chat_screen_widgets/chatInputField";
import ChatHolderContainer from "../../Widgets/Users_chat_screen_widgets/chatsHorderContainer";

const UsersChatPage = () => {
    return (
        <SafeAreaView style={design.safeArea} edges={["top", "bottom"]}>
            <View style={design.container}>
                <Header />
                
                <KeyboardAvoidingView
                    style={design.keyboardAvoid}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -30} // prevents Android gap
                >
                    <ScrollView
                        contentContainerStyle={design.scrollContent}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <ChatHolderContainer />
                    </ScrollView>

                    <View style={design.chatInputWrapper}>
                        <ChatInput />
                    </View>
                </KeyboardAvoidingView>
            </View>
        </SafeAreaView>
    );
};

const design = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#000000",
    },
    container: {
        flex: 1,
    },
    keyboardAvoid: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    chatInputWrapper: {
        borderTopWidth: 1,
        borderTopColor: "#222",
        padding: 10,
        backgroundColor: "#000000",
        justifyContent: "flex-end",
    },
});

export default UsersChatPage;
