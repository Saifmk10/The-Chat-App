import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import Svg, { Path } from "react-native-svg";

import colors from '../../Assets/colors';
import UserLoginLogic from '../../Login_logics/UserEmailPasswordLoginLogic';
import onGoogleButtonPress from "../../Login_logics/UserGoogleLoginLogic";
import Popupmessage from '../../modal/popupMessage';

// navigation : any has fixed the problem if type not being specified 
const LoginForm = ({ navigation }: { navigation: any;}) => {


  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");  
  const [Username , setUsername] = useState("");

  // hooks for the error message display
  const [passwordErrorMessage, setpasswordErrorMessage] = useState(false);
  const [emailErrorMessage, setemailErrorMessage] = useState(false); 
  let loginStatus : boolean;

  // function that is responsible for the login of user using the email and password , using of a function called signInWithEmailAndPassword() one of the functions that is provided by the firebase authentication
  const loginUserLogic = () => {
    UserLoginLogic(
      Email,
      Password,
      (username) => {    
        setUsername(username);
        console.log("Welcome back, ", username);
      
      },
      (errorMessage) => {
        Alert.alert("Error : " + errorMessage);
      }
    );
  }

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

      {/* <View>
        {loginStatus ? <Popupmessage message='Welcome Back ' buttonText='Close' /> : <Popupmessage message=' ' buttonText='Close' />}
      </View> */}

      

      <View>
        {/* NEED TO ADD FUCNTIONALITY TO THIS SECTION */}
        <Text style={styles.forgotPassword}>
          Forgot Password?<Text style={styles.forgotPasswordSpan}> No worries </Text>
        </Text>
      </View>

      {/* ── OR divider ───────────────────────────────────────────────────────── */}
      <View style={styles.orRow}>
        <View style={styles.orLine} />
        <Text style={styles.orText}>or</Text>
        <View style={styles.orLine} />
      </View>

      {/* ── Google Sign-In button ─────────────────────────────────────────────── */}
      <TouchableOpacity style={styles.googleButton} activeOpacity={0.85} onPress={onGoogleButtonPress}>
        <View style={styles.googleIconWrapper}>
          <Svg width={18} height={18} viewBox="0 0 18 18">
            <Path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
            <Path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
            <Path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
            <Path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
          </Svg>
        </View>
        <View style={styles.googleDivider} />
        <Text style={styles.googleLabel}>Sign in with Google</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  loginFormParent: {
    backgroundColor: colors.secondary,
    height: "auto",
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

  // ── OR divider ──────────────────────────────────────────────────────────────
  orRow: {
    flexDirection: "row",
    alignItems: "center",
    width: 250,
    marginBottom: 14,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.primary,
    opacity: 0.25,
  },
  orText: {
    marginHorizontal: 10,
    fontFamily: "Jura-Bold",
    fontSize: 13,
    color: colors.primary,
    opacity: 0.5,
  },

  // ── Google button ────────────────────────────────────────────────────────────
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    width: 200,
    height: 44,
    borderRadius: 6,
    backgroundColor: "#000000",
    borderWidth: 1,
    borderColor: "#DADCE0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 20,
    overflow: "hidden",
  },
  googleIconWrapper: {
    width: 42,
    height: 42,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
  },
  googleDivider: {
    width: 1,
    height: 26,
    backgroundColor: "#DADCE0",
  },
  googleLabel: {
    flex: 1,
    textAlign: "center",
    fontFamily: "Roboto-Medium",
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 0.25,
    color: "#d3d8db",
    paddingHorizontal: 6,
  },
});

export default LoginForm;