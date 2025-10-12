// this function manages a widget within the chat screen , it hold the user name of the person the logged in user will be texting along with a back button. Back button will help u navigate to the home screen

import React, { useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useNavigation , useRoute } from "@react-navigation/native";
import UserProfile from "../../Assets/images/chatScreen_userProfile/userProfile";
import BackButton from "../../Assets/images/chatScreen_userProfile/backbutton";
import UserChatWidget from "../../Widgets/Home_screen_widgets/userChatWidget";



const UserName = () => {

    const navigation = useNavigation<any>();

    // making use of the useRoute and fetching the data from the userChatWidget.tsx
    const route = useRoute<any>();
    const {UserName , userUID} = route.params;

    useEffect(()=>{
        console.log(`NAVIGATED TO CHAT SCREEN WITH USER ID : ${userUID} FROM userChatHeader.tsx`)
    } , [])

    const navigateBacktoHomeScreen = () => {
        (navigation).navigate("HomeScreen");
        console.log("CLICKED ON BACK BUTTON FROM userChatHeader.tsx");
    
    };

    


    return (
        <View style={design.mainParentDesign}>

            <TouchableOpacity onPress={navigateBacktoHomeScreen}>
                <BackButton />
            </TouchableOpacity>

            <UserProfile />

            <View>
                <Text style={design.userNameDesign}>{UserName}</Text>
                <Text style={design.userLastSeen}>5 mins ago</Text>
            </View>

        </View>
    )
}


const design = StyleSheet.create({
    mainParentDesign: {
        // backgroundColor : "#5F48F5",
        height: 50,

        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "row",
        gap: 10,

        paddingLeft: 15,

        borderBottomWidth: 1,
        borderBottomColor: "#D9D9D9"
    },

    userNameDesign: {
        color: "#D9D9D9",
        fontFamily: "Jura-Bold",
        fontSize: 17
    },
    userLastSeen : {
        color: "#D9D9D9",
        fontFamily: "Jura-Bold",
        fontSize: 10
    }
})

export default UserName;