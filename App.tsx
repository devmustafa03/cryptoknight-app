import React from "react";
import { View } from "react-native";
import styled from "styled-components/native";
import { StatusBar } from "expo-status-bar";
import RootNavigation from "./src/screens/navigation/RootNavigation";
import useCachedResources from "./src/hooks/useCachedResources";

const App = () => {
	const isLoadingComplete = useCachedResources();

	if (!isLoadingComplete) return null;
	return (
		<Container>
			<StatusBar style="auto" />
			<RootNavigation />
		</Container>
	);
};

export default App;

export const Container = styled(View)`
	flex: 1;
`;
