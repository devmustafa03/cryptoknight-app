import React from "react";
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import SearchScreen from "../../tabs/search/SearchScreen";

const Stack = createStackNavigator();

const SearchNavigation = () => {
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
			<Stack.Screen name="SearchS" component={SearchScreen} />
		</Stack.Navigator>
	);
};

export default SearchNavigation;
