import React, { useState } from "react";
import auth from '@react-native-firebase/auth'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, ScrollView, Alert } from "react-native";
import colors from 'D:\\PROJECTS\\The-Chat-App\\Assets\\colors.js'

import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword } from '@react-native-firebase/auth';



const SignupForm = () => {

        const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");



    const signupUserLogic = () => {

    createUserWithEmailAndPassword(getAuth(), Email, Password)
        .then(() => {
            console.log('User account created & signed in!');
            // need to add the code here for thr firestore so that when the user creates an account a file will be created in his uid in the users folder of the firestore
        })
        .catch(error => {
            if (error.code === 'auth/email-already-in-use') {
                console.log('That email address is already in use!');
                Alert.alert("Account already exists...");
            }

            if (error.code === 'auth/invalid-email') {
                console.log('That email address is invalid!');
                Alert.alert("Gmail format not right");
            }

            console.error(error);
        });

}

    //     function App() {
    //   // Set an initializing state whilst Firebase connects 
    //   const [initializing, setInitializing] = useState(true);
    //   const [user, setUser] = useState();

    //   // Handle user state changes
    //   function handleAuthStateChanged(user) {
    //     setUser(user);
    //     if (initializing) setInitializing(false);
    //   }

    //   useEffect(() => {
    //     const subscriber = onAuthStateChanged(getAuth(), handleAuthStateChanged);
    //     return subscriber; // unsubscribe on unmount
    //   }, []);

    //   if (initializing) return null;

    //   if (!user) {
    //     return (
    //       <View>
    //         <Text>Login</Text>
    //       </View>
    //     );
    //   }

    //   return (
    //     <View>
    //       <Text>Welcome {user.email}</Text>
    //     </View>
    //   );
    // }


    return (

        // <ScrollView></>
        <View style={loginSignupStyle.signupFormParent}>

            <View>
                <TextInput placeholder="Full Name" placeholderTextColor="#000000" cursorColor={'#000000'} style={loginSignupStyle.signinFormInput} />
                <TextInput keyboardType="email-address" placeholder="Email" placeholderTextColor="#000000" cursorColor={'#000000'} style={loginSignupStyle.signinFormInput} 
                value={Email} onChangeText={setEmail}/>
                <TextInput placeholder="Choose an Username" placeholderTextColor="#000000" cursorColor={'#000000'} style={loginSignupStyle.signinFormInput} />
                <TextInput secureTextEntry={true} placeholder="Set Password" placeholderTextColor="#000000" cursorColor={'#000000'} style={loginSignupStyle.signinFormInput} 
                value={Password} onChangeText={setPassword}/>
            </View>
            <TouchableOpacity>
                <Text onPress={signupUserLogic} style={loginSignupStyle.signinButton}>
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