import React from "react";
import { View, Text, StyleSheet, TouchableOpacity} from "react-native";
import colors from "../../Assets/colors";

// helps in checking if the user has clicked in the login or on the signin (login == true , signin == false) 





const HomeToggleButton = ({ checker, setCheckerTo }: { checker: any, setCheckerTo: any }) => {

    // const [checker , setCheckerTo] = useState(true)

    const onclickUiChange = () =>{
    if(checker == true){

    }
}

    return (
        <View style={loginSignupStyle.loginToggleDiv}>
            <TouchableOpacity onPress={() => setCheckerTo(true)}>
                <Text style={[checker ? loginSignupStyle.loginToggleButtonsHover : loginSignupStyle.loginToggleButtonsNoHover]}>CHATS</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setCheckerTo(false)}>
                <Text style={[checker ? loginSignupStyle.loginToggleButtonsNoHover : loginSignupStyle.loginToggleButtonsHover]}>ANONYMOUS</Text>
            </TouchableOpacity>
        </View>
    )
}






const loginSignupStyle = StyleSheet.create({


    // holds the login toggle design for the buttons
    loginToggleDiv: {
        backgroundColor: colors.secondary,
        height: 55,
        width: 300,
        borderRadius: 10,
        flexDirection: 'row',
    },

    // holds the design for the login and signup button design , when button is pressed this design is applied
    loginToggleButtonsHover: {

        backgroundColor: colors.gradient_secondary,
        alignItems: 'center',
        flex : 1,
        justifyContent : 'center',
        margin: 8,
        marginLeft: 11,
        borderRadius: 10,
        borderColor: colors.primary,
        borderWidth: 2,

        width: 130,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: colors.secondary,
        fontFamily: 'Jura-Bold',
        fontSize: 16,
        letterSpacing: 1,
    },

    // when the button is not hover this design is applied
    loginToggleButtonsNoHover: {
        backgroundColor: colors.secondary,
        alignItems: 'center',
        flex : 1,
        justifyContent : 'center',
        margin: 8,
        borderRadius: 10,

        width: 130,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: colors.primary,
        fontFamily: 'Jura-Bold',
        fontSize: 16,
        letterSpacing: 1,
    },


})

export default HomeToggleButton; 