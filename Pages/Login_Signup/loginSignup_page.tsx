import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView , KeyboardAvoidingView , Platform} from "react-native";
import LinearGradient from "react-native-linear-gradient";

import LoginSignUpToogle from '../../Widgets/Login_signup/toggleButtons';
import LoginForm from "../../Widgets/Login_signup/loginForm";
import SignupForm from "../../Widgets/Login_signup/signupForm";
// import ShootingStar from "../../Widgets/Login_signup/shootingStars";
import colors from "../../Assets/colors";



const loginSignup = () => {

    const [checker , setCheckerTo] = useState(true)

    return (

        // <KeyboardAwareScrollView
    //   style={{ flex: 1 }}
    //   contentContainerStyle={{ flexGrow: 1 }}
    //   enableOnAndroid={true}
    //   keyboardShouldPersistTaps='handled'
    // >

        <LinearGradient colors={['#000000', '#5F48F5']} style={{ height: '100%'}} locations={[0.65, 1]}>
            <View style={loginSignupStyle.displayType}>

                {/* <Text style={loginSignupStyle.font}>STAY CONNECTED , FEEL CLOSER</Text> */}

                <View style={loginSignupStyle.loginFormAndButtonParent}>
                    
                    <LoginSignUpToogle checker={checker} setCheckerTo={setCheckerTo}/>

                    {/* <LoginForm/> */}

                    {/* <SignupForm/> */}

                    {checker ? <LoginForm /> : <SignupForm />}
                    
                </View>

                <Text style={loginSignupStyle.font}>A NeW WAY TO CONNeCT</Text>

                {/* <ShootingStar/> */}

            </View>
        </LinearGradient>
        // </KeyboardAwareScrollView>

    )
}



const loginSignupStyle = StyleSheet.create({

    font: {
        color: colors.secondary,
        fontSize: 40,
        fontFamily: 'Micro5-Regular',
        paddingTop : 20
    },

    // holds the display type of this page
    displayType: {
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',

    },

    // edit this property for the logical movement of the toggle widget for login form
    loginFormAndButtonParent: {
        marginTop: 1
    },

})

export default loginSignup;