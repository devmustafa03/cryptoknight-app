import React, { useEffect } from "react";
import { View } from "react-native";
import styled from "styled-components/native";
import { StatusBar } from "expo-status-bar";
import RootNavigation from "./src/screens/navigation/RootNavigation";
import useCachedResources from "./src/hooks/useCachedResources";
import Toast from "react-native-toast-message";
import { useUserStore } from "./src/store/useUserStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const App = () => {
	const isLoadingComplete = useCachedResources();
	const { session, user } = useUserStore();
	const queryClient = new QueryClient();

	useEffect(() => console.log(user, session), [user, session]);

	if (!isLoadingComplete) return null;
	return (
		<Container>
			<StatusBar style="auto" />
			<QueryClientProvider client={queryClient}>
			<RootNavigation />
			</QueryClientProvider>
			<Toast />
		</Container>
	);
};

export default App;

export const Container = styled(View)`
	flex: 1;
`;
