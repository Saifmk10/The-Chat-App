import {NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { StyleSheet } from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './Widgets/Chat_home_screen/homeScreen';
import LoginSignup from './Pages/Login_Signup/loginSignup_page';

const Stack = createNativeStackNavigator();

export default function App (){

  // using the App.tsx as a blueprint where all the pages that will be used within the app will be added
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown : false}}>
            <Stack.Screen name = "LoginSignup" component={LoginSignup} />
            <Stack.Screen name = "HomeScreen" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    )
}

const styles = StyleSheet.create({
  container: {
    flex :1,
    backgroundColor : '#000000'
  },

  loginSignupDiv : {
    paddingTop : 60,
  }
});

