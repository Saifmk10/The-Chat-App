import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, LayoutAnimation, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LOGO_DEV_PUBLIC_KEY } from '@env';
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore, collection, doc, getDoc, getDocs } from "@react-native-firebase/firestore";

const db = getFirestore();

// --- Types ---

type WeeklyStockEntry = {
    stock: string;
    report: {
        closing_sentiment_bias: number;
        consolidation_squeeze_alert: string;
        liquidity_absorption_rate: number;
        net_weekly_return: number;
        volatility_expansion_ratio: number;
        volume_conviction_score: number;
    };
};

type WeeklyDocument = {
    DATA: {
        date: string;
        stocks: WeeklyStockEntry[];
        time: string;
    };
    last_added: string;
};

type JsonData = {
    date: string;
    last_added: string;
    stocks: {
        name: string;
        closing_sentiment_bias: number;
        consolidation_squeeze_alert: string;
        liquidity_absorption_rate: number;
        net_weekly_return: number;
        volatility_expansion_ratio: number;
        volume_conviction_score: number;
    }[];
};

// --- Helpers ---

const safeFixed = (val: number, digits = 2): string => {
    if (!isFinite(val) || isNaN(val)) return "—";
    return val.toFixed(digits);
};

// --- Component ---

const WeeklyDataDisplay = ({ windowChecker }: { windowChecker: string }) => {
    const navigation = useNavigation<any>();

    const [jsonData, setJsonData] = useState<JsonData | null>(null);
    const [noData, setNoData] = useState(false);
    const [availableDates, setAvailableDates] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [todayDate, setTodayDate] = useState<string>("");
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const weeklyData = async (dateParam?: string) => {
        try {
            const loggedinUser = getAuth().currentUser?.uid;
            if (!loggedinUser) {
                console.log("No user logged in");
                return null;
            }

            console.log("Fetching weekly data for user:", loggedinUser);

            const today = new Date();
            const computedDate = dateParam ?? `${String(today.getDate()).padStart(2, "0")}-${String(today.getMonth() + 1).padStart(2, "0")}-${today.getFullYear()}`;
            if (!dateParam) setTodayDate(computedDate);

            const ref = doc(
                db,
                "Users",
                loggedinUser,
                "Agents",
                "Finance",
                "Stock_Data",
                "WeeklyStockData",
                "Data",
                computedDate
            );

            const snapshot = await getDoc(ref);
            if (!snapshot.exists()) {
                setNoData(true);
                return null;
            }

            const data = snapshot.data() as WeeklyDocument;
            console.log("WEEKLY DATA:", data);
            const { DATA, last_added } = data;

            const jsonData: JsonData = {
                date: DATA.date,
                last_added: last_added,
                stocks: DATA.stocks.map((entry) => ({
                    name: entry.stock,
                    closing_sentiment_bias: entry.report.closing_sentiment_bias,
                    consolidation_squeeze_alert: entry.report.consolidation_squeeze_alert,
                    liquidity_absorption_rate: entry.report.liquidity_absorption_rate,
                    net_weekly_return: entry.report.net_weekly_return,
                    volatility_expansion_ratio: entry.report.volatility_expansion_ratio,
                    volume_conviction_score: entry.report.volume_conviction_score,
                })),
            };

            console.log(JSON.stringify(jsonData, null, 2));
            return jsonData;
        } catch (error) {
            console.log("Error fetching weekly data:", error);
            return null;
        }
    };

    const fetchAvailableDates = async () => {
        try {
            const loggedinUser = getAuth().currentUser?.uid;
            if (!loggedinUser) return;
            const colRef = collection(
                db,
                "Users",
                loggedinUser,
                "Agents",
                "Finance",
                "Stock_Data",
                "WeeklyStockData",
                "Data"
            );
            const snapshot = await getDocs(colRef);
            const dates = snapshot.docs.map((d: { id: string }) => d.id);
            setAvailableDates(dates);
        } catch (error) {
            console.log("Error fetching available weekly dates:", error);
        }
    };

    const handleDateSelect = async (date: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setSelectedDate(date);
        setDropdownOpen(false);
        setJsonData(null);
        setNoData(false);
        const data = await weeklyData(date);
        if (data) {
            setNoData(false);
            setJsonData(data);
        } else {
            setNoData(true);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const data = await weeklyData();
            if (data) {
                setNoData(false);
                setJsonData(data);
            }
        };
        fetchData();
        fetchAvailableDates();
    }, []);

    return (
        <SafeAreaView style={style.screenParent}>

            {windowChecker === "1week" && (
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

            {windowChecker === "1week" && noData && (
                <View style={style.noDataContainer}>
                    <Text style={style.noDataTitle}>No weekly data available</Text>
                    <Text style={style.noDataSubtitle}>Weekly analysis is generated after market close on Fridays. Select a date above once data is available.</Text>
                </View>
            )}

            {windowChecker === "1week" && !noData && (
                <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                    {jsonData?.stocks.map((stock) => {
                        const isPositive = stock.net_weekly_return >= 0;
                        const returnColor = isPositive ? "#43fb00" : "#ff4d4d";
                        const returnBg = isPositive ? "#0d2e0d" : "#2e0d0d";
                        const vcScore = stock.volume_conviction_score;
                        const vcColor = vcScore >= 0.8 ? "#43fb00" : vcScore >= 0.5 ? "#ffd700" : "#ff4d4d";
                        const squeezeActive = stock.consolidation_squeeze_alert === "Yes";

                        return (
                            <TouchableOpacity
                                key={stock.name}
                                style={style.cardParent}
                                activeOpacity={0.85}
                                onPress={() =>
                                    navigation.navigate("WeeklyAnalysisExpanded", {
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
                                        <View style={[style.changePill, { backgroundColor: returnBg }]}>
                                            <Text style={[style.changeText, { color: returnColor }]}>
                                                {isPositive ? "+" : ""}{stock.net_weekly_return.toFixed(2)}%  weekly return
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={[style.pctBadge, { borderColor: vcColor }]}>
                                        <Text style={[style.pctValue, { color: vcColor }]}>{vcScore.toFixed(2)}</Text>
                                        <Text style={[style.pctLabel, { color: vcColor }]}>VOL CV</Text>
                                    </View>
                                </View>

                                {/* ── Metrics row ── */}
                                <View style={style.ohlcRow}>
                                    {([
                                        { label: "SENTIMENT", val: safeFixed(stock.closing_sentiment_bias) },
                                        { label: "LIQUIDITY", val: safeFixed(stock.liquidity_absorption_rate) },
                                        { label: "VOLATILITY", val: safeFixed(stock.volatility_expansion_ratio) },
                                    ] as const).map(({ label, val }) => (
                                        <View key={label} style={style.ohlcCell}>
                                            <Text style={style.ohlcLabel}>{label}</Text>
                                            <Text style={style.ohlcValue}>{val}</Text>
                                        </View>
                                    ))}
                                </View>

                                {/* ── Squeeze pill ── */}
                                <View style={style.signalRow}>
                                    <View style={[style.squeezePill, { backgroundColor: squeezeActive ? "#2a2200" : "#1a1a1a" }]}>
                                        <View style={[style.squeezeDot, { backgroundColor: squeezeActive ? "#ffd700" : "#333" }]} />
                                        <Text style={[style.squeezePillText, { color: squeezeActive ? "#ffd700" : "#444" }]}>
                                            Consolidation Squeeze{squeezeActive ? " — Active" : " — None"}
                                        </Text>
                                    </View>
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
    );
};

// --- Styles ---

const primaryColor = "#D9D9D9";
const secondaryColor = "#5F48F5";

const style = StyleSheet.create({

    screenParent: {
        flex: 1,
        alignItems: "stretch",
        flexDirection: "column",
    },

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
    squeezePill: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    squeezeDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    squeezePillText: {
        fontFamily: "Jura-Bold",
        fontSize: 11,
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
    noDataContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 30,
    },
    noDataTitle: {
        fontFamily: "Jura-Bold",
        fontSize: 16,
        color: primaryColor,
        textAlign: "center",
        marginBottom: 12,
    },
    noDataSubtitle: {
        fontFamily: "Jura-Bold",
        fontSize: 13,
        color: primaryColor,
        textAlign: "center",
        opacity: 0.6,
    },
    dropdownWrapper: {
        marginHorizontal: 20,
        marginTop: 15,
        marginBottom: 5,
        zIndex: 10,
    },
    dropdownTrigger: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#000",
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    dropdownTriggerText: {
        fontFamily: "Jura-Bold",
        fontSize: 13,
        color: primaryColor,
    },
    dropdownArrow: {
        fontFamily: "Jura-Bold",
        fontSize: 12,
        color: secondaryColor,
    },
    dropdownList: {
        backgroundColor: "#111",
        borderRadius: 12,
        marginTop: 4,
        maxHeight: 180,
    },
    dropdownItem: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#222",
    },
    dropdownItemSelected: {
        backgroundColor: secondaryColor,
        borderRadius: 10,
    },
    dropdownItemText: {
        fontFamily: "Jura-Bold",
        fontSize: 13,
        color: primaryColor,
    },
});

export default WeeklyDataDisplay;
