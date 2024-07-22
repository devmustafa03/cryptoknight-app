import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

const WelcomeScreen = () => {
	return (
		<SafeAreaView className="flex-1 justify-between items-center bg-white">
			<StatusBar style="auto" />
			<View className="w-full px-4 items-center">
				<Text className="text-neutral-500 text-3xl font-medium leading-[60px]">
					Welcome
				</Text>
			</View>
		</SafeAreaView>
	);
};

export default WelcomeScreen;
