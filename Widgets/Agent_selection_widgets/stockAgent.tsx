// this is the finance agent widget code , here some logic realted to the database will happen on click for the first time and nothing more , but this code is static as of now
// this will later transition into another page that will contain all the stock related stuff you can do in the app
import React, { useEffect } from "react";
import StockGraphImage from "../../Assets/images/agents/stockGraph"
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from '@react-navigation/native';

import { getAuth } from '@react-native-firebase/auth';
import { getFirestore, collection, doc, addDoc, setDoc } from "@react-native-firebase/firestore";

import stockAgentScreen from "../../Pages/Stock_agent_screen/stockAgentPage";






const stockAgent = () => {
     const navigation = useNavigation<any>()

    // useEffect(() => {
    //     console.log("USER NAME = " , creatingUserDocForAgent())
    // })
    const creatingUserDocForAgent = () => {

    // this is gonna fetch the current users uid so it can be accessd and then doc can be created to that specific uid only
    const fireBaseUser = getAuth();
    const db = getFirestore()
    const loggedinUser = fireBaseUser.currentUser?.uid;
   

    // const agentCollectionRef = collection(db, "Users", loggedinUser!, "agent");

    // addDoc(agentCollectionRef, {});
    if (loggedinUser) {
        try {
            setDoc(doc(db, "Users", loggedinUser!, "Agents", "Finance"), {
                lastUsed: new Date().toLocaleString()
            });
            navigation.navigate("StockAgentScreen");
        
        }
        catch (error) {
            console.log(`ERROR TO ACCESS OR ADD A NEW DOC FOR AGENT FROM stockAgent.tsx error is : ${error}`)
        }
    }

}

    return (
        <SafeAreaView >

            <TouchableOpacity onPress={() => creatingUserDocForAgent()}>
                <LinearGradient colors={['#000000', '#372A8F']} locations={[0.02, 1]} style={style.parentContainer}>

                    <View style={style.parentDisplay}>
                        <StockGraphImage />

                        <Text style={style.mainText}>FINANCE</Text>
                        <Text style={style.subText}>Analyze • Learn • Implement</Text>
                    </View>

                </LinearGradient>
            </TouchableOpacity>
        </SafeAreaView>
    )
}


const style = StyleSheet.create({
    parentContainer: {
        height: 180,
        width: 180,
        backgroundColor: "#372A8F",
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",

        borderWidth: 1,
        borderColor: "#FFFF"
    },
    parentDisplay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },



    mainText: {
        color: "#ffff",
        fontFamily: "Jura-Bold",
        fontSize: 20

    },

    subText: {
        color: "#ffff",
        fontFamily: "Jura-Bold",
        fontSize: 10
    }
})
export default stockAgent