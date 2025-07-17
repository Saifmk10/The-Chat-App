import React from "react";
// import {NavigationContainer} from '@react-navigation/native';
// import {createStackNavigator} from '@react-navigation/stack';
import { SafeAreaView, StyleSheet , View} from "react-native";
import LoginWidget from './Pages/Login_Signup/loginSignup_page'



// const Navigation = createStackNavigator();

const App = () =>{
  return(
    <View style = {styles.container}>
    <SafeAreaView>
      <View style = {styles.loginSignupDiv}>
        <LoginWidget />
      </View>

    </SafeAreaView>
    </View>


    // <NavigationContainer>
    //   <Navigation.Navigator>
    //     <Navigation.Screen
    //       name="Home"
    //       component={LoginWidget}
    //       options={{title: 'Welcome'}}
    //     />
    //     <Navigation.Screen name="Profile" component={LoginWidget} />
    //   </Navigation.Navigator>
    // </NavigationContainer>

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

export default App;