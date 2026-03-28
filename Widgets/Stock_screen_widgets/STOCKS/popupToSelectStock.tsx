import { Modal, View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Pressable, Animated, Easing } from 'react-native';
import colors from "D:\\PROJECTS\\The-Chat-App\\Assets\\colors.js";
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore, doc, setDoc } from "@react-native-firebase/firestore";
import { useEffect, useRef, useState } from 'react';


const addStockToDb = async (pressed: any) => {
    const fireBaseUser = getAuth();
    const db = getFirestore()
    const loggedinUser = fireBaseUser.currentUser?.uid;
    const stockName = pressed.name
    console.log(pressed.name)
    console.log(pressed.price)

    if (loggedinUser) {
        try {
            await setDoc(
                doc(db, "Users", loggedinUser!, "Agents", "Finance", "Stock_Added", pressed.name),
                {
                    stockName: pressed.name,
                    stockPrice: pressed.price,
                    addedDate: new Date().toLocaleString()
                }
            );
        } catch (error) {
            console.warn(error)
        }
    }
}


// --- 3 Bouncing Dots ---
const BouncingDots = () => {
    const dot1 = useRef(new Animated.Value(0)).current;
    const dot2 = useRef(new Animated.Value(0)).current;
    const dot3 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const bounce = (dot: Animated.Value, delay: number) =>
            Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(dot, { toValue: -10, duration: 300, useNativeDriver: true, easing: Easing.out(Easing.quad) }),
                    Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true, easing: Easing.in(Easing.quad) }),
                    Animated.delay(600 - delay),
                ])
            ).start();

        bounce(dot1, 0);
        bounce(dot2, 150);
        bounce(dot3, 300);
    }, []);

    return (
        <View style={dotsStyle.wrapper}>
            {[dot1, dot2, dot3].map((dot, i) => (
                <Animated.View
                    key={i}
                    style={[dotsStyle.dot, { transform: [{ translateY: dot }] }]}
                />
            ))}
        </View>
    );
};

const dotsStyle = StyleSheet.create({
    wrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginTop: 60,
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: colors.primary,
    },
});


const Popupmessage = ({ message, buttonText1, buttonText2, visible, onClose }: { message: any, buttonText1: any, buttonText2: any, visible: any, onClose: any }) => {

    const [searched, setSearched] = useState("");
    const [searchedStockName, setSearchedStockName] = useState("");
    const [searchedStockPrice, setSearchedStockPrice] = useState<number | null>(null);
    const [isSearched, setIsSearched] = useState(Boolean)
    const [isSearching, setIsSearching] = useState(false)
    const [dataAsArray, setDataAsArray] = useState<any[]>([])
    const [activeTab, setActiveTab] = useState("most");

    const searchedStock = async (searched: string) => {
        console.log("USER SEARCHED FOR :", searched)
        setIsSearching(true)
        setSearchedStockName("")
        setSearchedStockPrice(null)
        try {
            const URL = `https://stock-api.saifmk.website/search/${encodeURIComponent(searched)}`
            const request = await fetch(URL)
            const data = await request.json()
            setSearchedStockName(data.stockName)
            setSearchedStockPrice(data.stockPrice)
            console.log("API DATA:", data.stockName, data.stockPrice);
        } catch (error) {
            console.log(error)
        } finally {
            setIsSearching(false)
        }
    }

    const mainStockApiFetching = async () => {
        const URL_MOSTACTIVE = "https://stock-api.saifmk.online/mostActive"
        const URL_GAINER = "https://stock-api.saifmk.online/gainer"
        const URL_LOOSER = "https://stock-api.saifmk.online/looser"
        let URL = ""

        if (activeTab === "most") URL = URL_MOSTACTIVE
        else if (activeTab === "gainer") URL = URL_GAINER
        else URL = URL_LOOSER

        try {
            const response = await fetch(URL);
            const jsonResponse = await response.json();
            console.log(`PRINTING THE API RESPONSE JSON FROM addStockOptionButton.tsx :`, jsonResponse);
            return jsonResponse;
        } catch (error) {
            console.log(`ERROR in mainStockApiFetching(): ${error}`);
            return error
        }
    }

    const fetchData = async (showLoader: boolean = false) => {
        if (showLoader) setDataAsArray([]);
        try {
            const data = await mainStockApiFetching();
            const trending = data?.trending_stocks;
            if (Array.isArray(trending)) {
                setDataAsArray(trending);
                console.log("STOCK LIST (Array):", trending);
            } else {
                console.warn("PROVIDED RESPONSE IS NOT AN ARRAY:", data);
            }
        } catch (error) {
            console.error("Error fetching:", error);
        }
    };

    useEffect(() => {
        if (visible) {
            fetchData(true)
        }
    }, [visible, activeTab])

    return (
        <Modal visible={visible} animationType="fade" transparent statusBarTranslucent>
            <Pressable onPress={onClose} style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)" }}>
                <View style={modalStyle.mainParent}>
                    <View style={modalStyle.parentContainer}>

                    <View style={modalStyle.innerContent}>
                        {/* Search input */}
                        <View>
                            <TextInput
                                placeholder="Enter Stock Name"
                                placeholderTextColor="#ffffff"
                                style={modalStyle.stockInputSearch}
                                value={searched}
                                onChangeText={setSearched}
                                returnKeyType="search"
                                onSubmitEditing={() => { searchedStock(searched); setIsSearched(true); }}
                            />
                        </View>

                        {isSearched ? (
                            isSearching ? (
                                <BouncingDots />
                            ) : (
                            <View style={modalStyle.searchedStockDesign}>
                                <TouchableOpacity style={modalStyle.stockNameAndPrice} onPress={() => { addStockToDb(searchedStockName) }}>
                                    <Text style={modalStyle.stockName}>{searchedStockName}: </Text>
                                    <Text style={modalStyle.stockPrice}>₹{searchedStockPrice}</Text>
                                </TouchableOpacity>
                            </View>
                            )
                        ) : (
                            <View style={{ width: '100%', alignItems: 'center' }}>
                                {/* Tab buttons */}
                                <View style={modalStyle.stockTypeNavigationParent}>
                                    {["most", "gainer", "looser"].map((tab) => (
                                        <Pressable
                                            key={tab}
                                            onPress={() => setActiveTab(tab)}
                                            style={({ pressed }) => [
                                                modalStyle.stockTypeNavigationButtons,
                                                activeTab === tab && modalStyle.stockTypeNavigationButtonsClicked,
                                                pressed && { opacity: 0.7 },
                                            ]}
                                        >
                                            <Text style={{ fontFamily: "Jura-Bold", fontSize: 14, color: activeTab === tab ? "#fff" : "#000000" }}>
                                                {tab === "most" ? "Most Active" : tab === "gainer" ? "Gainers" : "Losers"}
                                            </Text>
                                        </Pressable>
                                    ))}
                                </View>

                                {/* Bouncing dots while loading, stock list once ready */}
                                {dataAsArray.length === 0 ? (
                                    <BouncingDots />
                                ) : (
                                    <ScrollView style={modalStyle.scrollView} contentContainerStyle={modalStyle.stockListContainer}>
                                        {dataAsArray.map((stock, index) => (
                                            <View key={index}>
                                                <TouchableOpacity style={modalStyle.stockNameAndPrice} onPress={() => { addStockToDb(stock) }}>
                                                    <Text style={modalStyle.stockName}>{stock.name}: </Text>
                                                    <View style={modalStyle.stockPriceParent}>
                                                        <Text style={modalStyle.stockPrice}>₹{stock.price}</Text>
                                                        <Text style={[modalStyle.currentStockPrice, { color: Number(String(stock.current).replace(/[^\d.-]/g, "")) > 0 ? "green" : "red" }]}>
                                                            {stock.current}
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        ))}
                                    </ScrollView>
                                )}
                            </View>
                        )}
                    </View>

                        {/* Close button */}
                        <View style={modalStyle.buttonsPlacement}>
                            <TouchableOpacity style={modalStyle.buttonDesign} onPress={onClose}>
                                <Text style={modalStyle.buttonText}>{buttonText2}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Pressable>
        </Modal>
    );
};


