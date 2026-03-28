import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, LayoutAnimation } from "react-native";
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore, collection, doc, addDoc, setDoc, getDoc, deleteDoc } from "@react-native-firebase/firestore";
import StockWindowSelctor from "../StockWindowSelector";

const fireBaseUser = getAuth();
const db = getFirestore()
const loggedinUser = fireBaseUser.currentUser?.uid;

type DayDocument = {
        DATA: {                     // ← wrapping layer
            date: string;
            report: StockAnalysis[];
            summary: string;
        };
        last_added: string;         // ← this sits outside DATA
    };

type JsonData = {
    date: string;
    last_added: string;
    summary: string;
    stocks: {
        name: string;
        ohlc: {
            opening: number;
            closing: number;
            high: number;
            low: number;
        };
        signals: {
            Buyer_Control: boolean;
            Seller_Control: boolean;
            Intraday_Weakness: boolean;
            Intraday_Strength: boolean;
            VWAP_Hold: boolean;
            Mid_Range_Close: boolean;
            Indecision_Day: boolean;
            Wide_Range_Day: boolean;
            VWAP_Rejection: boolean;
            Dip_Absorption: boolean;
            Late_Selling: boolean;
            Late_Buying: boolean;
            Small_Range_Day: boolean;
            Trend_Day_Up: boolean;
            Trend_Day_Down: boolean;
        };
        stats: {
            count: number;
            percentage: number;
            mean: number;
            median: number;
            std: number;
            range: number;
            min: number;
            max: number;
            q25: number;
            q50: number;
            q75: number;
        };
    }[];
};



type StockAnalysis = {
    stocks: string;
    summary: string;
    analysis: {
        ohlc: {
            opening: number;
            closing: number;
            high: number;
            low: number;
        };
        signal: {
            Buyer_Control: boolean;
            Seller_Control: boolean;
            Intraday_Weakness: boolean;
            Intraday_Strength: boolean;
            VWAP_Hold: boolean;
            Mid_Range_Close: boolean;
            Indecision_Day: boolean;
            Wide_Range_Day: boolean;
            VWAP_Rejection: boolean;
            Dip_Absorption: boolean;
            Late_Selling: boolean;
            Late_Buying: boolean;
            Small_Range_Day: boolean;
            Trend_Day_Up: boolean;
            Trend_Day_Down: boolean;
        };
        stats: {
            count: number;
            percentage: number;
            mean: number;
            median: number;
            std: number;
            range: number;
            min: number;
            max: number;
            q25: number;
            q50: number;
            q75: number;
        };
    };
};







