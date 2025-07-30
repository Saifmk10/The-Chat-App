// popupMessage is a custom build modal that is used to show popup notifications or warning depending on the app situation.
// this is created to bypass the boring Alert.alert that gives a uneditable design which is boring

// the popupMessage makes use of the modal to display the notification in top of any content within the screen. 

// in popupMessage we are making use of 2 props one is message and buttonText ; each are highly customizable as needed for various situations


import React, { useState } from "react";
import { Modal, View, Text, Button, TouchableOpacity, StyleSheet, SafeAreaView, StyleProp, ViewStyle } from 'react-native';
import colors from "../Assets/colors";

import LoginSuccessfullTick from "../Assets/images/login_successful_tick";

// props helping in the custom message and button text content 
const Popupmessage = ({ message, buttonText }: { message: any; buttonText: string; }) => {

    const [checker, setChecker] = useState(true)

    const [visibility, setVisibility] = useState(true)



    return (


        <Modal visible={visibility} animationType="fade" transparent={true} >
            {/* this will be the message holder */}
                <View style={{ ...modalStyle.mainParent, display: checker ? 'flex' : 'none' }} >

                    <View style={modalStyle.parentContainer}>

                        <View style={modalStyle.imageDesign}>
                            {/* the image in this will be customizable using he props */}
                            <LoginSuccessfullTick />
                        </View>


                        {/* this is where the text that is associated with the various popup will be added using the props */}
                        <Text style={modalStyle.fontcolor}>{message}</Text>


                        <TouchableOpacity style={modalStyle.buttonDesign} onPress={() => { setChecker(checker => !checker); checker && setVisibility(visibility => !visibility) }} >
                            {/* the text in this will be customized using props */}
                            <Text style={modalStyle.buttonText}>{buttonText}</Text>
                        </TouchableOpacity>

                    </View>

                </View>
        </Modal>

    )

}

const modalStyle = StyleSheet.create({
    fontcolor: {
        color: colors.primary,
        fontFamily: "Jura-Bold",
        fontSize: 25,

        marginLeft: 10,
        marginRight: 10
    },

    mainParent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.8)'
    },


    parentContainer: {
        //height kept auto here
        width: 280,
        backgroundColor: colors.secondary,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: colors.gradient_secondary,

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },

    imageDesign: {
        padding: 20
    },

    buttonDesign: {
        backgroundColor: colors.gradient_secondary,
        height: 35,
        width: 90,
        borderRadius: 15,
        margin: 15,

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

        borderWidth: 2,
        borderColor: colors.primary


    },
    buttonText: {
        color: colors.secondary,
        fontFamily: "Jura-Bold",
        fontSize: 15,
    }

})

export default Popupmessage;