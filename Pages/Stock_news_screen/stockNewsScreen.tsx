import { SafeAreaView, StyleSheet, View, ScrollView, Text } from "react-native";
import OverallStockNewsTemplate from "../../Widgets/Stock_news_widgets/overallStockNews";
import SlectedStockNewsTemplate from "../../Widgets/Stock_news_widgets/selctedStockNews";
// import { flatten } from "react-native/types_generated/Libraries/StyleSheet/StyleSheetExports";

const StockNewsScreen = () => {
    return (
        <SafeAreaView style={{ flex: 1 }}>

            <View style={style.tagStyle}>
                <Text style={style.tagTextSytle}>HAPPENING TODAY</Text>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={style.overallparentStyle}
            >
                <OverallStockNewsTemplate />
                <OverallStockNewsTemplate />
                <OverallStockNewsTemplate />
                <OverallStockNewsTemplate />
            </ScrollView>

            <View style={style.tagStyle}>
                <Text style={style.tagTextSytle}>YOUR STOCK UPDATES</Text>
            </View>

            <ScrollView>
                <View style={style.addedStockparentStyle}>
                    <SlectedStockNewsTemplate />
                    <SlectedStockNewsTemplate />
                    <SlectedStockNewsTemplate />
                    <SlectedStockNewsTemplate />
                    <SlectedStockNewsTemplate />
                    <SlectedStockNewsTemplate />
                    <SlectedStockNewsTemplate />
                    <SlectedStockNewsTemplate />
                </View>
            </ScrollView>

        </SafeAreaView>
    )
}


const style = StyleSheet.create({

    overallparentStyle: {
        flexDirection: "row",
        gap: 20,
        margin: 10,
        alignItems: "flex-start", 
        height : 180, 
    },

    addedStockparentStyle: {
        display: "flex",
        alignItems: "center",
        // flexDirection: "co",
        gap: 20,
        margin: 10
    },
    tagStyle: {
        // backgroundColor: "#D9D9D9",
        backgroundColor: '#D9D9D9',
        alignSelf: 'flex-start',
        padding: 5,
        borderWidth: 2,
        borderRadius: 10, 
        marginTop : 10, 
        marginLeft : 10
    },
    tagTextSytle: {
        fontFamily: "Jura-Bold",
        // width : "auto"
        fontWeight : "semibold"
    }

})

export default StockNewsScreen