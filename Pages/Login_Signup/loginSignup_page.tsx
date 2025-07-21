import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, KeyboardAvoidingView, Platform } from "react-native";
import LinearGradient from "react-native-linear-gradient";

import LoginSignUpToogle from '../../Widgets/Login_signup/toggleButtons';
import LoginForm from "../../Widgets/Login_signup/loginForm";
import SignupForm from "../../Widgets/Login_signup/signupForm";
import colors from "../../Assets/colors";



const loginSignup = () => {

    const [checker, setCheckerTo] = useState(true)

    return (

        <LinearGradient colors={['#000000', '#5F48F5']} style={{ height: '100%' }} locations={[0.65, 1]}>
            <SafeAreaView style={{ flex: 1, flexGrow: 1 }}>
                <KeyboardAvoidingView style={{ flex: 1 }} keyboardVerticalOffset={10} behavior="padding">
                    <View style={loginSignupStyle.displayType}>


                        {/* this holds the design for the toggle button */}
                        <View style={loginSignupStyle.loginFormAndButtonParent}>

                            <LoginSignUpToogle checker={checker} setCheckerTo={setCheckerTo} />

                        </View>

                        {/* section that is responsible for rendering the login and signup form based on button clicked */}
                        {checker ? <LoginForm /> : <SignupForm />}

                        {/* <Text style={loginSignupStyle.font}>A NeW WAY TO CONNeCT</Text> */}

                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </LinearGradient>

    )
}



const loginSignupStyle = StyleSheet.create({

    font: {
        color: colors.secondary,
        fontSize: 40,
        fontFamily: 'Micro5-Regular',
        paddingTop: 20
    },

    // holds the display type of this page
    displayType: {
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',

    },

    // edit this property for the logical movement of the toggle widget for login form
    loginFormAndButtonParent: {
        marginTop: 1
    },

})

export default loginSignup;