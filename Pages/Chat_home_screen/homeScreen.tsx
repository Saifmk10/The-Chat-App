import React, { useState } from "react";
import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import colors from "../../Assets/colors";
import HomeToggleButton from "../../Widgets/Home_screen_widgets/chatAnonymousToggleButtons";
import UserChat from "../../Widgets/Home_screen_widgets/userChatWidget"; 
import UserProfileOptions from "../../Widgets/Home_screen_widgets/userProfileOptions";

const HomeScreen = () => {

    const [checker, setCheckerTo] = useState(true)

    return (
        <SafeAreaView style={homeStyle.parentDesign}>

            <View>
                <UserProfileOptions/>
            </View>


            <View style={homeStyle.homeToggleDesign}>
                <HomeToggleButton checker={checker} setCheckerTo={setCheckerTo} />
            </View>

            {/* here the checker is working on if the user has clicke */}
            {checker
                ?

                <View style={homeStyle.chatPlacement}>
                    <UserChat/>
                </View>

                : <Text style = {{color : colors.secondary}}>ANONYMOUS TESTING</Text>
            }




        </SafeAreaView>
    )
}


const homeStyle = StyleSheet.create({
    parentDesign: {
        backgroundColor: colors.primary,
        height: '100%',
        display: 'flex',
        alignItems: 'center'
    },

    homeToggleDesign: {
        marginTop: 50
    },

    chatPlacement: {
        marginTop: 20
    }
})


export default HomeScreen;