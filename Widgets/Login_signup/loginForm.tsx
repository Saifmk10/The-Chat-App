import React , {useState} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from "react-native";
import colors from 'D:\\PROJECTS\\The-Chat-App\\Assets\\colors.js';
import { getAuth ,signInWithEmailAndPassword } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore'

// INCOMPLETE AUTHENTICATION
const LoginForm = () => {

  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const [passwordErrorMessage , setpasswordErrorMessage] = useState(false);
  const [emailErrorMessage , setemailErrorMessage] = useState(false);

  
  const loginUserLogic = () =>{

    signInWithEmailAndPassword(getAuth() , Email , Password).then((userCredentails)=>{
      

      const UID = userCredentails.user.uid;
      firestore().collection('Users').doc(UID).get().then(doc =>{
        const username = doc.data()?.Username;
        Alert.alert("WELCOME BACK " + username);
      })
    })
    .catch(error => {
  const errorCode = error.code;

  if (errorCode === 'auth/invalid-email') {
    Alert.alert("OOPS, your email " + Email + " format seems off");
  } else if (errorCode === 'auth/user-not-found') {
    Alert.alert("I couldn't find an account with " + Email + ". Wanna create one?");
  } else if (errorCode === 'auth/wrong-password') {
    Alert.alert("pass wrong");
    setpasswordErrorMessage(true)
  } else if (errorCode === 'auth/invalid-credential') {
    Alert.alert("wrong email");
    setemailErrorMessage(true)
  } else if (errorCode === 'auth/user-disabled') {
    Alert.alert("OOPS, your account with email " + Email + " has been disabled.");
  } else if (errorCode === 'auth/network-request-failed') {
    Alert.alert("Maybe, MAYBE your network is slow...");
  } else {
    Alert.alert("Login failed , Please try again later " + error.message); // fallback for unknown errors
  }
});
  }


  return (

        <View style={styles.loginFormParent}>

          <TextInput
            placeholder="Email"
            placeholderTextColor="#000000"
            cursorColor={"#000000"}
            style={styles.loginFormInput}
            value={Email} onChangeText={setEmail}
          />
          <Text style = {[styles.credentailError , emailErrorMessage ? styles.show : styles.hide]}>
            Invalid email / username
          </Text>

          <TextInput
            secureTextEntry={true}
            placeholder="Password"
            placeholderTextColor="#000000"
            cursorColor={"#000000"}
            style={styles.loginFormInput}
            value={Password} onChangeText={setPassword}
          />
          <Text style = {[styles.credentailError , passwordErrorMessage ? styles.show : styles.hide]}>
            Incorrect password
          </Text>

          <TouchableOpacity onPress={loginUserLogic}>
            <Text style={styles.loginButton} >Login</Text>
          </TouchableOpacity>

          <View>
            <Text style={styles.forgotPassword}>
              Forgot Password?<Text style={styles.forgotPasswordSpan}> No worries </Text>
            </Text>
          </View>
        </View>
  );
};

const styles = StyleSheet.create({

  loginFormParent: {
    backgroundColor: colors.secondary,
    height: 320,
    marginTop: 8,
    width: 300,
    paddingTop: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },

  credentailError : {
    color : colors.error_message,
    fontFamily: "Jura-Bold",
  },

  show : {
    display : 'flex',
  },
  hide : {
    display : 'none',
  },

  loginFormInput: {
    borderWidth: 3,
    borderColor: colors.primary,
    borderRadius: 10,
    // marginBottom: 20,
    marginTop : 20,
    color: colors.primary,
    fontFamily: "Jura-Bold",
    fontSize: 15,
    width: 250,
    padding: 10,
  },

  loginButton: {
    backgroundColor: colors.primary,
    height: 38,
    width: 130,
    borderRadius: 15,
    color: colors.secondary,
    fontFamily: "Jura-Bold",
    fontSize: 18,
    justifyContent: "center",
    alignItems: "center",
    verticalAlign: "middle",
    textAlign: "center",
    marginTop: 30,
    marginBottom : 20,
    padding: 3,
  },

  forgotPassword: {
    paddingTop: 10,
    fontFamily: "Jura-Bold",
    textDecorationLine: "underline",
    marginBottom: 30
  },

  forgotPasswordSpan: {
    textDecorationLine: "none",
  },
});

export default LoginForm;
