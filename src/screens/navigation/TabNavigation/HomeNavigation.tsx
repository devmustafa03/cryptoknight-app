import React from "react";
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import HomeScreen from "../../tabs/home/HomeScreen";
import CoinDetailsScreen from "../../stacks/CoinDetailsScreen";

const Stack = createStackNavigator();

const HomeNavigation = () => {
	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: false,
				...TransitionPresets.SlideFromRightIOS,
				animationEnabled: true,
				gestureEnabled: true,
				gestureDirection: "horizontal",
			}}
		>
			<Stack.Screen name="Home" component={HomeScreen} />
			<Stack.Screen name="CoinDetails" component={CoinDetailsScreen} />
		</Stack.Navigator>
	);
};

export default HomeNavigation;
