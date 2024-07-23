import React from "react";
import { View } from "react-native";
import styled from "styled-components/native";
import { StatusBar } from "expo-status-bar";
import RootNavigation from "./src/screens/navigation/RootNavigation";
import useCachedResources from "./src/hooks/useCachedResources";
import Toast from "react-native-toast-message";

const App = () => {
	const isLoadingComplete = useCachedResources();

	if (!isLoadingComplete) return null;
	return (
		<Container>
			<StatusBar style="auto" />
			<RootNavigation />
			<Toast />
		</Container>
	);
};

export default App;

export const Container = styled(View)`
	flex: 1;
`;
