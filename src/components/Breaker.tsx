import { View, Text } from "react-native";
import React from "react";
import Animated, { FadeInDown } from "react-native-reanimated";

const Breaker = () => {
	return (
		<Animated.View
			entering={FadeInDown.duration(300).delay(400).springify()}
			className="flex-row items-center my-8"
		>
			<View className="flex-1 h-[1px] bg-gray-300" />
			<Text className="mx-4 text-gray-500">Or</Text>
			<View className="flex-1 h-[1px] bg-gray-300" />
		</Animated.View>
	);
};

export default Breaker;
