import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { useColorScheme } from "nativewind";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInRight } from "react-native-reanimated";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";

const SplashScreen = () => {
	const { colorScheme, toggleColorScheme } = useColorScheme();
	const { navigate }: NavigationProp<SplashScreenNavigationType> =
		useNavigation();

	const blurhash =
		"|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

	useEffect(() => {
		const timer = setTimeout(() => {
			navigate("Welcome");
		}, 3000);

		return () => clearTimeout(timer);
	}, []);
	return (
		<SafeAreaView className="flex-1 justify-center items-center bg-white">
			<StatusBar style="auto" />

			<View className="w-full px-4 items-center">
				<Animated.View
					className="flex-row justify-center items-center"
					entering={FadeInRight.duration(100).springify()}
				>
					<View className="w-20 h-20 overflow-hidden">
						<Image
							source={require("../../../assets/images/icon.png")}
							placeholder={blurhash}
							contentFit="cover"
							transition={1000}
							className="w-full h-full flex-1"
						/>
					</View>
				</Animated.View>
				<Animated.View
					className="flex-row justify-center items-center"
					entering={FadeInRight.duration(200).springify()}
				>
					<Text
						className="text-neutral-600 text-xl leading-[60px] pl-1"
						style={{
							fontFamily: "PPNeueMonteal",
						}}
					>
						Crypto
						<Text
							className="text-[#F9A700]"
							style={{
								fontFamily: "PPNeueMonteal",
							}}
						>
							Night
						</Text>
					</Text>
				</Animated.View>
			</View>
		</SafeAreaView>
	);
};

export default SplashScreen;
