import React, { useEffect, useState } from 'react';
import { StyleSheet, View , Text, ScrollView, TouchableOpacity, Modal} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'react-native';

import { getAuth } from '@react-native-firebase/auth';
import { getFirestore, collection, doc, addDoc, setDoc, getDocs, deleteDoc } from "@react-native-firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

const LOGO_DEV_PUBLIC_KEY = 'pk_YdgRZM9fQe647VUfPhzFAw';
const stockApiEndpoint = "https://stock-api.saifmk.online/stock/{stockname}"
const STOCKS_CACHE_KEY = 'stocks_metadata_cache';
const STOCKS_PRICES_CACHE_KEY = 'stocks_prices_cache';

    

const UserSelectedStockDisplay = () => {

    const [stockDetails, setStockDetails] = useState<{ stockName: string; stockPrice: string; StockTicker: string; }[]>([])
    const [stocks, setStocks] = useState<{ stockName: string; stockPrice: string; StockTicker: string; addedDate: string; }[]>([])
    const [emptyStock, setEmptyStock] = useState(Boolean)
    const [isLoading, setIsLoading] = useState(true)

    const [visbilityStat, setVisbilityStat] = useState(false);
    const [stockNamePopUp, setStockName] = useState<string>();
    const [stockPricePopUp, setStockPrice] = useState<string>();
    const [stockAddedDatePopUp, setStockAddedDate] = useState<string>();

    const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
    const [stockToDelete, setStockToDelete] = useState<string | null>(null);
    const [stockNameToDelete, setStockNameToDelete] = useState<string | null>(null);
    const [deletedToast, setDeletedToast] = useState(false);
    const [deleteInfoVisible, setDeleteInfoVisible] = useState(false);
    const [infoVisible, setInfoVisible] = useState(false);


    const fireBaseUser = getAuth();
    const db = getFirestore()
    const loggedinUser = fireBaseUser.currentUser?.uid;



    const loadMetadata = async (): Promise<{ stockName: string; StockTicker: string }[]> => {
        try {
            if (!loggedinUser) return [];
            const refCollectionn = collection(db, "Users", loggedinUser, "Agents", "Finance", "Stock_Added");
            const snapshot = await getDocs(refCollectionn);
            const fetchedData = snapshot.docs.map((doc: any) => doc.data());
            setStocks(fetchedData);
            if (fetchedData.length === 0) {
                setEmptyStock(true);
                await AsyncStorage.removeItem(STOCKS_CACHE_KEY);
                return [];
            }
            setEmptyStock(false);
            const metadata = fetchedData.map((s: any) => ({ stockName: s.stockName, StockTicker: s.StockTicker }));
            await AsyncStorage.setItem(STOCKS_CACHE_KEY, JSON.stringify(metadata));
            console.log("STOCKS METADATA FETCHED AND CACHED", metadata);
            return metadata;
        } catch (error) {
            console.log("ERROR LOADING METADATA", error);
            // Fall back to cache on network error
            const cached = await AsyncStorage.getItem(STOCKS_CACHE_KEY);
            return cached ? JSON.parse(cached) : [];
        }
    };

    const fetchPrices = async (metadata: { stockName: string; StockTicker: string }[]) => {
        try {
            const updated = await Promise.all(
                metadata.map(async (stock) => {
                    const res = await fetch(`https://stock-api.saifmk.online/stock/${stock.StockTicker}`);
                    const data = await res.json();
                    console.log(`PRICE FETCHED FOR ${stock.StockTicker}:`, data.stockPrice);
                    return { stockName: stock.stockName, StockTicker: stock.StockTicker, stockPrice: data.stockPrice };
                })
            );
            setStockDetails(updated);
            await AsyncStorage.setItem(STOCKS_PRICES_CACHE_KEY, JSON.stringify(updated));
        } catch (error) {
            console.log("ERROR FETCHING PRICES", error);
        }
    };

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null = null;
        let isMounted = true;

        const init = async () => {
            // Load cached prices immediately so UI renders without delay
            const cachedPrices = await AsyncStorage.getItem(STOCKS_PRICES_CACHE_KEY);
            if (isMounted) {
                if (cachedPrices) {
                    setStockDetails(JSON.parse(cachedPrices));
                }
                setIsLoading(false);
            }

            // Fetch fresh metadata and start price polling in background
            const metadata = await loadMetadata();
            if (isMounted && metadata.length > 0) {
                await fetchPrices(metadata);
                // Set interval only if component is still mounted
                interval = setInterval(() => {
                    if (isMounted) {
                        fetchPrices(metadata);
                    }
                }, 3000);
            }
        };

        init();

        // Cleanup function: runs when component unmounts
        return () => {
            isMounted = false; // Stop any pending async operations
            if (interval) {
                clearInterval(interval); // Clear the interval
            }
        };
    }, []);
        
    return (

        <SafeAreaView >

            <View style={styles.headingRow}>
                <Text style={styles.headingStyle}>YOUR STOCKS</Text>
                <TouchableOpacity onPress={() => setInfoVisible(true)} style={styles.infoButton}>
                    <Text style={styles.infoButtonText}>i</Text>
                </TouchableOpacity>
            </View>

            <Modal transparent animationType="fade" visible={infoVisible} onRequestClose={() => setInfoVisible(false)}>
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setInfoVisible(false)}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>YOUR STOCKS</Text>
                        <Text style={styles.modalBody}>Displays stocks you have added to your watchlist. This view provides realtime stock updates. Addition or deletion of a stock from the list may take a few seconds to reflect.</Text>
                        <TouchableOpacity onPress={() => setInfoVisible(false)}>
                            <Text style={styles.modalClose}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>


            <ScrollView style={styles.youStockContainerParent} horizontal={true} showsHorizontalScrollIndicator={true}>
                {isLoading ? (
                    <Text style={styles.loadingText}>Loading...</Text>
                ) : emptyStock ? (
                    <Text style={styles.emptyText}>No stocks added yet</Text>
                ) : (
                    stockDetails.map((stock, index) => (
                        <View style={styles.container} key={index}>
                            <View style={styles.yourContainerStockNameAndLogo}>
                                <Image source={{ uri: `https://img.logo.dev/ticker/${stock.StockTicker+".NS"}?token=${LOGO_DEV_PUBLIC_KEY}` }} style={{ width: 35, height: 35 , borderRadius:10 }}/>
                                <Text style={styles.yourStockContainerText}>{stock.stockName.length > 15 ? stock.stockName.slice(0, 14) + '..' : stock.stockName}</Text>
                            </View>
                            <View style={styles.yourContainerStockPriceAndPercentage}>
                                <Text style={styles.yourStockContainerText}>₹{stock.stockPrice}</Text>
                                <Text style={styles.yourStockContainerText}>+13%</Text>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>
            
        </SafeAreaView>

      
    )
}



const styles = StyleSheet.create({

    headingStyle: {
        fontSize: 18,
        fontFamily: "Jura-Bold",
        color: "#D9D9D9",
        margin:10,
    },

    headingRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    infoButton: {
        width: 15,
        height: 15,
        borderRadius: 9,
        borderWidth: 1,
        borderColor: "#50468e",
        alignItems: "center",
        justifyContent: "center",
        // marginLeft: 5,
    },

    infoButtonText: {
        color: "#50468e",
        fontSize: 11,
        fontFamily: "Jura-Bold",
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
    },

    modalBox: {
        backgroundColor: "#0f0f0f",
        borderWidth: 1,
        borderColor: "#50468e",
        borderRadius: 12,
        padding: 20,
        width: "80%",
    },

    modalTitle: {
        color: "#D9D9D9",
        fontFamily: "Jura-Bold",
        fontSize: 16,
        marginBottom: 10,
    },

    modalBody: {
        color: "#aaaaaa",
        fontFamily: "Jura-Bold",
        fontSize: 13,
        lineHeight: 20,
        marginBottom: 16,
    },

    modalClose: {
        color: "#50468e",
        fontFamily: "Jura-Bold",
        fontSize: 14,
        textAlign: "right",
    },

    youStockContainerParent: {
        display: "flex",
        flexDirection: "row",
    
    },
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        backgroundColor: "#000000",
        height: 160,    
        width: 160,
        margin: 10,
        borderRadius: 10,
        color: "#D9D9D9",
        borderWidth: 1,
        borderColor: "#50468e",
        fontFamily: "Jura-Bold",
    },

    yourContainerStockNameAndLogo: {
        display: "flex",
        flexDirection: "column",
        margin: 10,
        padding: 2,

    },
    yourContainerStockPriceAndPercentage: {
        display: "flex",
        flexDirection: "column",
        margin: 10,
        padding: 2,
    },
    yourStockContainerText: {
        color: "#D9D9D9",
        fontFamily: "Jura-Bold",
        fontSize: 16
    },
    
    loadingText: {
        color: "#D9D9D9",
        fontFamily: "Jura-Bold",
        fontSize: 16,
        margin: 10,
    },
    
    emptyText: {
        color: "#D9D9D9",
        fontFamily: "Jura-Bold",
        fontSize: 16,
        margin: 10,
    }
    
})


export default UserSelectedStockDisplay; 