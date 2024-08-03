import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Ionicons} from "@expo/vector-icons"
import HomeNavigation from "./HomeNavigation";
import SearchNavigation from "./SearchNavigation";
import MarketNavigation from "./MarketNavigation";
import NewsNavigation from "./NewsNavigation";
import ProfileNavigation from "./ProfileNavigation";
import { TransitionPresets } from "@react-navigation/stack";

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
	return (
		<Tab.Navigator
			screenOptions={({ route }) => ({
				tabBarIcon: ({ focused, color, size = 25 }) => {
					let iconName: "ios-home" | "ios-home-outline" | "ios-search" | "ios-search-outline" | "ios-stats-chart" | "ios-stats-chart-outline" | "ios-newspaper" | "ios-newspaper-outline" | "ios-person" | "ios-person-outline" = "ios-home";
					if (route.name === "Home") {
						iconName = focused
							? "ios-home"
							: "ios-home-outline";
					} else if (route.name === "Search") {
						iconName = focused
							? "ios-search"
							: "ios-search-outline";
					} else if (route.name === "Market") {
						iconName = focused
							? "ios-stats-chart"
							: "ios-stats-chart-outline";
					} else if (route.name === "News") {
						iconName = focused
							? "ios-newspaper"
							: "ios-newspaper-outline";
					} else if (route.name === "Profile") {
						iconName = focused
							? "ios-person"
							: "ios-person-outline";
					}
					return <Ionicons name={iconName as any} size={size} color={focused ? "#F9A700": "gray"} />;
				},
				tabBarActiveTintColor: "#F9A700",
				tabBarInactiveTintColor: "gray",
				headerShown: false,
				tabBarLabelStyle: {
					fontSize: 12,
					fontWeight: "bold",
				},
				...TransitionPresets.SlideFromRightIOS,
				animationEnabled: true,
				gestureEnabled: true,
				gestureDirection: "horizontal",
			})}
		>
			<Tab.Screen name="Home" component={HomeNavigation} />
			<Tab.Screen name="Search" component={SearchNavigation} />
			<Tab.Screen name="Market" component={MarketNavigation} />
			<Tab.Screen name="News" component={NewsNavigation} />
			<Tab.Screen name="Profile" component={ProfileNavigation} />
		</Tab.Navigator>
	);
};

export default TabNavigation;
