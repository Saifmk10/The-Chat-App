import React from "react";
import { View , Text , StyleSheet} from "react-native";
import UserName from "../../Widgets/Users_chat_screen_widgets/userChatHeader.tsx"
import { SafeAreaView } from "react-native-safe-area-context";
import HomeScreen from "../../Pages/Chat_home_screen/homeScreen"



const UsersChatPage = () =>{ 

    return (

        <SafeAreaView style = {design.homeScreenColor}>
            <View >
                <UserName/>
            </View>
        </SafeAreaView>
        
    )

    

}

const design = StyleSheet.create({
    homeScreenColor : {
        flex:1,
        backgroundColor : "#000000"
    },
})

export default UsersChatPage;