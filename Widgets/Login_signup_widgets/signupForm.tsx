import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from "react-native";
import colors from 'D:\\PROJECTS\\The-Chat-App\\Assets\\colors.js'

import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// the bellow function is the main function of the widget that holds both the ui and the logic behind the signup of the application. The ui and the signup logics are however seperated with the help of functions

const SignupForm = () => {

    // The three constants bellow are the useState hooks that are used to get the data from the userinput.
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [UserName, setUserName] = useState("");
    const [UserID, setUserId] = useState("");


    // The signupUserLogic is the function that is responsible for the logic behind registeration users with the help of firebase . The function createUserWithEmailAndPassword() is used here to add the user details into the authenticator
    // however the need of getting more details about the users such as username and full name are fullfilled with the help of firestore database.
    const signupUserLogic = async () => {
        try {
            // The createUserWithEmailAndPassword() function is used to register the user
            // into Firebase Authentication using the email and password provided.
            const userCredentials = await createUserWithEmailAndPassword(
                getAuth(),
                Email,
                Password
            );

            // Once the user is successfully registered, Firebase generates a unique UID.
            // This UID is used as the primary identifier across the entire application.
            const UID = userCredentials.user.uid;

            // Fetching the account creation timestamp from Firebase metadata.
            // This helps in tracking when the user account was created.
            const createdDate = userCredentials.user.metadata.creationTime;

            // This stores additional user information that is not available in
            // Firebase Authentication such as username and account creation time.
            await firestore()
                .collection('Users')
                .doc(UID)
                .set({
                    Username: UserName,
                    Email: Email,
                    AccountCreated: createdDate,
                    UserId: UID,
                });

            // This document acts as a marker to indicate that the Finance agent
            // is enabled and initialized for the user.
            await firestore()
                .collection('Users')
                .doc(UID)
                .collection('Agents')
                .doc('Finance')
                .set({
                    enabled: true,
                    initializedAt: firestore.FieldValue.serverTimestamp(),
                });


            // Alert shown once the entire onboarding process is completed successfully.
            Alert.alert('Welcome', 'Account setup complete');

        } catch (error: any) {
            // Catch block handles all errors that may occur during authentication
            // or Firestore writes to prevent partial or silent failures.
            console.error(error);

            if (error.code === 'auth/email-already-in-use') {
                Alert.alert('Account already exists');
            } else if (error.code === 'auth/invalid-email') {
                Alert.alert('Invalid email format');
            } else {
                Alert.alert('Signup failed', 'Please try again');
            }
        }
    };





    return (

        // <ScrollView></>
        <View style={loginSignupStyle.signupFormParent}>

            <View>
                <TextInput placeholder="Full Name" placeholderTextColor="#000000" cursorColor={'#000000'} style={loginSignupStyle.signinFormInput} />
                <TextInput keyboardType="email-address" placeholder="Email" placeholderTextColor="#000000" cursorColor={'#000000'} style={loginSignupStyle.signinFormInput}
                    value={Email} onChangeText={setEmail} />
                <TextInput placeholder="Choose an Username" placeholderTextColor="#000000" cursorColor={'#000000'} style={loginSignupStyle.signinFormInput} value={UserName} onChangeText={setUserName} />
                <TextInput secureTextEntry={true} placeholder="Set Password" placeholderTextColor="#000000" cursorColor={'#000000'} style={loginSignupStyle.signinFormInput}
                    value={Password} onChangeText={setPassword} />
            </View>
            <TouchableOpacity onPress={signupUserLogic}>
                <Text style={loginSignupStyle.signinButton}>
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