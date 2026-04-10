import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, LayoutAnimation } from "react-native";
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore, collection, doc, addDoc, setDoc, getDoc, getDocs, deleteDoc } from "@react-native-firebase/firestore";
import StockWindowSelctor from "../StockWindowSelector";

// const fireBaseUser = getAuth();
const db = getFirestore()
// const loggedinUser = fireBaseUser.currentUser?.uid;

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
        summary: string;
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
    const [noData, setNoData] = useState(false);
    const [title, setTitle] = useState("")
    const [summary, setSummary] = useState("")
    const [percentage, setPercetange] = useState<number | null>(null);
    const [opening, Setopening] = useState<number | null>(null);
    const [closing, Setclosing] = useState<number | null>(null);
    const [highest, Sethighest] = useState<number | null>(null);
    const [lowest, Setlowest] = useState<number | null>(null);
    const [availableDates, setAvailableDates] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [expandedSummaries, setExpandedSummaries] = useState<Set<string>>(new Set());




    const intraDayData = async (dateParam?: string) => {
        try {
            const loggedinUser = getAuth().currentUser?.uid;
        
            if (!loggedinUser) {
                console.log("No user logged in");
                return null;    
            }

            console.log("Fetching intraday data for user:", loggedinUser);  

            // fetching the data asper current date from the firestore database where the intraday data is stored
            const today = new Date();
            const todayDate = dateParam ?? `${String(today.getDate()).padStart(2, "0")}-${String(today.getMonth() + 1).padStart(2, "0")}-${today.getFullYear()}`;
            const ref = doc(
                db,
                "Users",
                loggedinUser!,
                "Agents",
                "Finance",
                "Stock_Data",
                "IntraDay",
                "Data",
                todayDate
            );
            const snapshot = await getDoc(ref);
            if (!snapshot.exists()) {
                setNoData(true);
                return null;
            }
            const data = snapshot.data() as DayDocument;
            console.log("DATA:" , data)
            const { DATA, last_added } = data;
            const summaryObj = JSON.parse(DATA.summary) as Record<string, string>;
            const jsonData = {
                date: DATA.date,
                last_added: last_added,
                summary: DATA.summary,
                stocks: DATA.report.map((stockEntry) => ({
                    name: stockEntry.stocks,
                    summary: summaryObj[stockEntry.stocks] ?? "",
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


    const userselcteddata = async () => {
        try {
            const loggedinUser = getAuth().currentUser?.uid;
            if (!loggedinUser) {
                console.log("No user logged in");
                return;
            }
            const colRef = collection(
                db,
                "Users",
                loggedinUser,
                "Agents",
                "Finance",
                "Stock_Data",
                "IntraDay",
                "Data"
            );
            const snapshot = await getDocs(colRef);
            const dates = snapshot.docs.map((d: { id: string }) => d.id);
            setAvailableDates(dates);
        } catch (error) {
            console.log("Error fetching available dates:", error);
        }
    };

    const handleDateSelect = async (date: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setSelectedDate(date);
        setDropdownOpen(false);
        setJsonData(null);
        setNoData(false);
        const data = await intraDayData(date);
        if (data) {
            setNoData(false);
            setJsonData(data);
        } else {
            setNoData(true);
        }
    };

    const getTwoSentences = (text: string): string => {
        const sentences = text.match(/[^.!?]+[.!?]+/g);
        if (!sentences || sentences.length <= 2) return text;
        return sentences.slice(0, 2).join('').trim();
    };

    const toggleSummary = (name: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedSummaries((prev) => {
            const next = new Set(prev);
            next.has(name) ? next.delete(name) : next.add(name);
            return next;
        });
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
            if (data) {
                setNoData(false);
                setJsonData(data);
            }
        };
        fetchData();
        userselcteddata();
    }, []);


    // then access it like
    const stocks = jsonData?.stocks;
    console.log("-----> INTRDAY DATA :", stocks)
    // const summary = jsonData?.summary;


    return(
    <SafeAreaView style={style.screenParent}>
    {windowChecker == "intraday" && (
        <View style={style.dropdownWrapper}>
            <TouchableOpacity
                style={style.dropdownTrigger}
                onPress={() => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    setDropdownOpen(!dropdownOpen);
                }}
            >
                <Text style={style.dropdownTriggerText}>
                    {selectedDate ?? "Select Date"}
                </Text>
                <Text style={style.dropdownArrow}>{dropdownOpen ? "▲" : "▼"}</Text>
            </TouchableOpacity>
            {dropdownOpen && (
                <ScrollView style={style.dropdownList} nestedScrollEnabled>
                    {availableDates.length === 0 ? (
                        <Text style={style.dropdownItemText}>No dates available</Text>
                    ) : (
                        availableDates.map((date) => (
                            <TouchableOpacity
                                key={date}
                                style={[
                                    style.dropdownItem,
                                    selectedDate === date && style.dropdownItemSelected,
                                ]}
                                onPress={() => handleDateSelect(date)}
                            >
                                <Text style={style.dropdownItemText}>{date}</Text>
                            </TouchableOpacity>
                        ))
                    )}
                </ScrollView>
            )}
        </View>
    )}
    {windowChecker == "intraday" && noData && (
        <View style={style.noDataContainer}>
            <Text style={style.noDataTitle}>No data available for today</Text>
            <Text style={style.noDataSubtitle}>Make sure you have added stocks to your watchlist to see intraday analysis here. Data will be available after 3:45pm</Text>
        </View>
    )}
    {windowChecker == "intraday" && !noData && (
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
                                {expandedSummaries.has(stocks.name)
                                    ? stocks.summary
                                    : getTwoSentences(stocks.summary)}
                            </Text>
                            {getTwoSentences(stocks.summary) !== stocks.summary && (
                                <TouchableOpacity onPress={() => toggleSummary(stocks.name)}>
                                    <Text style={style.showMoreText}>
                                        {expandedSummaries.has(stocks.name) ? "Read less" : "Read more"}
                                    </Text>
                                </TouchableOpacity>
                            )}
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
    },

    noDataContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },

    noDataTitle: {
        fontFamily: 'Jura-Bold',
        fontSize: 16,
        color: primaryColor,
        textAlign: 'center',
        marginBottom: 12,
    },

    noDataSubtitle: {
        fontFamily: 'Jura-Bold',
        fontSize: 13,
        color: primaryColor,
        textAlign: 'center',
        opacity: 0.6,
    },

    dropdownWrapper: {
        marginHorizontal: 20,
        marginTop: 15,
        marginBottom: 5,
        zIndex: 10,
    },

    dropdownTrigger: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#000',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 10,
    },

    dropdownTriggerText: {
        fontFamily: 'Jura-Bold',
        fontSize: 13,
        color: primaryColor,
    },

    dropdownArrow: {
        fontFamily: 'Jura-Bold',
        fontSize: 12,
        color: secondaryColor,
    },

    dropdownList: {
        backgroundColor: '#111',
        borderRadius: 12,
        marginTop: 4,
        maxHeight: 180,
    },

    dropdownItem: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#222',
    },

    dropdownItemSelected: {
        backgroundColor: secondaryColor,
        borderRadius: 10,
    },

    dropdownItemText: {
        fontFamily: 'Jura-Bold',
        fontSize: 13,
        color: primaryColor,
    },

    showMoreText: {
        fontFamily: 'Jura-Bold',
        fontSize: 12,
        color: "#000000",
        textDecorationLine: 'underline',
        marginHorizontal: 10,
        marginBottom: 8,
    },

})

export default IntradayDataDisplay