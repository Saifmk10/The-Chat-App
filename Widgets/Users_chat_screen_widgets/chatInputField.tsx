import * as REACT from "react"
import {View , TextInput, StyleSheet , KeyboardAvoidingView , Platform} from "react-native"
import SendButton from "../../Assets/images/chatScreen_userProfile/sendButton"



const ChatInput = () =>{

    return (
        <View style ={design.parent}>

            
                <TextInput style = {design.inputFieldDesign} placeholder="Message" autoCorrect multiline numberOfLines={6} />

                   <View style= {design.buttonDesign}>
                        <SendButton />
                    </View> 

                
            
        </View>
    )
}

const design = StyleSheet.create({
    parent : {
        display : "flex", 
        alignItems : "flex-start",
        justifyContent : "center",
        flexDirection : "row",
        gap : 15
    },

    buttonDesign: {
        padding : 5
    },

    inputFieldDesign : {
        height : "auto",
        width : 280,
        backgroundColor : "#000000",

        borderColor : "#D9D9D9", 
        borderWidth : 2, 
        borderRadius : 15,
        padding: 10, 
        fontFamily: "Jura-Bold",
        
    }
})

export default ChatInput