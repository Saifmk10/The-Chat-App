// WeeklyAnalysisExpanded is a file that expands to a page to show detailed weekly analysis for a specific stock. It fetches the weekly data for the given stock and date from Firestore, and displays various charts, metrics, and insights to help users understand the stock's weekly performance and make informed trading decisions. The page includes a buy/sell pressure bar, a volume conviction gauge, a metrics overview bar chart, and a sentiment vs liquidity horizontal bar, along with detailed explanations for each section accessible via info buttons.

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
import { HorizontalBarChart } from "../../../Assets/graphs";

const db = getFirestore();
const { width: screenWidth } = Dimensions.get("window");

// --- Types ---

type WeeklyStockDetail = {
    name: string;
    closing_sentiment_bias: number;
    consolidation_squeeze_alert: string;
    liquidity_absorption_rate: number;
    net_weekly_return: number;
    volatility_expansion_ratio: number;
    volume_conviction_score: number;
};

type WeeklyDocument = {
    DATA: {
        date: string;
        stocks: {
            stock: string;
            report: {
                closing_sentiment_bias: number;
                consolidation_squeeze_alert: string;
                liquidity_absorption_rate: number;
                net_weekly_return: number;
                volatility_expansion_ratio: number;
                volume_conviction_score: number;
            };
        }[];
        time: string;
    };
    last_added: string;
};

export type WeeklyAnalysisExpandedParams = {
    WeeklyAnalysisExpanded: {
        stockName: string;
        date: string;
    };
};

// --- Helpers ---

const safeFixed = (val: number, digits = 4): string => {
    if (!isFinite(val) || isNaN(val)) return "—";
    return val.toFixed(digits);
};

const safeNum = (val: number): number => {
    if (!isFinite(val) || isNaN(val)) return 0;
    return val;
};

const buy_sell_progress_cal = (
    stock: WeeklyStockDetail
): { buyPct: number; sellPct: number } => {
    const sentimentScore = Math.max(0, Math.min(1, safeNum(stock.closing_sentiment_bias)));
    const liquidityScore = Math.max(0, Math.min(1, safeNum(stock.liquidity_absorption_rate)));
    const returnScore = safeNum(stock.net_weekly_return) >= 0 ? 1 : 0;

    // Weighted: sentiment 40%, liquidity 30%, return direction 30%
    const buyRatio = sentimentScore * 0.4 + liquidityScore * 0.3 + returnScore * 0.3;
    const buyPct = Math.round(buyRatio * 100);
    return { buyPct, sellPct: 100 - buyPct };
};

// --- Info content ---

