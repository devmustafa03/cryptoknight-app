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
					let iconName: "home" | "home-outline" | "search-outline" | "search" | "stats-chart" | "stats-chart-outline" | "newspaper" | "newspaper-outline" | "man" | "man-outline" = "home";
					if (route.name === "Home") {
						iconName = focused
							? "home"
							: "home-outline";
					} else if (route.name === "Search") {
						iconName = focused
							? "search"
							: "search-outline";
					} else if (route.name === "Market") {
						iconName = focused
							? "stats-chart"
							: "stats-chart-outline";
					} else if (route.name === "News") {
						iconName = focused
							? "newspaper"
							: "newspaper-outline";
					} else if (route.name === "Profile") {
						iconName = focused
							? "man"
							: "man-outline";
					}
					return <Ionicons name={iconName as any} size={size} color={focused ? "#F9A700": "gray"} />;
				},
				tabBarActiveTintColor: "#F9A700",
				tabBarInactiveTintColor: "gray",
				headerShown: false,
				tabBarLabelStyle: {
					fontSize: 12,
					fontWeight: "bold",
					marginBottom: 4,
					marginTop: -5,
					paddingTop: 4,
					height: 25,
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
