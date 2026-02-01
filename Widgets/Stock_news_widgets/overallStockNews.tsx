import { StyleSheet, View, Text } from "react-native"
import LinearGradient from "react-native-linear-gradient";

const OverallStockNewsTemplate = () => {

    return (

        <LinearGradient colors={['#000000', '#372A8F']} locations={[0.02, 1]}  style={style.parentDesign}>
        

            {/* stock name and the timestamp */}
            
            <View style={style.stockNameTimeStampParent}> 
                <Text style={style.textDesignStockNameTimeStamp}>SUZOL</Text>
                <Text style={style.textDesignStockNameTimeStamp}>15 mins ago</Text>
            </View>

            {/* main content */}
            <View>
                <Text style={style.textDesignNewsContent}>Indian renewable energy solutions provider Suzlon Group has secured an order from </Text>
            </View>
        
        </LinearGradient>


    )
    // parent container


}

const style = StyleSheet.create({
    parentDesign :{
        height : 120,
        width : 300,
        padding : 15,
        // height : "auto",
        // borderCurve : "circular",
        // borderRadius : 20
        borderWidth: 1,
        borderColor: "#FFFF",
        borderRadius : 20,
        // margin : 10
    },

    stockNameTimeStampParent:{
        // padding : 10,
        marginBottom : 15,
        display : "flex",
        flexDirection : "row",
        gap : 10
    },

    textDesignStockNameTimeStamp : {
        color : "#D9D9D9", 
        fontFamily: "Jura-Bold",
        fontSize : 16, 
      
        
    },
    textDesignNewsContent:{
        color : "#D9D9D9", 
        fontFamily: "Jura-Bold",
        // fontStyle: "italic"
    }
})

export default OverallStockNewsTemplate