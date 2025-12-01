import { StyleSheet, View, Text, ScrollView,TouchableOpacity } from "react-native";
import DeleteLogo from "../../Assets/images/agents/stockAgent/deleteLogo";

const AddedStocksList = () => {


    return (
    <View>
        
        {/* header row */}
        <View style={style.headingStyle}>
            <Text style={style.text}>Stock Name</Text>
            <Text style={style.text}>Price</Text>
            <Text style={style.text}>Date</Text>
        </View>

        {/* scrollable list with proper layout */}
        <ScrollView
        >
            <View style={style.mainContainerParent}>
                <View style={style.stockDetailsParentStyle}>
                    <Text style={style.stockNamePriceDateStyle}>REDINGTON</Text>
                    <Text style={style.stockNamePriceDateStyle}>123</Text>
                    <Text style={style.stockNamePriceDateStyle}>15-NOV-2025</Text>
                </View>

                <TouchableOpacity style={style.deleteButtonStyle}>
                    <DeleteLogo />
                </TouchableOpacity>
            </View>

            <View style={style.mainContainerParent}>
                <View style={style.stockDetailsParentStyle}>
                    <Text style={style.stockNamePriceDateStyle}>REDINGTON</Text>
                    <Text style={style.stockNamePriceDateStyle}>123</Text>
                    <Text style={style.stockNamePriceDateStyle}>15-NOV-2025</Text>
                </View>

                <TouchableOpacity style={style.deleteButtonStyle}>
                    <DeleteLogo />
                </TouchableOpacity>
            </View>

            <View style={style.mainContainerParent}>
                <View style={style.stockDetailsParentStyle}>
                    <Text style={style.stockNamePriceDateStyle}>REDINGTON</Text>
                    <Text style={style.stockNamePriceDateStyle}>123</Text>
                    <Text style={style.stockNamePriceDateStyle}>15-NOV-2025</Text>
                </View>

                <TouchableOpacity style={style.deleteButtonStyle}>
                    <DeleteLogo />
                </TouchableOpacity>
            </View>

            <View style={style.mainContainerParent}>
                <View style={style.stockDetailsParentStyle}>
                    <Text style={style.stockNamePriceDateStyle}>REDINGTON</Text>
                    <Text style={style.stockNamePriceDateStyle}>123</Text>
                    <Text style={style.stockNamePriceDateStyle}>15-NOV-2025</Text>
                </View>

                <TouchableOpacity style={style.deleteButtonStyle}>
                    <DeleteLogo />
                </TouchableOpacity>
            </View>
        </ScrollView>

    </View>
);

    // return (
    //     <Text style={style.text}>Hellow</Text>
    // );

}


const style = StyleSheet.create({
    text: {
        color: "#ffff",
        fontFamily: "Jura-Bold",
    },
    headingStyle: {
        display: "flex",
        flexDirection: "row",
        gap: 40,
        paddingRight: 40, 
        marginLeft : 10
    }, 

    // style section for the stock price name and date container
    mainContainerParent : {
        marginTop : 20,
        display : "flex",
        flexDirection : "row", 

        alignItems : "center"
    },
    stockDetailsParentStyle :{
        backgroundColor: "#D9D9D9", 
        display: "flex",
        flexDirection : "row",

        borderRadius : 10, 
        borderWidth : 1,
        borderColor : "#5F48F5"
    },
    stockNamePriceDateStyle : {
        padding : 18
    },
    deleteButtonStyle : {
        backgroundColor : "#f40b0bff", 
        padding : 10, 
        margin : 5, 

        borderRadius: 10,
    }
    
})

export default AddedStocksList;