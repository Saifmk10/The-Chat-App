import { useState } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import BackButton from "../../Assets/images/stockAgentScreen/backbutton";
import ToggleButtons from "../../Widgets/Stock_screen_widgets/toggleButtons";

import MainStockPrice from "../../Widgets/Stock_screen_widgets/STOCKS/addStockOptionButton";
import AddedStocksList from "../../Widgets/Stock_screen_widgets/STOCKS/addedStocksList";

import IntraDayBot from "../../Widgets/Stock_screen_widgets/BOT/intraDayBot";
import StockWindowSelector from "../../Widgets/Stock_screen_widgets/DASHBOARD/StockWindowSelector";

const StockAgentOperationsScreen = () => {
  const navigation = useNavigation<any>();

  const [checker, setCheckerTo] = useState<"DASHBOARD" | "STOCKS" | "BOT">(
    "DASHBOARD"
  );

  // FIXED TYPO (this was actually causing one of the UI shifts)
  const [windowChecker, setWindowCheker] = useState("intraday");

  return (
    <SafeAreaView style={style.root}>
      {/* HEADER */}
      <View style={style.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackButton />
        </TouchableOpacity>

        <View style={style.headingParent}>
          <Text style={style.heading}>AGENT</Text>
        </View>

        {/* spacer to keep title centered */}
        <View style={{ width: 40 }} />
      </View>

      {/* TOGGLE BUTTONS */}
      <View style={style.toggleContainer}>
        <ToggleButtons checker={checker} setCheckerTo={setCheckerTo} />
      </View>

      {/* CONTENT AREA */}
      <View style={style.contentArea}>
        {checker === "DASHBOARD" && (
          <StockWindowSelector
            windowChecker={windowChecker}
            setWindowCheker={setWindowCheker}
          />
        )}

        {checker === "STOCKS" && (
          <View style={style.stocksContainer}>
            <View style={style.stockAdditionSection}>
              <MainStockPrice />
            </View>

            <View style={style.stockRenderingSection}>
              <AddedStocksList />
            </View>
          </View>
        )}

        {checker === "BOT" && (
          <View style={style.botContainer}>
            <IntraDayBot />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000",
  },

  /* HEADER */
  header: {
    paddingTop: 40,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#D9D9D9",
    paddingBottom: 10,
  },

  headingParent: {
    flex: 1,
    alignItems: "center",
  },

  heading: {
    color: "#D9D9D9",
    fontFamily: "Jura-Bold",
    fontSize: 25,
  },

  /* TOGGLE */
  toggleContainer: {
    paddingTop: 20,
    paddingHorizontal: 15,
  },

  /* MAIN CONTENT AREA */
  contentArea: {
    flex: 1,
    width: "100%",
    marginTop : 10
  },

  /* DASHBOARD handled inside StockWindowSelector */

  /* STOCKS SCREEN */
  stocksContainer: {
    flex: 1,
    marginTop: 20,
  },

  stockAdditionSection: {
    alignItems: "center",
    marginBottom: 10,
  },

  stockRenderingSection: {
    flex: 1,
    paddingHorizontal: 20,
  },

  /* BOT SCREEN */
  botContainer: {
    flex: 1,
    paddingTop: 20,
  },
});

export default StockAgentOperationsScreen;
