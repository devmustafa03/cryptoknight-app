import * as font from "expo-font";
import { useState, useEffect } from "react";
import { FontAwesome } from "@expo/vector-icons";
import * as SplashScreen from "expo-splash-screen";

const useCachedResources = () => {
	const [isLoadingComplete, setIsLoadingComplete] = useState(false);
	useEffect(() => {
		async function loadResourceAndDataAsync() {
			try {
				SplashScreen.preventAutoHideAsync();
				await font.loadAsync({
					PPNeueMonteal: require("../../assets/fonts/PPNeueMontreal-Book.otf"),
					PPNeueMontealMedium: require("../../assets/fonts/PPNeueMontreal-Medium.otf"),
					PPNeueMontealSemiBold: require("../../assets/fonts/PPNeueMontreal-SemiBolditalic.otf"),
					PPNeueMontealBold: require("../../assets/fonts/PPNeueMontreal-Bold.otf"),
					PPNeueMontealItalic: require("../../assets/fonts/PPNeueMontreal-Italic.otf"),
					PPNeueMontealThin: require("../../assets/fonts/PPNeueMontreal-Thin.otf"),
					...FontAwesome.font,
				});
			} catch (error) {
				alert(error);
			} finally {
				setIsLoadingComplete(true);
				SplashScreen.hideAsync();
			}
		}

		loadResourceAndDataAsync();
	}, []);

	return isLoadingComplete;
};

export default useCachedResources;
