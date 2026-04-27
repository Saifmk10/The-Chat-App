// weeklyDataDisplay is a widget that shows the user the weekly report data

import React, { useEffect, useState, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, LayoutAnimation, Image, Modal, Pressable } from "react-native";
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
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
    const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());

    const availableDateSet = useMemo(() => new Set(availableDates), [availableDates]);

    const MONTH_NAMES = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    const DAY_HEADERS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    const calendarDays = useMemo(() => {
        const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
        const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
        const cells: (number | null)[] = Array(firstDay).fill(null);
        for (let d = 1; d <= daysInMonth; d++) cells.push(d);
        return cells;
    }, [calendarMonth, calendarYear]);

    const formatDDMMYYYY = (day: number) =>
        `${String(day).padStart(2, "0")}-${String(calendarMonth + 1).padStart(2, "0")}-${calendarYear}`;

    const goToPrevMonth = () => {
        if (calendarMonth === 0) { setCalendarMonth(11); setCalendarYear(y => y - 1); }
        else setCalendarMonth(m => m - 1);
    };
    const goToNextMonth = () => {
        if (calendarMonth === 11) { setCalendarMonth(0); setCalendarYear(y => y + 1); }
        else setCalendarMonth(m => m + 1);
    };

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
        setCalendarOpen(false);
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
                        onPress={() => setCalendarOpen(true)}
                    >
                        <Text style={style.dropdownTriggerText}>
                            {selectedDate ?? "Select Date"}
                        </Text>
                        <Text style={style.dropdownArrow}>📅</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Calendar Modal */}
            <Modal visible={calendarOpen} transparent animationType="fade" onRequestClose={() => setCalendarOpen(false)}>
                <Pressable style={style.calBackdrop} onPress={() => setCalendarOpen(false)}>
                    <Pressable style={style.calCard} onPress={() => {}}>
                        <View style={style.calNav}>
                            <TouchableOpacity onPress={goToPrevMonth} style={style.calNavBtn}>
                                <Text style={style.calNavArrow}>←</Text>
                            </TouchableOpacity>
                            <Text style={style.calMonthLabel}>{MONTH_NAMES[calendarMonth]} {calendarYear}</Text>
                            <TouchableOpacity onPress={goToNextMonth} style={style.calNavBtn}>
                                <Text style={style.calNavArrow}>→</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={style.calRow}>
                            {DAY_HEADERS.map(d => (
                                <View key={d} style={style.calHeaderCell}>
                                    <Text style={style.calHeaderText}>{d}</Text>
                                </View>
                            ))}
                        </View>

                        <View style={style.calGrid}>
                            {calendarDays.map((day, i) => {
                                if (day === null) return <View key={`e-${i}`} style={style.calDayCell} />;
                                const dateStr = formatDDMMYYYY(day);
                                const hasData = availableDateSet.has(dateStr);
                                const isSelected = selectedDate === dateStr;
                                return (
                                    <View key={dateStr} style={style.calDayCell}>
                                        <TouchableOpacity
                                            style={[
                                                style.calDayInner,
                                                hasData && style.calDayAvailable,
                                                isSelected && style.calDaySelected,
                                            ]}
                                            disabled={!hasData}
                                            onPress={() => handleDateSelect(dateStr)}
                                        >
                                            <Text style={[
                                                style.calDayText,
                                                !hasData && style.calDayDisabled,
                                                isSelected && style.calDaySelectedText,
                                            ]}>{day}</Text>
                                        </TouchableOpacity>
                                    </View>
                                );
                            })}
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>

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
    calBackdrop: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.75)',
        justifyContent: 'center', alignItems: 'center', padding: 20,
    },
    calCard: {
        backgroundColor: '#111', borderRadius: 20, padding: 16,
        borderWidth: 1, borderColor: '#2a2a2a', width: '100%',
    },
    calNav: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 14,
    },
    calNavBtn: { padding: 6 },
    calNavArrow: { color: primaryColor, fontSize: 20, fontFamily: 'Jura-Bold' },
    calMonthLabel: {
        color: primaryColor, fontFamily: 'Jura-Bold', fontSize: 15,
        letterSpacing: 1,
    },
    calRow: { flexDirection: 'row' },
    calHeaderCell: { flex: 1, alignItems: 'center', paddingBottom: 8 },
    calHeaderText: {
        color: '#555', fontFamily: 'Jura-Bold', fontSize: 15, letterSpacing: 0.5,
    },
    calGrid: { flexDirection: 'row', flexWrap: 'wrap' },
    calDayCell: {
        width: '14.28%', alignItems: 'center', justifyContent: 'center',
        paddingVertical: 4,
    },
    calDayInner: {
        width: 40, height: 40, borderRadius: 20,
        justifyContent: 'center', alignItems: 'center',
    },
    calDayText: {
        color: primaryColor, fontFamily: 'Jura-Bold', fontSize: 17,
    },
    calDayDisabled: { color: '#333' },
    calDayAvailable: { backgroundColor: '#1a1a1a' },
    calDaySelected: { backgroundColor: secondaryColor },
    calDaySelectedText: { color: '#fff' },
});

export default WeeklyDataDisplay;
