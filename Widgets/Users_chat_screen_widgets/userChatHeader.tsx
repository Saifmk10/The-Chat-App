import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import UserProfile from "../../Assets/images/chatScreen_userProfile/userProfile";
import BackButton from "../../Assets/images/chatScreen_userProfile/backbutton";
import HomeScreen from "../../Pages/Chat_home_screen/homeScreen"



const UserName = () => {

    const navigation = useNavigation();

    const navigateBacktoHomeScreen = () => {
        (navigation as any).navigate("HomeScreen");
        console.log("CLICKED ON BACK BUTTON FROM ");
    };


    return (
        <View style={design.mainParentDesign}>

            <TouchableOpacity onPress={navigateBacktoHomeScreen}>
                <BackButton />
            </TouchableOpacity>


            <UserProfile />

            <View>
                <Text style={design.userNameDesign}>SAIFMK</Text>
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