const SECTION_INFO: Record<string, { title: string; body: string }> = {
    BUY_SELL: {
        title: "Buy / Sell Pressure",
        body:
            "A single progress bar showing the estimated Buy vs Sell pressure for the week.\n\n" +
            "Calculated from three weekly metrics:\n" +
            "• Closing Sentiment Bias (40% weight) — where the stock closed within its weekly range.\n" +
            "• Liquidity Absorption Rate (30% weight) — how effectively buyers absorbed selling.\n" +
            "• Net Weekly Return direction (30% weight) — positive return adds buy pressure.\n\n" +
            "\ud83d\udfe2 Green portion \u2192 Buy pressure percentage.\n" +
            "\ud83d\udd34 Red portion \u2192 Sell pressure percentage.\n\n" +
            "\u2705 Buy > 60% \u2192 Bullish bias. Consider continuation or entry setups.\n" +
            "\u274c Sell > 60% \u2192 Bearish bias. Exercise caution on longs.",
    },
    VOLUME_CONVICTION: {
        title: "Volume Conviction Score",
        body:
            "Measures how strongly volume confirmed the week's price direction.\n\n" +
            "📈 Above 0.8 → Strong conviction — volume backed up the move. High-quality signal.\n" +
            "⚠️  0.5 – 0.8 → Moderate conviction — partial volume support.\n" +
            "📉 Below 0.5 → Weak conviction — price moved without volume backing. Suspect move.\n\n" +
            "Use this to filter out noise. A large weekly return with a low conviction score may be a trap.",
    },
    WEEKLY_RETURN: {
        title: "Net Weekly Return",
        body:
            "The percentage price change from Monday open to Friday close for this stock.\n\n" +
            "✅ Positive → Stock gained over the week. Context matters — was it volume-backed?\n" +
            "❌ Negative → Stock lost over the week. Check if sentiment bias confirms the weakness.\n\n" +
            "Always pair this with the Volume Conviction Score. A +10% return on 0.3 conviction is far less reliable than a +4% return on 0.9 conviction.",
    },
    SENTIMENT_BIAS: {
        title: "Closing Sentiment Bias",
        body:
            "Measures where the stock closed relative to its weekly range — a proxy for buyer vs seller dominance at week-end.\n\n" +
            "• 1.0 → Closed at the absolute high of the week — maximum bullish bias.\n" +
            "• 0.5 → Closed at the midpoint — neutral.\n" +
            "• 0.0 → Closed at the absolute low — maximum bearish bias.\n\n" +
            "✅ Look for: High weekly return + high sentiment bias = sustained buying. Strong setup for continuation.\n" +
            "❌ Watch out for: Positive return with low bias (0.2 or below) — late-week selling pressure eroded gains.",
    },
    LIQUIDITY: {
        title: "Liquidity Absorption Rate",
        body:
            "Indicates how efficiently buyers absorbed selling pressure throughout the week.\n\n" +
            "• High (0.7+) → Buyers soaked up most sell orders. Accumulation phase likely.\n" +
            "• Medium (0.4–0.7) → Mixed absorption. No clear dominant force.\n" +
            "• Low (below 0.4) → Sellers were dominant — supply overwhelmed demand.\n\n" +
            "Combine with Sentiment Bias: High absorption + high bias = institutional accumulation. Strong bullish setup.",
    },
    VOLATILITY: {
        title: "Volatility Expansion Ratio",
        body:
            "Compares this week's price range to the prior week's range.\n\n" +
            "• Above 1.0 → Range expanded — more volatile week than the prior one.\n" +
            "• Below 1.0 → Range contracted — quieter, tighter week.\n" +
            "• Infinity / — → No prior week range to compare (first data point or zero prior range).\n\n" +
            "High expansion after a breakout = confirmation. High expansion after a sharp drop = increased risk.\n" +
            "Low expansion after a trend = consolidation forming. Watch for a squeeze breakout.",
    },
    SQUEEZE: {
        title: "Consolidation Squeeze Alert",
        body:
            "Detects when a stock is in a tight consolidation range — a coiling pattern that often precedes a sharp breakout.\n\n" +
            "🟡 Active → Stock is coiling. A breakout (up or down) may be imminent. Watch closely.\n" +
            "⚪ None → No squeeze detected. Normal trending or ranging behaviour.\n\n" +
            "Best used with: Volume Conviction Score and Sentiment Bias to determine which direction the breakout is likely to resolve.",
    },
    METRICS_CHART: {
        title: "Weekly Metrics Overview",
        body:
            "A bar chart comparing all key weekly metrics side by side.\n\n" +
            "• Net Return → Weekly price performance (%).\n" +
            "• Vol Conviction → Volume quality score.\n" +
            "• Sentiment → Where the close landed in the weekly range.\n" +
            "• Liquidity → Buyer absorption strength.\n\n" +
            "Use this to quickly spot imbalances — e.g. strong return but weak sentiment and liquidity may indicate an unsustainable move.",
    },
    RATIO_CHART: {
        title: "Sentiment vs Liquidity",
        body:
            "A horizontal bar comparing closing sentiment bias against liquidity absorption rate.\n\n" +
            "Both metrics sit on a 0–1 scale.\n\n" +
            "✅ Both high (0.6+) → Buyers were in full control — clean bullish week.\n" +
            "⚠️  Mixed → One factor supported, one didn't. Requires caution.\n" +
            "❌ Both low → Bears dominated throughout — avoid long entries.",
    },
};

