import React from "react";
import auth from '@react-native-firebase/auth'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView , ScrollView, Alert } from "react-native";
import colors from 'D:\\PROJECTS\\The-Chat-App\\Assets\\colors.js'


const SignupForm = () => {


    const authentication = () =>{
        auth().createUserWithEmailAndPassword("Email@email.com", "Password").then(()=>{ Alert.alert("Workeed Well") })
        .catch((error)=>{
            console.log(error);
        })
    }


    return (

        // <ScrollView></>
        <View style={loginSignupStyle.signupFormParent}>

            <View>
            <TextInput placeholder="Full Name" placeholderTextColor="#000000" cursorColor={'#000000'} style={loginSignupStyle.signinFormInput} />
            <TextInput keyboardType="email-address" placeholder="Email / Phone" placeholderTextColor="#000000" cursorColor={'#000000'} style={loginSignupStyle.signinFormInput} />
            <TextInput placeholder="Choose an Username" placeholderTextColor="#000000" cursorColor={'#000000'} style={loginSignupStyle.signinFormInput} />
            <TextInput secureTextEntry={true} placeholder="Set Password" placeholderTextColor="#000000" cursorColor={'#000000'} style={loginSignupStyle.signinFormInput} />
            </View>
            <TouchableOpacity>
                <Text onPress={authentication} style={loginSignupStyle.signinButton}>
                    Sign Up
                </Text>
            </TouchableOpacity>

        </View>
    )
}


const loginSignupStyle = StyleSheet.create({

    // holds all the forms and buttons that are realted to the login form within this 
    signupFormParent: {
        backgroundColor: colors.secondary,
        height: 430,
        marginTop: 8,
        width: 300,
        paddingTop: 50,
        alignItems: 'center',

        borderRadius: 10
    },


        
    // design for the input field of the login form
    signinFormInput: {
        borderWidth: 3,
        borderColor: colors.primary,
        borderRadius: 10,
        marginBottom: 20,

        color: colors.primary,
        fontFamily: 'Jura-Bold',
        fontSize: 15,

        width: 250
    },

    signinButton: {
        backgroundColor: colors.primary,
        height: 38,
        width: 130,
        borderRadius: 15,


        color: colors.secondary,
        fontFamily: 'Jura-Bold',
        fontSize: 18,

        justifyContent: 'center',
        alignItems: 'center',
        verticalAlign: 'middle',
        textAlign: 'center',

        marginTop: 20
    },

})

export default SignupForm;