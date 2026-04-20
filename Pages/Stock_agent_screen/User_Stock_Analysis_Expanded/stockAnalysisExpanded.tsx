import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    ActivityIndicator,
    Dimensions,
    Modal,
    Pressable,
    Image,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { LOGO_DEV_PUBLIC_KEY } from '@env';
import { getAuth } from "@react-native-firebase/auth";
import { getFirestore, doc, getDoc } from "@react-native-firebase/firestore";

import { GaugeChart } from "../../../Assets/graphs";
import { BarChart } from "../../../Assets/graphs";
import { DonutChart } from "../../../Assets/graphs";
import { HorizontalBarChart } from "../../../Assets/graphs";

const db = getFirestore();
const { width: screenWidth } = Dimensions.get("window");

// --- Types ---

type SignalKey =
    | "Buyer_Control"
    | "Seller_Control"
    | "Intraday_Weakness"
    | "Intraday_Strength"
    | "VWAP_Hold"
    | "Mid_Range_Close"
    | "Indecision_Day"
    | "Wide_Range_Day"
    | "VWAP_Rejection"
    | "Dip_Absorption"
    | "Late_Selling"
    | "Late_Buying"
    | "Small_Range_Day"
    | "Trend_Day_Up"
    | "Trend_Day_Down";

