import React from "react";
import { View, Text, StyleSheet, TouchableOpacity} from "react-native";
import colors from "../../Assets/colors";

const LoginSignUpToogle = () => {

    return (
        <View style={loginSignupStyle.loginToggleDiv}>
            <TouchableOpacity>
                <Text style={loginSignupStyle.loginToggleButtonsHover}>LOG IN</Text>
            </TouchableOpacity>

            <TouchableOpacity>
                <Text style={loginSignupStyle.loginToggleButtonsNoHover}>SIGN UP</Text>
            </TouchableOpacity>
        </View>
    )
}


const loginSignupStyle = StyleSheet.create({


    // holds the login toggle design for the buttons
    loginToggleDiv: {
        backgroundColor: '#D9D9D9',
        height: 55,
        width: 300,
        borderRadius: 10,
        flexDirection: 'row',

        
        borderColor : colors.gradient_secondary
        

    },

    // holds the design for the login and signup button design , when button is pressed this design is applied
    loginToggleButtonsHover: {

        backgroundColor: '#5F48F5',
        alignItems: 'center',
        padding: 8,
        margin: 8,
        borderRadius: 10,
        borderColor: '#000000',
        borderWidth: 2,

        width: 130,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: '#D9D9D9',
        fontFamily: 'Jura-Bold',
        fontSize: 16,
        letterSpacing: 1,
    },

    // when the button is not hover this design is applied
    loginToggleButtonsNoHover: {
        backgroundColor: '#D9D9D9',
        alignItems: 'center',
        padding: 8,
        margin: 8,
        borderRadius: 10,

        width: 130,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: '#000000',
        fontFamily: 'Jura-Bold',
        fontSize: 16,
        letterSpacing: 1,
    },


})

export default LoginSignUpToogle; 