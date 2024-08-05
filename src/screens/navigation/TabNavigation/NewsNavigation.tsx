import React from "react";
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import MarketScreen from "../../tabs/market/MarketScreen";
import NewsScreen from "../../tabs/news/NewsScreen";
import NewsDetailsScreen from "../../stacks/NewsDetailsScreen";

const Stack = createStackNavigator();

const NewsNavigation = () => {
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
			<Stack.Screen name="NewsS" component={NewsScreen} />
			<Stack.Screen name="NewsDetails" component={NewsDetailsScreen} />
		</Stack.Navigator>
	);
};

export default NewsNavigation;