type StockDetail = {
    name: string;
    summary: string;
    ohlc: { opening: number; closing: number; high: number; low: number };
    signals: Record<SignalKey, boolean>;
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

type DayDocument = {
    DATA: {
        date: string;
        report: {
            stocks: string;
            summary: string;
            analysis: {
                ohlc: { opening: number; closing: number; high: number; low: number };
                signal: Record<SignalKey, boolean>;
                stats: StockDetail["stats"];
            };
        }[];
        summary: string;
    };
    last_added: string;
};

export type StockAnalysisExpandedParams = {
    StockAnalysisExpanded: {
        stockName: string;
        date: string;
    };
};

// --- Signal classification ---

const BULLISH_SIGNALS: SignalKey[] = [
    "Buyer_Control", "Intraday_Strength", "VWAP_Hold",
    "Dip_Absorption", "Late_Buying", "Trend_Day_Up",
];
const BEARISH_SIGNALS: SignalKey[] = [
    "Seller_Control", "Intraday_Weakness", "VWAP_Rejection",
    "Late_Selling", "Trend_Day_Down",
];
const NEUTRAL_SIGNALS: SignalKey[] = [
    "Mid_Range_Close", "Indecision_Day", "Wide_Range_Day", "Small_Range_Day",
];

const signalColor = (key: SignalKey, active: boolean) => {
    if (!active) return { bg: "#1a1a1a", text: "#444" };
    if (BULLISH_SIGNALS.includes(key)) return { bg: "#0d2e0d", text: "#43fb00" };
    if (BEARISH_SIGNALS.includes(key)) return { bg: "#2e0d0d", text: "#ff4d4d" };
    return { bg: "#2a2200", text: "#ffd700" };
};

const formatSignalLabel = (key: string) => key.replace(/_/g, " ");

// --- Info content ---

const SECTION_INFO: Record<string, { title: string; body: string }> = {
    DAY_STRENGTH: {
        title: "Day Strength",
        body:
            "A percentile score (0–100) showing where today's close sits relative to the stock's historical intraday range.\n\n" +
            "📈 Above 60 → Strong bullish day. Price closed in the upper end of its range — buyers dominated.\n" +
            "📉 Below 40 → Weak/bearish day. Price closed near lows — sellers controlled the session.\n" +
            "➡️  40–60 → Neutral. No clear directional conviction.\n\n" +
            "Look for scores above 65 for strong intraday buy setups and below 35 for short/sell setups.",
    },
    OHLC: {
        title: "OHLC (Open · High · Low · Close)",
        body:
            "The four key price points that define a trading session.\n\n" +
            "• Open → Where the session started. Gap from previous close signals overnight sentiment.\n" +
            "• High → Maximum price reached — resistance level for the day.\n" +
            "• Low → Minimum price — support level for the day.\n" +
            "• Close → Most important. Where price ended.\n\n" +
            "✅ Good intraday sign: Close near High, wide range, Close > Open.\n" +
            "❌ Bearish sign: Close near Low, Close < Open.\n" +
            "⚠️  Narrow High-Low range = low volatility / indecision day.",
    },
    SUMMARY: {
        title: "Analysis Summary",
        body:
            "An AI-generated narrative of the day's price action, contextualising the signals and statistics into a readable insight.\n\n" +
            "Read this to understand *why* the stock behaved the way it did — not just the numbers.\n\n" +
            "Look for phrases like 'buyer absorption', 'late selling pressure', or 'VWAP rejection' — these point to the dominant intraday theme and directly map to the signals detected.",
    },
    SIGNAL_BREAKDOWN: {
        title: "Signal Breakdown",
        body:
            "A donut chart showing the proportion of Bullish, Bearish, and Neutral signals that fired today.\n\n" +
            "🟢 Bullish signals → Buying pressure, institutional accumulation, upward momentum.\n" +
            "🔴 Bearish signals → Distribution, selling pressure, downward momentum.\n" +
            "🟡 Neutral signals → Indecision, consolidation, or range-bound behaviour.\n\n" +
            "Look for: A strong green slice (2+ bullish signals with 0–1 bearish) is a high-conviction intraday long setup. A dominant red slice indicates a bearish or short-bias day.",
    },
    SIGNALS: {
        title: "Signals",
        body:
            "Individual technical conditions detected for this stock today. Each signal is classified as Bullish (green), Bearish (red), or Neutral (yellow).\n\n" +
            "Key signals to watch:\n" +
            "• Buyer Control / Seller Control → Who dominated the session.\n" +
            "• VWAP Hold → Price respected VWAP as support — bullish continuation signal.\n" +
            "• VWAP Rejection → Price failed at VWAP — bearish signal.\n" +
            "• Dip Absorption → Buyers stepped in at lows — bullish reversal/accumulation.\n" +
            "• Trend Day Up/Down → Strong directional day with minimal pullbacks.\n" +
            "• Indecision Day / Small Range Day → Avoid trading; no edge.\n\n" +
            "✅ Ideal bullish day: Buyer Control + VWAP Hold + Dip Absorption active.\n" +
            "❌ Avoid: Seller Control + VWAP Rejection + Late Selling active together.",
    },
    PRICE_DISTRIBUTION: {
        title: "Price Distribution",
        body:
            "Shows where the stock spent most of its time intraday using quartile statistics.\n\n" +
            "• Q25 → Lower 25% of prices. If price dipped here often, the day was volatile or bearish early.\n" +
            "• Q50 (Median) → The midpoint of all prices during the session.\n" +
            "• Q75 → Upper 25% of prices. Time spent here = sustained buying.\n" +
            "• Mean → Average price of the session.\n\n" +
            "✅ Bullish sign: Mean and Median close to Q75 — price stayed elevated.\n" +
            "❌ Bearish sign: Mean and Median close to Q25 — price stayed depressed.\n" +
            "⚠️  Large gap between Q25 and Q75 = high intraday volatility.",
    },
    FULL_STATS: {
        title: "Full Statistics",
        body:
            "Complete statistical breakdown of all intraday price data points.\n\n" +
            "• Count → Number of data samples analysed. Higher = more reliable stats.\n" +
            "• Percentage → Percentile score (same as Day Strength gauge).\n" +
            "• Std Dev → Standard deviation. Higher = more volatile session.\n" +
            "• Range (Max − Min) → Total intraday price swing. Wide range = high-opportunity day.\n" +
            "• Min / Max → Exact intraday low and high.\n" +
            "• Q25 / Q50 / Q75 → Price quartiles (see Price Distribution).\n\n" +
            "Look for high Percentage + low Std Dev for clean trending days. High Std Dev with low Percentage = choppy, bearish session.",
    },
};

// --- Component ---

const StockAnalysisExpanded = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<RouteProp<StockAnalysisExpandedParams, "StockAnalysisExpanded">>();
    const { stockName, date } = route.params;

    const [stock, setStock] = useState<StockDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [infoModal, setInfoModal] = useState<{ visible: boolean; title: string; body: string }>({
        visible: false, title: "", body: "",
    });

    const showInfo = (key: keyof typeof SECTION_INFO) => {
        const info = SECTION_INFO[key];
        setInfoModal({ visible: true, title: info.title, body: info.body });
    };

    useEffect(() => {
        const fetchStock = async () => {
            try {
                const uid = getAuth().currentUser?.uid;
                if (!uid) { setError(true); setLoading(false); return; }

                const ref = doc(
                    db,
                    "Users", uid,
                    "Agents", "Finance",
                    "Stock_Data", "IntraDay",
                    "Data", date
                );

                const snapshot = await getDoc(ref);
                if (!snapshot.exists()) { setError(true); setLoading(false); return; }

                const data = snapshot.data() as DayDocument;
                const summaryMap = JSON.parse(data.DATA.summary) as Record<string, string>;
                const entry = data.DATA.report.find((r) => r.stocks === stockName);
                if (!entry) { setError(true); setLoading(false); return; }

                setStock({
                    name: entry.stocks,
                    summary: summaryMap[entry.stocks] ?? "",
                    ohlc: entry.analysis.ohlc,
                    signals: entry.analysis.signal,
                    stats: entry.analysis.stats,
                });
            } catch (e) {
                console.log("StockAnalysisExpanded fetch error:", e);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchStock();
    }, [stockName, date]);

    const priceChange = stock ? stock.ohlc.closing - stock.ohlc.opening : 0;
    const priceChangePct = stock && stock.ohlc.opening !== 0
        ? ((priceChange / stock.ohlc.opening) * 100).toFixed(2)
        : "0.00";
    const isPositive = priceChange >= 0;

    const signalDonutData = stock
        ? (() => {
            const bull = BULLISH_SIGNALS.filter(k => stock.signals[k]).length;
            const bear = BEARISH_SIGNALS.filter(k => stock.signals[k]).length;
            const neut = NEUTRAL_SIGNALS.filter(k => stock.signals[k]).length;
            return [
                { name: "Bullish", value: bull || 0.01 },
                { name: "Bearish", value: bear || 0.01 },
                { name: "Neutral", value: neut || 0.01 },
            ];
        })()
        : [];

    const statsBarData = stock
        ? [
            { name: "Q25", value: stock.stats.q25 },
            { name: "Q50", value: stock.stats.q50 },
            { name: "Q75", value: stock.stats.q75 },
            { name: "Mean", value: stock.stats.mean },
            { name: "Median", value: stock.stats.median },
        ]
        : [];

    const ohlcBarData = stock
        ? [
            { name: "Open",  value: stock.ohlc.opening },
            { name: "High",  value: stock.ohlc.high },
            { name: "Low",   value: stock.ohlc.low },
            { name: "Close", value: stock.ohlc.closing },
        ]
        : [];

    return (
        <SafeAreaView style={s.root}>
            <View style={s.header}>
                <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
                    <Text style={s.backArrow}>←</Text>
                </TouchableOpacity>
                <Text style={s.headerTitle} numberOfLines={1}>{stockName}</Text>
                <View style={{ width: 40 }} />
            </View>

            {loading && (
                <View style={s.centeredState}>
                    <ActivityIndicator color="#5F48F5" size="large" />
                    <Text style={s.stateText}>Loading analysis…</Text>
                </View>
            )}

            {!loading && error && (
                <View style={s.centeredState}>
                    <Text style={s.stateText}>Failed to load data for {stockName}.</Text>
                </View>
            )}

            {!loading && !error && stock && (
                <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

                    <Text style={s.dateBadge}>{date}</Text>

                    {/* Stock Logo */}
                    <View style={s.logoWrapper}>
                        <Image source={{ uri: `https://img.logo.dev/ticker/${stockName}.NS?token=${LOGO_DEV_PUBLIC_KEY}` }} style={s.stockLogo} />
                    </View>

                    {/* Price Header */}
                    <View style={s.priceCard}>
                        <View style={s.priceRow}>
                            <View>
                                <Text style={s.priceLabel}>CLOSING</Text>
                                <Text style={s.priceValue}>{stock.ohlc.closing.toFixed(2)}</Text>
                            </View>
                            <View style={[s.changePill, { backgroundColor: isPositive ? "#0d2e0d" : "#2e0d0d" }]}>
                                <Text style={[s.changeText, { color: isPositive ? "#43fb00" : "#ff4d4d" }]}>
                                    {isPositive ? "+" : ""}{priceChange.toFixed(2)}{"  "}({priceChangePct}%)
                                </Text>
                            </View>
                        </View>
                        <View style={s.ohlcRow}>
                            {(["opening", "high", "low"] as const).map((key) => (
                                <View key={key} style={s.ohlcCell}>
                                    <Text style={s.ohlcLabel}>{key.toUpperCase()}</Text>
                                    <Text style={s.ohlcValue}>{stock.ohlc[key].toFixed(2)}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Gauge */}
                    <View style={s.section}>
                        <View style={s.sectionTitleRow}>
                            <Text style={s.sectionTitle}>DAY STRENGTH</Text>
                            <TouchableOpacity onPress={() => showInfo("DAY_STRENGTH")} style={s.infoBtn}>
                                <Text style={s.infoIcon}>ⓘ</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={s.gaugeWrapper}>
                            <GaugeChart
                                value={stock.stats.percentage}
                                maxValue={100}
                                colors={["#43fb00", "#43fb00"]}
                                size={260}
                            />
                        </View>
                    </View>

                    {/* OHLC Bar Chart */}
                    <View style={s.section}>
                        <View style={s.sectionTitleRow}>
                            <Text style={s.sectionTitle}>OHLC</Text>
                            <TouchableOpacity onPress={() => showInfo("OHLC")} style={s.infoBtn}>
                                <Text style={s.infoIcon}>ⓘ</Text>
                            </TouchableOpacity>
                        </View>
                        <BarChart
                            data={ohlcBarData}
                            height={200}
                            colorScheme="purple"
                            showLegend={false}
                        />
                    </View>

                    {/* Summary */}
                    <View style={s.section}>
                        <View style={s.sectionTitleRow}>
                            <Text style={s.sectionTitle}>ANALYSIS SUMMARY</Text>
                            <TouchableOpacity onPress={() => showInfo("SUMMARY")} style={s.infoBtn}>
                                <Text style={s.infoIcon}>ⓘ</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={s.summaryText}>{stock.summary}</Text>
                    </View>

                    {/* Signal Donut */}
                    <View style={s.section}>
                        <View style={s.sectionTitleRow}>
                            <Text style={s.sectionTitle}>SIGNAL BREAKDOWN</Text>
                            <TouchableOpacity onPress={() => showInfo("SIGNAL_BREAKDOWN")} style={s.infoBtn}>
                                <Text style={s.infoIcon}>ⓘ</Text>
                            </TouchableOpacity>
                        </View>
                        <DonutChart
                            data={signalDonutData}
                            size={220}
                            innerRadius={55}
                            colors={["#43fb00", "#ff4d4d", "#ffd700"]}
                        />
                    </View>

                    {/* Signals Grid */}
                    <View style={s.section}>
                        <View style={s.sectionTitleRow}>
                            <Text style={s.sectionTitle}>SIGNALS</Text>
                            <TouchableOpacity onPress={() => showInfo("SIGNALS")} style={s.infoBtn}>
                                <Text style={s.infoIcon}>ⓘ</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={s.signalsGrid}>
                            {(Object.entries(stock.signals) as [SignalKey, boolean][]).map(
                                ([key, active]) => {
                                    const colors = signalColor(key, active);
                                    return (
                                        <View key={key} style={[s.signalChip, { backgroundColor: colors.bg }]}>
                                            <View style={[s.signalDot, { backgroundColor: active ? colors.text : "#333" }]} />
                                            <Text style={[s.signalLabel, { color: colors.text }]}>
                                                {formatSignalLabel(key)}
                                            </Text>
                                        </View>
                                    );
                                }
                            )}
                        </View>
                    </View>

                    {/* Stats Horizontal Bar */}
                    <View style={s.section}>
                        <View style={s.sectionTitleRow}>
                            <Text style={s.sectionTitle}>PRICE DISTRIBUTION</Text>
                            <TouchableOpacity onPress={() => showInfo("PRICE_DISTRIBUTION")} style={s.infoBtn}>
                                <Text style={s.infoIcon}>ⓘ</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={s.hBarCenter}>
                            <HorizontalBarChart
                                data={statsBarData}
                                colors={["#5F48F5"]}
                                width={screenWidth - 48}
                            />
                        </View>
                    </View>

                    {/* Full Stats Grid */}
                    <View style={s.section}>
                        <View style={s.sectionTitleRow}>
                            <Text style={s.sectionTitle}>FULL STATISTICS</Text>
                            <TouchableOpacity onPress={() => showInfo("FULL_STATS")} style={s.infoBtn}>
                                <Text style={s.infoIcon}>ⓘ</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={s.statsGrid}>
                            {[
                                { label: "Count", value: String(stock.stats.count) },
                                { label: "Percentage", value: `${stock.stats.percentage.toFixed(2)}%` },
                                { label: "Mean", value: stock.stats.mean.toFixed(4) },
                                { label: "Median", value: stock.stats.median.toFixed(4) },
                                { label: "Std Dev", value: stock.stats.std.toFixed(4) },
                                { label: "Range", value: stock.stats.range.toFixed(4) },
                                { label: "Min", value: stock.stats.min.toFixed(4) },
                                { label: "Max", value: stock.stats.max.toFixed(4) },
                                { label: "Q25", value: stock.stats.q25.toFixed(4) },
                                { label: "Q50", value: stock.stats.q50.toFixed(4) },
                                { label: "Q75", value: stock.stats.q75.toFixed(4) },
                            ].map(({ label, value }) => (
                                <View key={label} style={s.statCell}>
                                    <Text style={s.statLabel}>{label}</Text>
                                    <Text style={s.statValue}>{value}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                </ScrollView>
            )}

            {/* Info Modal */}
            <Modal
                visible={infoModal.visible}
                transparent
                animationType="fade"
                onRequestClose={() => setInfoModal(m => ({ ...m, visible: false }))}
            >
                <Pressable
                    style={s.modalBackdrop}
                    onPress={() => setInfoModal(m => ({ ...m, visible: false }))}
                >
                    <Pressable style={s.modalCard} onPress={() => {}}>
                        <View style={s.modalHeader}>
                            <Text style={s.modalTitle}>{infoModal.title}</Text>
                            <TouchableOpacity
                                onPress={() => setInfoModal(m => ({ ...m, visible: false }))}
                                style={s.modalCloseBtn}
                            >
                                <Text style={s.modalCloseText}>✕</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Text style={s.modalBody}>{infoModal.body}</Text>
                        </ScrollView>
                    </Pressable>
                </Pressable>
            </Modal>
        </SafeAreaView>
    );
};

// --- Styles ---

const PRIMARY = "#D9D9D9";
const SECONDARY = "#5F48F5";
const BG = "#000";
const CARD_BG = "#111";

const s = StyleSheet.create({
    root: { flex: 1, backgroundColor: BG },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
        paddingTop: 40,
        paddingBottom: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#1e1e1e",
    },
    backBtn: { width: 40, alignItems: "flex-start" },
    backArrow: { color: PRIMARY, fontSize: 24, fontFamily: "Jura-Bold" },
    headerTitle: {
        flex: 1, textAlign: "center", color: PRIMARY,
        fontFamily: "Jura-Bold", fontSize: 20, letterSpacing: 2,
    },
    centeredState: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
    stateText: {
        color: PRIMARY, fontFamily: "Jura-Bold", fontSize: 14,
        opacity: 0.5, textAlign: "center", paddingHorizontal: 30,
    },
    scroll: { paddingHorizontal: 16, paddingBottom: 50 },
    dateBadge: {
        alignSelf: "flex-end", color: SECONDARY, fontFamily: "Jura-Bold",
        fontSize: 12, marginTop: 14, marginBottom: 4, opacity: 0.8,
    },
    priceCard: {
        backgroundColor: CARD_BG, borderRadius: 20, padding: 18, marginTop: 8,
        borderWidth: 1, borderColor: "#1e1e1e",
    },
    priceRow: {
        flexDirection: "row", justifyContent: "space-between",
        alignItems: "flex-start", marginBottom: 14,
    },
    priceLabel: { color: "#555", fontFamily: "Jura-Bold", fontSize: 11, letterSpacing: 1 },
    priceValue: { color: PRIMARY, fontFamily: "Jura-Bold", fontSize: 32, marginTop: 2 },
    changePill: { borderRadius: 22, paddingHorizontal: 12, paddingVertical: 7, justifyContent: "center" },
    changeText: { fontFamily: "Jura-Bold", fontSize: 13 },
    ohlcRow: {
        flexDirection: "row", justifyContent: "space-between",
        borderTopWidth: 1, borderTopColor: "#1e1e1e", paddingTop: 12,
    },
    ohlcCell: { alignItems: "center", flex: 1 },
    ohlcLabel: { color: "#555", fontFamily: "Jura-Bold", fontSize: 10, letterSpacing: 1 },
    ohlcValue: { color: PRIMARY, fontFamily: "Jura-Bold", fontSize: 14, marginTop: 3 },
    gaugeWrapper: {
        backgroundColor: CARD_BG, borderRadius: 20, padding: 12,
        borderWidth: 1, borderColor: "#1e1e1e", alignItems: "center",
    },
    section: { marginTop: 22 },
    sectionTitle: {
        color: SECONDARY, fontFamily: "Jura-Bold", fontSize: 11,
        letterSpacing: 2,
    },
    summaryText: {
        color: PRIMARY, fontFamily: "Jura-Bold", fontSize: 13, lineHeight: 21,
        backgroundColor: CARD_BG, borderRadius: 16, padding: 16,
        borderWidth: 1, borderColor: "#1e1e1e",
    },
    signalsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    signalChip: {
        flexDirection: "row", alignItems: "center",
        borderRadius: 20, paddingHorizontal: 10, paddingVertical: 7, gap: 6,
    },
    signalDot: { width: 6, height: 6, borderRadius: 3 },
    signalLabel: { fontFamily: "Jura-Bold", fontSize: 11 },
    statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    statCell: {
        width: "30%", backgroundColor: CARD_BG, borderRadius: 14, padding: 11,
        alignItems: "center", borderWidth: 1, borderColor: "#1e1e1e",
    },
    statLabel: { color: "#555", fontFamily: "Jura-Bold", fontSize: 10, letterSpacing: 0.5 },
    statValue: { color: PRIMARY, fontFamily: "Jura-Bold", fontSize: 13, marginTop: 4 },
    hBarCenter: { alignItems: "center", marginHorizontal: -16 },
    logoWrapper: { alignItems: "center", marginTop: 16, marginBottom: 4 },
    stockLogo: { width: 60, height: 60, borderRadius: 16 },
    sectionTitleRow: {
        flexDirection: "row", alignItems: "center", marginBottom: 10,
    },
    infoBtn: { marginLeft: 8, padding: 2 },
    infoIcon: { color: SECONDARY, fontSize: 15, fontWeight: "700" },
    modalBackdrop: {
        flex: 1, backgroundColor: "rgba(0,0,0,0.75)",
        justifyContent: "center", alignItems: "center", padding: 24,
    },
    modalCard: {
        backgroundColor: "#141414", borderRadius: 20, padding: 20,
        borderWidth: 1, borderColor: "#2a2a2a", width: "100%", maxHeight: "75%",
    },
    modalHeader: {
        flexDirection: "row", justifyContent: "space-between",
        alignItems: "flex-start", marginBottom: 14,
    },
    modalTitle: {
        color: SECONDARY, fontFamily: "Jura-Bold", fontSize: 13,
        letterSpacing: 2, flex: 1, marginRight: 10,
    },
    modalCloseBtn: { padding: 2 },
    modalCloseText: { color: "#666", fontSize: 16, fontWeight: "700" },
    modalBody: {
        color: PRIMARY, fontFamily: "Jura-Bold", fontSize: 13,
        lineHeight: 22, opacity: 0.85,
    },
});

export default StockAnalysisExpanded;