const IntradayDataDisplay = ({ windowChecker }: { windowChecker: string }) => {
    const [isExpanded, setIsExpanded] = useState<string | null>(null);
    const [jsonData, setJsonData] = useState<JsonData | null>(null);
    const [title, setTitle] = useState("")
    const [summary, setSummary] = useState("")
    const [percentage, setPercetange] = useState<number | null>(null);
    const [opening, Setopening] = useState<number | null>(null);
    const [closing, Setclosing] = useState<number | null>(null);
    const [highest, Sethighest] = useState<number | null>(null);
    const [lowest, Setlowest] = useState<number | null>(null);




    const intraDayData = async () => {

    
        try {
            const ref = doc(
                db,
                "Users",
                loggedinUser!,
                "Agents",
                "Finance",
                "Stock_Data",
                "IntraDay",
                "Data",
                "09-02-2026"
            );
            const snapshot = await getDoc(ref);
            if (!snapshot.exists()) return null;
            const data = snapshot.data() as DayDocument;
            const { DATA, last_added } = data;
            const jsonData = {
                date: DATA.date,
                last_added: last_added,
                summary: DATA.summary,
                stocks: DATA.report.map((stockEntry) => ({
                    // summary:stockEntry.summary,
                    name: stockEntry.stocks,
                    ohlc: stockEntry.analysis.ohlc,
                    signals: stockEntry.analysis.signal,
                    stats: stockEntry.analysis.stats,
                })),
            };
            console.log(JSON.stringify(jsonData, null, 2));
            return jsonData;
        } catch (error) {
            console.log("Error fetching intraday data:", error);
            return null;
        }
    };


    const toggleExpand = (name: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsExpanded(isExpanded === name ? null : name);
    };
    // useEffect(() => {
    //     const fetchData = async () => {
    //         const data = await intraDayData();
    //         if (data) setJsonData(data);
    //     };
    //     fetchData();
    // }, []);


    useEffect(() => {
        const fetchData = async () => {
            const data = await intraDayData();
            if (data) setJsonData(data); 
        };
        fetchData();
    }, []);


    // then access it like
    const stocks = jsonData?.stocks;
    console.log("-----> INTRDAY DATA :", stocks)
    // const summary = jsonData?.summary;


    return(
    <SafeAreaView style={style.screenParent}>
    {windowChecker == "intraday" && (
                <ScrollView>
                {jsonData?.stocks.map((stocks) => (

                    <View style={style.cardParent}>
                        <View>
                            <Text style={style.stockName}>
                                {stocks.name}
                                
                            </Text>
                        </View>

                        <View>
                            <Text style={style.summary}>
                               {/* {stocks.} */}
                               {jsonData.summary}
                            </Text>
                        </View>

                        <TouchableOpacity onPress={() => toggleExpand(stocks.name)} style={style.stockDetailsParent}>
                            <View style={style.stockDetails}>
                                <Text style={style.percet}>
                                    %{stocks.stats.percentage}
                                </Text>
                                <View style={style.otherDetailsParent}>
                                    <Text style={style.otherDeatilsHeading}>OPENING</Text>
                                    <Text style={style.otherDetailsPrice}>
                                        {stocks.ohlc.opening}
                                    </Text>
                                </View>
                                <View style={style.otherDetailsParent}>
                                    <Text style={style.otherDeatilsHeading}>CLOSING</Text>
                                    <Text style={style.otherDetailsPrice}>
                                        {stocks.ohlc.closing}
                                    </Text>
                                </View>
                                <View style={style.otherDetailsParent}>
                                    <Text style={style.otherDeatilsHeading}>HIGHEST</Text>
                                    <Text style={style.otherDetailsPrice}>
                                        {stocks.ohlc.high}
                                    </Text>
                                </View>
                                <View style={style.otherDetailsParent}>
                                    <Text style={style.otherDeatilsHeading}>LOWEST</Text>
                                    <Text style={style.otherDetailsPrice}>
                                        {stocks.ohlc.low}
                                    </Text>
                                </View>
                            </View>

                            
                            {/* expands to show more details about the analysis */}

                            {isExpanded === stocks.name && (
                                <View style={style.stockDetails}>
                                    <View style={style.otherDetailsParent}>
                                        <Text style={style.otherDeatilsHeading}>OPENING</Text>
                                        <Text style={style.otherDetailsPrice}>
                                            {stocks.ohlc.opening}
                                        </Text>
                                    </View>
                                    <View style={style.otherDetailsParent}>
                                        <Text style={style.otherDeatilsHeading}>CLOSING</Text>
                                        <Text style={style.otherDetailsPrice}>
                                            {stocks.ohlc.closing}
                                        </Text>
                                    </View>
                                    <View style={style.otherDetailsParent}>
                                        <Text style={style.otherDeatilsHeading}>HIGHEST</Text>
                                        <Text style={style.otherDetailsPrice}>
                                            {stocks.ohlc.high}
                                        </Text>
                                    </View>
                                    <View style={style.otherDetailsParent}>
                                        <Text style={style.otherDeatilsHeading}>LOWEST</Text>
                                        <Text style={style.otherDetailsPrice}>
                                            {stocks.ohlc.low}
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>

                ))}
            </ScrollView>
            )}

            {windowChecker == "1week" && (
                <View>
                    <Text style={style.otherDeatilsHeading}>
                        1 week data
                    </Text>
                </View>
            )}
            

        </SafeAreaView>
    )
}





const primaryColor = "#D9D9D9"
const secondaryColor = "#5F48F5"

const style = StyleSheet.create({

    screenParent: {
        // display: "flex",
        flex: 1,
        alignItems: "stretch",
        flexDirection: "column"
        // justifyContent : "center"
    },

    selctorParent: {
        display: "flex",
        flexDirection: "row",
        gap: 25
    },


    selectorButton: {
        backgroundColor: primaryColor,
        // color : "#0000"
        color: "#000",
        padding: 7,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: primaryColor,

        fontFamily: 'Jura-Bold',
        fontSize: 12,
    },

    selectorButtonChecked: {
        backgroundColor: secondaryColor,
        color: primaryColor,
        padding: 7,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: primaryColor,

        fontFamily: 'Jura-Bold',
        fontSize: 12,
        fontWeight: "bold"
    },


    // DESIGN FOR THE CARDS

    cardParent: {
        backgroundColor: primaryColor,
        margin: 20,
        borderRadius: 20
    },
    stockName: {
        backgroundColor: "#000",
        color: primaryColor,
        margin: 10,
        padding: 10,
        alignSelf: "flex-start",
        borderRadius: 20,

        fontFamily: 'Jura-Bold',
    },
    summary: {
        margin: 10,
        // padding : 10

        fontFamily: 'Jura-Bold',
    },

    stockDetailsParent: {
        display: "flex",
        flexDirection: "column"
    },

    stockDetails: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: 5,
        gap: 10,
        backgroundColor: "#000",
        margin: 5,
        borderRadius: 15,
        height: 60,
        // padding : 10
    },
    percet: {
        fontSize: 20,
        padding: 5,
        color: "#43fb00",

        fontFamily: 'Jura-Bold',
    },
    otherDetailsParent: {
        display: "flex",
        alignItems: "center",
    },
    otherDeatilsHeading: {
        fontSize: 12,
        color: primaryColor,

        fontFamily: 'Jura-Bold',
    },
    otherDetailsPrice: {
        fontSize: 14,
        color: primaryColor,

        fontFamily: 'Jura-Bold',
    }



})

export default IntradayDataDisplay