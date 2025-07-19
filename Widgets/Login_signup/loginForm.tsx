import React from "react";
// import auth from '@react-native-firebase/auth'
import { View, Text, StyleSheet, TouchableOpacity, TextInput} from "react-native";
import colors from 'D:\\PROJECTS\\The-Chat-App\\Assets\\colors.js'

const LoginForm = () => {


    



    return (
        <View style={loginSignupStyle.loginFormParent}>
            <TextInput placeholder="Username / Phone" placeholderTextColor="#000000" cursorColor={'#000000'} style={loginSignupStyle.loginFormInput} />
            <TextInput secureTextEntry={true} placeholder="Password" placeholderTextColor="#000000" cursorColor={'#000000'} style={loginSignupStyle.loginFormInput} />

            <TouchableOpacity>
                <Text style = {loginSignupStyle.loginButton}>
                    Login
                </Text>
            </TouchableOpacity>

            <View>
                <Text style = {loginSignupStyle.forgotPassword}>
                    Forgot Password?<Text style = {loginSignupStyle.forgotPasswordSpan}> No worries </Text>
                </Text>
            </View>
        
        </View>
    )
}

const loginSignupStyle = StyleSheet.create({

    // holds all the forms and buttons that are realted to the login form within this 
    loginFormParent: {
        backgroundColor: colors.secondary,
        height: 320,
        marginTop: 8,
        width: 300,
        paddingTop: 50,
        alignItems: 'center',
        justifyContent : 'center',

        borderRadius: 10
    },

    // design for the input field of the login form
    loginFormInput: {
        borderWidth: 3,
        borderColor: colors.primary,
        borderRadius: 10,
        marginBottom: 20,

        color: colors.primary,
        fontFamily: 'Jura-Bold',
        fontSize: 15,

        width: 250
    },

    loginButton : {
        backgroundColor : colors.primary,
        height : 38,
        width : 130,
        borderRadius : 15,


        color : colors.secondary,
        fontFamily : 'Jura-Bold',
        fontSize: 18,

        justifyContent : 'center',
        alignItems : 'center',
        verticalAlign : 'middle',
        textAlign : 'center',

        marginTop : 20
    },

    forgotPassword : {
        paddingTop : 10,

        fontFamily : 'Jura-Bold',
        textDecorationLine : 'underline'
    },

    forgotPasswordSpan : {
        textDecorationLine : 'none'
    }

})

export default LoginForm;