// --- Component ---

const WeeklyAnalysisExpanded = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<RouteProp<WeeklyAnalysisExpandedParams, "WeeklyAnalysisExpanded">>();
    const { stockName, date } = route.params;

    const [stock, setStock] = useState<WeeklyStockDetail | null>(null);
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
                    "Stock_Data", "WeeklyStockData",
                    "Data", date
                );

                const snapshot = await getDoc(ref);
                if (!snapshot.exists()) { setError(true); setLoading(false); return; }

                const data = snapshot.data() as WeeklyDocument;
                const entry = data.DATA.stocks.find((s) => s.stock === stockName);
                if (!entry) { setError(true); setLoading(false); return; }

                setStock({
                    name: entry.stock,
                    closing_sentiment_bias: entry.report.closing_sentiment_bias,
                    consolidation_squeeze_alert: entry.report.consolidation_squeeze_alert,
                    liquidity_absorption_rate: entry.report.liquidity_absorption_rate,
                    net_weekly_return: entry.report.net_weekly_return,
                    volatility_expansion_ratio: entry.report.volatility_expansion_ratio,
                    volume_conviction_score: entry.report.volume_conviction_score,
                });
            } catch (e) {
                console.log("WeeklyAnalysisExpanded fetch error:", e);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchStock();
    }, [stockName, date]);

    const isPositive = (stock?.net_weekly_return ?? 0) >= 0;
    const squeezeActive = stock?.consolidation_squeeze_alert === "Yes";

    // Volume conviction gauge: cap display at 2 for the gauge max
    const vcScore = stock?.volume_conviction_score ?? 0;
    const vcColor = vcScore >= 0.8 ? "#43fb00" : vcScore >= 0.5 ? "#ffd700" : "#ff4d4d";

    // Bar chart: all numeric weekly metrics (excluding non-finite)
    const metricsBarData = stock
        ? [
            { name: "Net Return", value: safeNum(stock.net_weekly_return) },
            { name: "Vol Conv", value: safeNum(stock.volume_conviction_score) },
            { name: "Sentiment", value: safeNum(stock.closing_sentiment_bias) },
            { name: "Liquidity", value: safeNum(stock.liquidity_absorption_rate) },
        ]
        : [];

    // Horizontal bar: sentiment vs liquidity (both 0–1)
    const ratioBarData = stock
        ? [
            { name: "Sentiment Bias", value: safeNum(stock.closing_sentiment_bias) },
            { name: "Liquidity Absorption", value: safeNum(stock.liquidity_absorption_rate) },
        ]
        : [];

    return (
        <SafeAreaView style={s.root}>
            <View style={s.header}>
                <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
                    <Text style={s.backArrow}>←</Text>
                </TouchableOpacity>
                <Text style={s.headerTitle} numberOfLines={1}>{stockName}</Text>
                <Image
                    source={{ uri: `https://img.logo.dev/ticker/${stockName}.NS?token=${LOGO_DEV_PUBLIC_KEY}` }}
                    style={{ width: 35, height: 35, borderRadius: 10 }}
                />
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
                        <Image
                            source={{ uri: `https://img.logo.dev/ticker/${stockName}.NS?token=${LOGO_DEV_PUBLIC_KEY}` }}
                            style={s.stockLogo}
                        />
                    </View>

                    {/* Weekly Return Card */}
                    <View style={s.returnCard}>
                        <View style={s.returnRow}>
                            <View>
                                <Text style={s.returnLabel}>NET WEEKLY RETURN</Text>
                                <Text style={[s.returnValue, { color: isPositive ? "#43fb00" : "#ff4d4d" }]}>
                                    {isPositive ? "+" : ""}{safeFixed(stock.net_weekly_return, 2)}%
                                </Text>
                            </View>
                            <View style={[s.squeezePill, {
                                backgroundColor: squeezeActive ? "#2a2200" : "#1a1a1a",
                            }]}>
                                <View style={[s.squeezeDot, { backgroundColor: squeezeActive ? "#ffd700" : "#333" }]} />
                                <Text style={[s.squeezePillText, { color: squeezeActive ? "#ffd700" : "#444" }]}>
                                    {squeezeActive ? "Squeeze Active" : "No Squeeze"}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Buy / Sell Progress Bar */}
                    {(() => {
                        const { buyPct, sellPct } = buy_sell_progress_cal(stock);
                        return (
                            <View style={s.section}>
                                <View style={s.sectionTitleRow}>
                                    <Text style={s.sectionTitle}>BUY / SELL PRESSURE</Text>
                                    <TouchableOpacity onPress={() => showInfo("BUY_SELL")} style={s.infoBtn}>
                                        <Text style={s.infoIcon}>ⓘ</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={s.bsBarOuter}>
                                    <View style={[s.bsBarBuy, { flex: buyPct }]}>
                                        {buyPct > 0 && (
                                            <Text style={s.bsBarBuyText}>BUY {buyPct}%</Text>
                                        )}
                                    </View>
                                    <View style={[s.bsBarSell, { flex: sellPct }]}>
                                        {sellPct > 0 && (
                                            <Text style={s.bsBarSellText}>SELL {sellPct}%</Text>
                                        )}
                                    </View>
                                </View>
                            </View>
                        );
                    })()}

                    {/* Volume Conviction Gauge */}
                    <View style={s.section}>
                        <View style={s.sectionTitleRow}>
                            <Text style={s.sectionTitle}>VOLUME CONVICTION SCORE</Text>
                            <TouchableOpacity onPress={() => showInfo("VOLUME_CONVICTION")} style={s.infoBtn}>
                                <Text style={s.infoIcon}>ⓘ</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={s.gaugeWrapper}>
                            <GaugeChart
                                value={safeNum(vcScore)}
                                maxValue={2}
                                colors={[vcColor, vcColor]}
                                size={260}
                            />
                        </View>
                    </View>

                    {/* Weekly Return + Metrics Bar Chart */}
                    <View style={s.section}>
                        <View style={s.sectionTitleRow}>
                            <Text style={s.sectionTitle}>WEEKLY METRICS OVERVIEW</Text>
                            <TouchableOpacity onPress={() => showInfo("METRICS_CHART")} style={s.infoBtn}>
                                <Text style={s.infoIcon}>ⓘ</Text>
                            </TouchableOpacity>
                        </View>
                        <BarChart
                            data={metricsBarData}
                            height={200}
                            colorScheme="purple"
                            showLegend={false}
                        />
                    </View>

                    {/* Sentiment vs Liquidity Horizontal Bar */}
                    <View style={s.section}>
                        <View style={s.sectionTitleRow}>
                            <Text style={s.sectionTitle}>SENTIMENT VS LIQUIDITY</Text>
                            <TouchableOpacity onPress={() => showInfo("RATIO_CHART")} style={s.infoBtn}>
                                <Text style={s.infoIcon}>ⓘ</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={s.hBarCenter}>
                            <HorizontalBarChart
                                data={ratioBarData}
                                colors={["#5F48F5"]}
                                width={screenWidth - 48}
                            />
                        </View>
                    </View>

                    {/* Full Stats Grid */}
                    <View style={s.section}>
                        <View style={s.sectionTitleRow}>
                            <Text style={s.sectionTitle}>FULL STATISTICS</Text>
                        </View>
                        <View style={s.statsGrid}>
                            {[
                                { label: "Net Return", value: `${safeFixed(stock.net_weekly_return, 4)}%`, infoKey: "WEEKLY_RETURN" as const },
                                { label: "Vol Conviction", value: safeFixed(stock.volume_conviction_score), infoKey: "VOLUME_CONVICTION" as const },
                                { label: "Sentiment Bias", value: safeFixed(stock.closing_sentiment_bias), infoKey: "SENTIMENT_BIAS" as const },
                                { label: "Liquidity Abs.", value: safeFixed(stock.liquidity_absorption_rate), infoKey: "LIQUIDITY" as const },
                                { label: "Volatility Ratio", value: safeFixed(stock.volatility_expansion_ratio), infoKey: "VOLATILITY" as const },
                                { label: "Squeeze", value: stock.consolidation_squeeze_alert, infoKey: "SQUEEZE" as const },
                            ].map(({ label, value, infoKey }) => (
                                <TouchableOpacity key={label} style={s.statCell} onPress={() => showInfo(infoKey)}>
                                    <Text style={s.statLabel}>{label}</Text>
                                    <Text style={[
                                        s.statValue,
                                        value === "Yes" ? { color: "#ffd700" } :
                                        value === "No" ? { color: "#555" } : {},
                                    ]}>{value}</Text>
                                    <Text style={s.statInfoHint}>ⓘ</Text>
                                </TouchableOpacity>
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
    logoWrapper: { alignItems: "center", marginTop: 16, marginBottom: 4 },
    stockLogo: { width: 60, height: 60, borderRadius: 16 },
    returnCard: {
        backgroundColor: CARD_BG, borderRadius: 20, padding: 18, marginTop: 8,
        borderWidth: 1, borderColor: "#1e1e1e",
    },
    returnRow: {
        flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    },
    returnLabel: { color: "#555", fontFamily: "Jura-Bold", fontSize: 11, letterSpacing: 1 },
    returnValue: { fontFamily: "Jura-Bold", fontSize: 32, marginTop: 4 },
    squeezePill: {
        flexDirection: "row", alignItems: "center", gap: 6,
        borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7,
    },
    squeezeDot: { width: 6, height: 6, borderRadius: 3 },
    squeezePillText: { fontFamily: "Jura-Bold", fontSize: 12 },
    gaugeWrapper: {
        backgroundColor: CARD_BG, borderRadius: 20, padding: 12,
        borderWidth: 1, borderColor: "#1e1e1e", alignItems: "center",
    },
    section: { marginTop: 22 },
    sectionTitle: {
        color: SECONDARY, fontFamily: "Jura-Bold", fontSize: 11, letterSpacing: 2,
    },
    sectionTitleRow: {
        flexDirection: "row", alignItems: "center", marginBottom: 10,
    },
    infoBtn: { marginLeft: 8, padding: 2 },
    infoIcon: { color: SECONDARY, fontSize: 15, fontWeight: "700" },
    hBarCenter: { alignItems: "center", marginHorizontal: -16 },
    bsBarOuter: {
        flexDirection: "row", height: 38, borderRadius: 12, overflow: "hidden",
        backgroundColor: CARD_BG, borderWidth: 1, borderColor: "#1e1e1e",
    },
    bsBarBuy: {
        backgroundColor: "#0d2e0d", justifyContent: "center", alignItems: "center",
    },
    bsBarSell: {
        backgroundColor: "#2e0d0d", justifyContent: "center", alignItems: "center",
    },
    bsBarBuyText: {
        color: "#43fb00", fontFamily: "Jura-Bold", fontSize: 12, letterSpacing: 1,
    },
    bsBarSellText: {
        color: "#ff4d4d", fontFamily: "Jura-Bold", fontSize: 12, letterSpacing: 1,
    },
    statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    statCell: {
        width: "30%", backgroundColor: CARD_BG, borderRadius: 14, padding: 11,
        alignItems: "center", borderWidth: 1, borderColor: "#1e1e1e",
    },
    statLabel: { color: "#555", fontFamily: "Jura-Bold", fontSize: 10, letterSpacing: 0.5 },
    statValue: { color: PRIMARY, fontFamily: "Jura-Bold", fontSize: 13, marginTop: 4 },
    statInfoHint: { color: SECONDARY, fontSize: 10, marginTop: 4, opacity: 0.6 },
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

export default WeeklyAnalysisExpanded;
