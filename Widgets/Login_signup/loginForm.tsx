import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native";
import colors from 'D:\\PROJECTS\\The-Chat-App\\Assets\\colors.js';

const LoginForm = () => {
  return (

        <View style={styles.loginFormParent}>
          <TextInput
            placeholder="Username / Phone"
            placeholderTextColor="#000000"
            cursorColor={"#000000"}
            style={styles.loginFormInput}
          />
          <TextInput
            secureTextEntry={true}
            placeholder="Password"
            placeholderTextColor="#000000"
            cursorColor={"#000000"}
            style={styles.loginFormInput}
          />

          <TouchableOpacity>
            <Text style={styles.loginButton}>Login</Text>
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

  loginFormInput: {
    borderWidth: 3,
    borderColor: colors.primary,
    borderRadius: 10,
    marginBottom: 20,
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
    marginTop: 20,
    paddingTop: 6,
  },

  forgotPassword: {
    paddingTop: 10,
    fontFamily: "Jura-Bold",
    textDecorationLine: "underline",
  },

  forgotPasswordSpan: {
    textDecorationLine: "none",
  },
});

export default LoginForm;
