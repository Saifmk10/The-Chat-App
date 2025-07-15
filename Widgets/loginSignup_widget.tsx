import React from "react";
import { View , Text, StyleSheet , TouchableOpacity} from "react-native";
import LinearGradient from "react-native-linear-gradient";

const loginSignup = () =>{
    return(
        
        <LinearGradient colors={['#000000' , '#5F48F5']} style = {{height: '100%'}} locations={[0.65, 1]}>
            <View>
                <Text style = {loginSignupStyle.font}>STAY CONNECTED , FEEL CLOSER</Text>
            </View>
        </LinearGradient>

        
    )
}

const loginSignupStyle = StyleSheet.create({

    background:{
        backgroundColor : '#000000'
    },

    font: {
        color : '#D9D9D9',
        fontSize : 40,
        fontFamily: 'Micro5-Regular'
    }


})

export default  loginSignup;