import React ,{useState} from "react";
import auth from "@react-native-firebase/auth";
import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";
import colors from "../../Assets/colors";
import UserlogoOption from "../../Assets/images/user_logo_options";


const UserProfileOptions = () => {

    // need to implement the logic for the checker and also make sure the additonal user settings are shown only when the user clicks in user profile
    const [checker , SetCheker] = useState<boolean>(false);
    if(checker == true){
        console.log("True")
    }
    else{
        console.log("Flase")
    }


    const logoutLogic = async () =>{
        try {
            await auth().signOut();
            console.log("USER HAS BEEN LOGGED OUT FROM userProfileOption.tsx")
        }
        catch(error){
            console.log(`USER LOGIN FAILED ERROR : ${error} FROM userProfileOptions.tsx`)
        }
    }

    return (
        <View style={userOptionsStyle.parentDesign}>

            <TouchableOpacity style={userOptionsStyle.userProfileDesign} onPress={() => SetCheker(checker => !checker)}>
                <UserlogoOption />
            </TouchableOpacity>

            

            <View style={{...userOptionsStyle.popUpDesign , display : checker ? 'flex' : 'none'}}>
                <TouchableOpacity style={userOptionsStyle.logoutButton} onPress={logoutLogic}>
                    <Text style={userOptionsStyle.logoutFont}>LogOut</Text>
                </TouchableOpacity>

                <TouchableOpacity style={userOptionsStyle.settingsButton}>
                    <Text style={userOptionsStyle.settingsFont}>Settings</Text>
                </TouchableOpacity>
            </View>


        </View>
    );
}

const userOptionsStyle = StyleSheet.create({


    userProfileDesign: {
        height: 30,
        width: 290,

        display: 'flex',
        alignItems: 'flex-end',
        paddingTop: 40
    },

    parentDesign: {
        display: 'flex'
    },

    popUpDesign: {
        backgroundColor: colors.secondary,
        height: 40,
        width: 230,
        borderRadius: 10,

        marginBottom: -30,

        display: 'flex',
        flexDirection: 'row'
    },

    logoutButton: {
        backgroundColor: colors.message_notification,
        height: 35,
        width: 100,
        borderRadius: 10,
        margin: 3,

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

    },
    logoutFont: {
        color: colors.secondary,
        fontFamily: "Jura-Bold",
    },


    settingsButton: {
        backgroundColor: colors.primary,
        height: 35,
        width: 100,
        borderRadius: 10,
        margin: 3,

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

    },
    settingsFont: {
        color: colors.secondary,
        fontFamily: "Jura-Bold",
    },

})


export default UserProfileOptions;