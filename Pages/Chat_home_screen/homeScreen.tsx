import React, { useState, } from "react";
import LinearGradient from "react-native-linear-gradient";
import { View, Text, SafeAreaView, StyleSheet, ScrollView, } from "react-native";
import colors from "../../Assets/colors";
import HomeToggleButton from "../../Widgets/Home_screen_widgets/chatAnonymousToggleButtons";
import UserChat from "../../Widgets/Home_screen_widgets/userChatWidget";
import UserProfileOptions from "../../Widgets/Home_screen_widgets/userProfileOptions";
import AddFriends from "../../Widgets/Home_screen_widgets/addFriends"

import Popupmessage from "../../modal/popupMessage";

import FetchingAllUserNames from "../../DataFetching/fetchingAllUserNames"

const HomeScreen = () => {

    const [checker, setCheckerTo] = useState(true)

    const output = FetchingAllUserNames()

    console.log({ output })


    return (

        <LinearGradient colors={['#000000', '#5F48F5']} style={{ height: '100%' }} locations={[0.65, 1]}>

            <ScrollView>
                <SafeAreaView style={homeStyle.parentDesign}>
                    
                    <View>
                        <UserProfileOptions />
                    </View>


                    <View style={homeStyle.homeToggleDesign}>
                        <HomeToggleButton checker={checker} setCheckerTo={setCheckerTo} />
                    </View>

                    {/* here the checker is working on if the user has clicke */}
                    {checker
                        ?

                        <View style={homeStyle.chatPlacement}>
                            <UserChat />

                            <View style = {homeStyle.addFriendsContainer}>
                                <AddFriends/>
                            </View>
                            
                        </View>



                        : <Text style={{ color: colors.secondary }}>ANONYMOUS TESTING</Text>
                    }


                    {/* custom made modal with props for the popup message when the user logs into the account */}
                    <Popupmessage message='Welcome Back ' buttonText='Close' />
                </SafeAreaView>
            </ScrollView>
        </LinearGradient>

    )
}


const homeStyle = StyleSheet.create({
    parentDesign: {
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        flex: 1
    },

    homeToggleDesign: {
        marginTop: 50
    },

    chatPlacement: {
        marginTop: 20
    },

    addFriendsContainer : {
        marginTop : 50
    }
})


export default HomeScreen;