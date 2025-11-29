// this screen is responsible for the user chat screen where the users can chat with other users by sending and recieving all the messages , this is the place all the messages are rendered

import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Platform, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "../../Widgets/Users_chat_screen_widgets/userChatHeader";
import ChatInput from "../../Widgets/Users_chat_screen_widgets/chatInputField";
import ChatHolderContainer from "../../Widgets/Users_chat_screen_widgets/chatsHorderContainer";

const UsersChatPage = () => {

    const [keyboardHeight, setKeyboardHeight] = useState(0);

    useEffect(() => {
        const show = Keyboard.addListener("keyboardDidShow", (e) => {
            setKeyboardHeight(e.endCoordinates.height);
        });

        const hide = Keyboard.addListener("keyboardDidHide", () => {
            setKeyboardHeight(0);
        });

        return () => {
            show.remove();
            hide.remove();
        };
    }, []);

    return (
        <SafeAreaView style={design.safeArea} edges={["top"]}>
            <View style={design.container}>
                {/* this holds the user name and other stuffs realted to the user */}
                <Header />
                

                {/* this manages the rendering of all the chat bubbles of the users */}
                <ScrollView
                    contentContainerStyle={design.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <ChatHolderContainer />
                </ScrollView>

                {/* this is the chat input field  */}
                <View
                    style={[
                        design.chatInputWrapper,
                        { marginBottom: Platform.OS === "android" ? keyboardHeight : 0 },
                    ]}
                >
                    <ChatInput />
                </View>
            </View>
        </SafeAreaView>
    );
};

const design = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#000",
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    chatInputWrapper: {
        padding: 10,
        backgroundColor: "#000",
        borderTopColor: "#222",
        borderTopWidth: 1,
    },
});

export default UsersChatPage;
