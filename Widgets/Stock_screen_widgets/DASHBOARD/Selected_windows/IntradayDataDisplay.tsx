import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, LayoutAnimation, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LOGO_DEV_PUBLIC_KEY } from '@env';
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
    const navigation = useNavigation<any>();
    const [isExpanded, setIsExpanded] = useState<string | null>(null);

    const BULLISH_SIGNALS = ["Buyer_Control", "Intraday_Strength", "VWAP_Hold", "Dip_Absorption", "Late_Buying", "Trend_Day_Up"];
    const BEARISH_SIGNALS = ["Seller_Control", "Intraday_Weakness", "VWAP_Rejection", "Late_Selling", "Trend_Day_Down"];

    const getSignalCounts = (signals: Record<string, boolean>) => ({
        bull: BULLISH_SIGNALS.filter(k => signals[k as keyof typeof signals]).length,
        bear: BEARISH_SIGNALS.filter(k => signals[k as keyof typeof signals]).length,
    });
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
    const [todayDate, setTodayDate] = useState<string>("");
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
            const computedDate = dateParam ?? `${String(today.getDate()).padStart(2, "0")}-${String(today.getMonth() + 1).padStart(2, "0")}-${today.getFullYear()}`;
            const todayDate = computedDate;
            if (!dateParam) setTodayDate(computedDate);
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
                <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                {jsonData?.stocks.map((stock) => {
                    const priceChange = stock.ohlc.closing - stock.ohlc.opening;
                    const pricePct = stock.ohlc.opening !== 0
                        ? ((priceChange / stock.ohlc.opening) * 100).toFixed(2)
                        : "0.00";
                    const isPositive = priceChange >= 0;
                    const { bull, bear } = getSignalCounts(stock.signals as Record<string, boolean>);
                    const pct = stock.stats.percentage;
                    const pctColor = pct >= 60 ? "#43fb00" : pct <= 40 ? "#ff4d4d" : "#ffd700";

                    return (
                        <TouchableOpacity
                            key={stock.name}
                            style={style.cardParent}
                            activeOpacity={0.85}
                            onPress={() =>
                                navigation.navigate("StockAnalysisExpanded", {
                                    stockName: stock.name,
                                    date: selectedDate ?? todayDate,
                                })
                            }
                        >
                            {/* ── Header row ── */}
                            <View style={style.cardHeader}>
                                <View style={style.cardHeaderLeft}>
                                    <View style={style.nameRow}>
                                        <Image
                                            source={{ uri: `https://img.logo.dev/ticker/${stock.name}.NS?token=${LOGO_DEV_PUBLIC_KEY}` }}
                                            style={style.stockLogo}
                                        />
                                        <Text style={style.stockName}>{stock.name}</Text>
                                    </View>
                                    <View style={[style.changePill, { backgroundColor: isPositive ? "#0d2e0d" : "#2e0d0d" }]}>
                                        <Text style={[style.changeText, { color: isPositive ? "#43fb00" : "#ff4d4d" }]}>
                                            {isPositive ? "+" : ""}{priceChange.toFixed(2)}  ({pricePct}%)
                                        </Text>
                                    </View>
                                </View>
                                <View style={[style.pctBadge, { borderColor: pctColor }]}>
                                    <Text style={[style.pctValue, { color: pctColor }]}>{pct.toFixed(0)}</Text>
                                    <Text style={[style.pctLabel, { color: pctColor }]}>%ile</Text>
                                </View>
                            </View>

                            {/* ── OHLC row ── */}
                            <View style={style.ohlcRow}>
                                {([
                                    { label: "OPEN",  val: stock.ohlc.opening },
                                    { label: "HIGH",  val: stock.ohlc.high },
                                    { label: "LOW",   val: stock.ohlc.low },
                                    { label: "CLOSE", val: stock.ohlc.closing },
                                ] as const).map(({ label, val }) => (
                                    <View key={label} style={style.ohlcCell}>
                                        <Text style={style.ohlcLabel}>{label}</Text>
                                        <Text style={style.ohlcValue}>{val.toFixed(2)}</Text>
                                    </View>
                                ))}
                            </View>

                            {/* ── Signal pills ── */}
                            <View style={style.signalRow}>
                                <View style={style.signalPillBull}>
                                    <View style={style.signalDotBull} />
                                    <Text style={style.signalPillTextBull}>{bull} Bullish</Text>
                                </View>
                                <View style={style.signalPillBear}>
                                    <View style={style.signalDotBear} />
                                    <Text style={style.signalPillTextBear}>{bear} Bearish</Text>
                                </View>
                            </View>

                            {/* ── Summary ── */}
                            <View style={style.summaryBlock}>
                                <Text style={style.summary}>
                                    {expandedSummaries.has(stock.name)
                                        ? stock.summary
                                        : getTwoSentences(stock.summary)}
                                </Text>
                                {getTwoSentences(stock.summary) !== stock.summary && (
                                    <TouchableOpacity onPress={(e) => { e.stopPropagation?.(); toggleSummary(stock.name); }}>
                                        <Text style={style.showMoreText}>
                                            {expandedSummaries.has(stock.name) ? "Read less ↑" : "Read more ↓"}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>

                            {/* ── Tap hint ── */}
                            <View style={style.cardFooter}>
                                <Text style={style.cardFooterText}>View full analysis  →</Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
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
        backgroundColor: "#111",
        marginHorizontal: 16,
        marginTop: 14,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#222",
        overflow: "hidden",
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 12,
    },
    cardHeaderLeft: {
        flex: 1,
        gap: 6,
    },
    nameRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    stockLogo: {
        width: 35,
        height: 35,
        borderRadius: 10,
    },
    stockName: {
        color: primaryColor,
        fontFamily: "Jura-Bold",
        fontSize: 18,
        letterSpacing: 1.5,
    },
    changePill: {
        alignSelf: "flex-start",
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    changeText: {
        fontFamily: "Jura-Bold",
        fontSize: 12,
    },
    pctBadge: {
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1.5,
        borderRadius: 14,
        paddingHorizontal: 10,
        paddingVertical: 6,
        minWidth: 54,
    },
    pctValue: {
        fontFamily: "Jura-Bold",
        fontSize: 18,
        lineHeight: 22,
    },
    pctLabel: {
        fontFamily: "Jura-Bold",
        fontSize: 9,
        letterSpacing: 1,
        opacity: 0.75,
    },
    ohlcRow: {
        flexDirection: "row",
        backgroundColor: "#0a0a0a",
        marginHorizontal: 12,
        borderRadius: 14,
        paddingVertical: 10,
        marginBottom: 10,
    },
    ohlcCell: {
        flex: 1,
        alignItems: "center",
    },
    ohlcLabel: {
        fontFamily: "Jura-Bold",
        fontSize: 9,
        color: "#555",
        letterSpacing: 0.5,
        marginBottom: 3,
    },
    ohlcValue: {
        fontFamily: "Jura-Bold",
        fontSize: 13,
        color: primaryColor,
    },
    signalRow: {
        flexDirection: "row",
        gap: 8,
        paddingHorizontal: 12,
        marginBottom: 12,
    },
    signalPillBull: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        backgroundColor: "#0d2e0d",
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    signalDotBull: {
        width: 6, height: 6, borderRadius: 3,
        backgroundColor: "#43fb00",
    },
    signalPillTextBull: {
        fontFamily: "Jura-Bold",
        fontSize: 11,
        color: "#43fb00",
    },
    signalPillBear: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        backgroundColor: "#2e0d0d",
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    signalDotBear: {
        width: 6, height: 6, borderRadius: 3,
        backgroundColor: "#ff4d4d",
    },
    signalPillTextBear: {
        fontFamily: "Jura-Bold",
        fontSize: 11,
        color: "#ff4d4d",
    },
    summaryBlock: {
        borderTopWidth: 1,
        borderTopColor: "#1e1e1e",
        paddingHorizontal: 14,
        paddingTop: 10,
        paddingBottom: 4,
    },
    summary: {
        fontFamily: "Jura-Bold",
        fontSize: 12,
        color: "#999",
        lineHeight: 18,
    },
    cardFooter: {
        alignItems: "flex-end",
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    cardFooterText: {
        fontFamily: "Jura-Bold",
        fontSize: 11,
        color: secondaryColor,
        opacity: 0.7,
        letterSpacing: 0.5,
    },
    otherDetailsParent: {
        display: "flex",
        alignItems: "center",
    },
    otherDeatilsHeading: {
        fontSize: 12,
        color: primaryColor,
        fontFamily: "Jura-Bold",
    },
    otherDetailsPrice: {
        fontSize: 14,
        color: primaryColor,
        fontFamily: "Jura-Bold",
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

    stockNameLight: {
        fontFamily: 'Jura-Regular',
        fontSize: 12,
        color: '#555',
        marginHorizontal: 12,
        marginBottom: 6,
        fontWeight: '300',
    },

    showMoreText: {
        fontFamily: 'Jura-Bold',
        fontSize: 11,
        color: secondaryColor,
        textDecorationLine: 'underline',
        marginTop: 4,
        marginBottom: 4,
        opacity: 0.8,
    },

})

export default IntradayDataDisplay