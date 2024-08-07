import React from "react";
import {
	createStackNavigator,
	TransitionPresets,
} from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigation from "./AuthNavigation";
import TabNavigation from "./TabNavigation";
import { useUserStore } from "@/src/store/useUserStore";

const Stack = createStackNavigator();

const RootNavigation = () => {
	const { session } = useUserStore();
	return (
		<NavigationContainer>
			<Stack.Navigator
				screenOptions={{
					headerShown: false,
					...TransitionPresets.SlideFromRightIOS,
					animationEnabled: true,
					gestureEnabled: true,
					gestureDirection: "horizontal",
				}}
			>
				{session && session.user ? (
					<Stack.Screen name="TabNavigation" component={TabNavigation} />
				) : (
					<Stack.Screen name="AuthNavigation" component={AuthNavigation} />
				)}
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default RootNavigation;