const modalStyle = StyleSheet.create({
    fontcolor: {
        color: colors.primary,
        fontFamily: "Jura-Bold",
        fontSize: 25,
        marginLeft: 10,
        marginRight: 10,
    },
    mainParent: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.8)',
    },
    parentContainer: {
        height: 660,
        width: 350,
        backgroundColor: colors.secondary,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: "#ffff",
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    innerContent: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        overflow: 'hidden',
    },
    scrollView: {
        width: '100%',
        maxHeight: 430,
    },
    buttonDesign: {
        backgroundColor: colors.gradient_secondary,
        height: 35,
        width: 90,
        borderRadius: 15,
        margin: 15,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.primary,
    },
    stockInputSearch: {
        margin: 20,
        backgroundColor: "#000000",
        width: 250,
        borderRadius: 20,
        color: "#ffff",
        alignItems: "center",
    },
    searchedStockDesign: {
        justifyContent: "flex-start",
        alignItems: "flex-start",
    },
    stockTypeNavigationParent: {
        justifyContent: "center",
        flexDirection: "row",
        gap: 20,
        margin: 10,
        padding: 10,
        borderRadius: 15,
    },
    stockTypeNavigationButtons: {
        borderBlockColor: "#000000",
        borderRadius: 15,
        borderWidth: 2,
        padding: 5,
    },
    stockTypeNavigationButtonsClicked: {
        borderBlockColor: "#000000",
        backgroundColor: "#000000",
        borderRadius: 15,
        borderWidth: 2,
        padding: 5,
    },
    stockListContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
    },
    stockNameAndPrice: {
        backgroundColor: "#000000",
        color: "#ffffff",
        padding: 10,
        margin: 4,
        borderRadius: 20,
        width: 150,
        height: 130,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
    },
    stockName: {
        color: "#ffffff",
        padding: 2,
        margin: 4,
        fontSize: 13,
    },
    stockPriceParent: {
        display: "flex",
        flexDirection: "column",
    },
    stockPrice: {
        color: "#ffffff",
        padding: 2,
        fontSize: 15,
    },
    currentStockPrice: {
        fontWeight: '600',
        padding: 2,
        fontSize: 13,
    },
    buttonsPlacement: {
        display: "flex",
        flexDirection: "row",
    },
    buttonText: {
        color: colors.secondary,
        fontFamily: "Jura-Bold",
        fontSize: 15,
    },
});

export default Popupmessage;