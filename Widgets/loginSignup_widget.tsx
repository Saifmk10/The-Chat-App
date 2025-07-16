import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import LinearGradient from "react-native-linear-gradient";
// import { Color } from "react-native/types_generated/Libraries/Animated/AnimatedExports";

const loginSignup = () => {
    return (

        <LinearGradient colors={['#000000', '#5F48F5']} style={{ height: '100%' }} locations={[0.65, 1]}>
            <View style={loginSignupStyle.displayType}>

                <Text style={loginSignupStyle.font}>STAY CONNECTED , FEEL CLOSER</Text>

                <View style={loginSignupStyle.loginFormAndButtonParent}>
                    {/* login , Signup toggle buttons */}
                    <View style={loginSignupStyle.loginToggleDiv}>
                        <TouchableOpacity>
                            <Text style={loginSignupStyle.loginToggleButtonsHover}>LOG IN</Text>
                        </TouchableOpacity>

                        <TouchableOpacity>
                            <Text style={loginSignupStyle.loginToggleButtonsNoHover}>SIGN UP</Text>
                        </TouchableOpacity>
                    </View>

                    {/* login , Signup form */}
                    <View style={loginSignupStyle.loginFormParent}>
                        <TextInput placeholder="Username" placeholderTextColor="#000000" cursorColor={'#000000'} style={loginSignupStyle.loginFormInput} />
                        <TextInput placeholder="Password" placeholderTextColor="#000000" cursorColor={'#000000'} style={loginSignupStyle.loginFormInput} />
                    </View>
                </View>

            </View>
        </LinearGradient>


    )
}

const loginSignupStyle = StyleSheet.create({

    font: {
        color: '#D9D9D9',
        fontSize: 40,
        fontFamily: 'Micro5-Regular',
    },

    // holds the display type of this page
    displayType: {
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',

    },


    loginFormAndButtonParent: {
        marginTop: 100
    },

    // holds the login toggle design for the buttons
    loginToggleDiv: {
        backgroundColor: '#D9D9D9',
        height: 55,
        width: 300,
        borderRadius: 10,
        flexDirection: 'row'

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
        textAlignVertical : 'center',
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
        textAlignVertical : 'center',
        color: '#000000',
        fontFamily: 'Jura-Bold',
        fontSize: 16,
        letterSpacing: 1,
    },

    loginFormParent: {
        backgroundColor: '#D9D9D9',
        height: 320,
        marginTop: 8,
        width: 300,
        paddingTop: 50,
        alignItems: 'center',

        borderRadius: 10
    },

    loginFormInput: {
        borderWidth: 3,
        borderColor: '#000000',
        borderRadius: 10,
        marginBottom: 20,

        color: '#000000',
        fontFamily: 'Jura-Bold',
        fontSize: 15,

        width: 250
    }

})

export default loginSignup;