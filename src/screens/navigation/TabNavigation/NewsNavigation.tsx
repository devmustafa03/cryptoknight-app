import React from "react";
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import MarketScreen from "../../tabs/market/MarketScreen";
import NewsScreen from "../../tabs/news/NewsScreen";

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
		</Stack.Navigator>
	);
};

export default NewsNavigation;
