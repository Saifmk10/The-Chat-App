import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import auth from "@react-native-firebase/auth";

import HomeScreen from "./Pages/Chat_home_screen/homeScreen";
import LoginSignup from "./Pages/Login_signup_screen/loginSignup_page";
import UsersChatPage from "./Pages/User_chat_screen/UsersChatPage";
import StockAgentScreen from "./Pages/Stock_agent_screen/stockAgentPage";

const Stack = createNativeStackNavigator();

export default function App() {

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<any>(null);

  // useeffect is used here to handle the user being logged in when the user opens the app , this helps the app to be navigated to the homescreen direcly if a user session is found
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      setUser(user);
      if (initializing) setInitializing(false);
      console.log(user ? "USER SESSION FOUND FROM app.tsx" : "FAILED TO FIND THE USER SESSION from app.tsx , reason for logout");
    });

    return unsubscribe; 
  }, []);

  if (initializing) return null;  

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="UsersChatPage" component={UsersChatPage} />
            <Stack.Screen name="StockAgentScreen" component={StockAgentScreen}/>

          </>
        ) : (
          <Stack.Screen name="LoginSignup" component={LoginSignup} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  loginSignupDiv: {
    paddingTop: 60,
  },
});
