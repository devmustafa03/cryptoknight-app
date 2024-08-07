import React from "react";
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import ProfileScreen from "../../tabs/profile/ProfileScreen";
import EditProfileScreen from "../../tabs/profile/EditProfileScreen";

const Stack = createStackNavigator();

const ProfileNavigation = () => {
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
			<Stack.Screen name="ProfileS" component={ProfileScreen} />
			<Stack.Screen name="EditProfileS" component={EditProfileScreen} />
		</Stack.Navigator>
	);
};

export default ProfileNavigation;
