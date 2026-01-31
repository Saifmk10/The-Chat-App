import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import { View, Text, SafeAreaView, StyleSheet, ScrollView, TouchableOpacity, Animated} from "react-native";
import { useNavigation } from "@react-navigation/native";

import colors from "../../Assets/colors";
import HomeToggleButton from "../../Widgets/Home_screen_widgets/updatesToAgentToggleButtons";
// import UserChat from "../../Widgets/Home_screen_widgets/userChatWidget";
import UserProfileOptions from "../../Widgets/Home_screen_widgets/userProfileOptions";
// import AddFriends from "../../Widgets/Home_screen_widgets/addFriends"
// import StockScreen from "../Agent_home_screen/agentScreen";
// import StockAgentOperationsScreen from "../Stock_agent_screen/stockAgentPage"
// import Popupmessage from "../../modal/popupMessage";

const HomeScreen = () => {

    const [checker, setCheckerTo] = useState(true)
    const navigation = useNavigation<any>()
    
    useFocusEffect(useCallback(()=>{setCheckerTo(true)} , [])) // used to set back the toggle into true state so when user returns user will be able to go into the news and not see blank screen

    useEffect(()=>{  if (!checker) {navigation.navigate("StockAgentScreen")}   },[checker]) // used to navigate to a new page where the stock agent is present
                                                                                            //[checker] says the react to nvigate to the screen only when the checker state changes 

    // const navigateToNews = () =>{
    //     navigation.navigate("UsersChatPage")
    //     console.log("CLICKED ON USERS CHAT FROM homeScreen.tsx")
    // }     

    // const navigateStockAgent = () =>{
    //     navigation.navigate("StockAgentScreen")
    //     console.log("CLICKED ON STOCK AGENT FROM homeScreen.tsx")
    // }

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
                    {/* {checker */}
                        {/* ? */}

                        {/* <View style={homeStyle.chatPlacement}> */}
                            {/* <TouchableOpacity onPress={navigateToNews}> */}
                            {/* <UserChat /> */}
                            {/* </TouchableOpacity> */}

                            {/* <View style = {homeStyle.addFriendsContainer}> */}
                                {/* <AddFriends/> */}
                            {/* </View> */}
                            
                        {/* </View> */}



                        {/* // : navigation.navigate("StockAgentScreen")
                        // the navigation to the market page needs to happen from here */}
                    {/* } */}


                    {/* custom made modal with props for the popup message when the user logs into the account */}
                    {/* <Popupmessage message='Welcome Back ' buttonText='Close' /> */}
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