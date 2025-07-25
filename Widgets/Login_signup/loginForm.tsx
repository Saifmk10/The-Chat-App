
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
 
import colors from '../../Assets/colors';
import { getAuth, signInWithEmailAndPassword } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// navigation : any has fixed the problem if type not being specified 
const LoginForm = ({ navigation }: { navigation: any }) => {


  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");  
  const [passwordErrorMessage, setpasswordErrorMessage] = useState(false);
  const [emailErrorMessage, setemailErrorMessage] = useState(false);


  // function that is responsible for the login of user using the email and password , using of a function called signInWithEmailAndPassword() one of the functions that is provided by the firebase authentication
  const loginUserLogic = () => {
    signInWithEmailAndPassword(getAuth(), Email, Password)
      .then((userCredentials) => {
        const UID = userCredentials.user.uid;
        firestore().collection('Users').doc(UID).get().then(doc => {
          const username = doc.data()?.Username; // this const is used to fetch the username when the user logs into the app
          Alert.alert("WELCOME BACK " + username);
          navigation.navigate("HomeScreen"); // once the login happens we redirect the user to the homepage
        });
      })
      .catch(error => {
        const errorCode = error.code;

        if (errorCode === 'auth/invalid-email') {
          Alert.alert("OOPS, your email " + Email + " format seems off");
        } else if (errorCode === 'auth/user-not-found') {
          Alert.alert("I couldn't find an account with " + Email + ". Wanna create one?");
        } else if (errorCode === 'auth/wrong-password') {
          Alert.alert("Incorrect password");
          setpasswordErrorMessage(true);
        } else if (errorCode === 'auth/invalid-credential') {
          Alert.alert("Invalid email");
          setemailErrorMessage(true);
        } else if (errorCode === 'auth/user-disabled') {
          Alert.alert("Your account has been disabled.");
        } else if (errorCode === 'auth/network-request-failed') {
          Alert.alert("Network error. Try again later.");
        } else {
          Alert.alert("Login failed: " + error.message);
        }
      });
  };

  return (
    <View style={styles.loginFormParent}>
      <TextInput
        placeholder="Email"
        placeholderTextColor="#000000"
        cursorColor="#000000"
        style={styles.loginFormInput}
        value={Email}
        onChangeText={setEmail}
      />

      {/* usually this text will be hidden bcs this is an wrong email / username message , so on user providing wrong cridential this function will come into action */}
      <Text style={[styles.credentailError, emailErrorMessage ? styles.show : styles.hide]}>
        Invalid email / username
      </Text>

      <TextInput
        secureTextEntry
        placeholder="Password"
        placeholderTextColor="#000000"
        cursorColor="#000000"
        style={styles.loginFormInput}
        value={Password}
        onChangeText={setPassword}
      />

      {/* usually this text will be hidden bcs this is an wrong password , so on user providing wrong cridential this function will come into action */}
      <Text style={[styles.credentailError, passwordErrorMessage ? styles.show : styles.hide]}>
        Incorrect password
      </Text>

      <TouchableOpacity onPress={loginUserLogic}>
        <Text style={styles.loginButton}>Login</Text>
      </TouchableOpacity>

      <View>
        {/* NEED TO ADD FUCNTIONALITY TO THIS SECTION */}
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
  credentailError: {
    color: colors.error_message,
    fontFamily: "Jura-Bold",
  },
  show: {
    display: 'flex',
  },
  hide: {
    display: 'none',
  },
  loginFormInput: {
    borderWidth: 3,
    borderColor: colors.primary,
    borderRadius: 10,
    marginTop: 20,
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
    textAlign: "center",
    marginTop: 30,
    marginBottom: 20,
    padding: 3,
  },
  forgotPassword: {
    paddingTop: 10,
    fontFamily: "Jura-Bold",
    textDecorationLine: "underline",
    marginBottom: 30,
  },
  forgotPasswordSpan: {
    textDecorationLine: "none",
  },
});

export default LoginForm;
