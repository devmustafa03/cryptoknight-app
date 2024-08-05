import { View, Text, Pressable, ActivityIndicator } from "react-native";
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Avatar from "@/src/components/Avatar";
import useSupabaseAuth from "@/src/hooks/useSupabaseAuth";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useUserStore } from "@/src/store/useUserStore";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useQuery } from "@tanstack/react-query";
import { FetchAllCoins } from "@/src/utils/cryptoapi";
import Animated, { FadeInDown } from "react-native-reanimated";
import numeral from "numeral";
import { FlatList, ScrollView } from "react-native-gesture-handler";

interface Coin {
	uuid: string
	name: string;
	symbol: string;
	iconUrl: string;
	price: string;
	change: number;
	marketCap: string;
}

const blurhash =
		"|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const HomeScreen = () => {
	const [loading, setLoading] = useState(false);
	const { getUserProfile } = useSupabaseAuth();
	const { session } = useUserStore();
	const { avatarUrl, username, setAvatarUrl, setUsername } = useUserStore();

  const { data: CoinData, isLoading: IsAllCoinLoading } = useQuery({
    queryKey: ["allCoins"],
    queryFn: FetchAllCoins,
    retry: 1,
  });

	const navigateHome = useNavigation().navigate as any;

	const handleGetProfile = async () => {
		setLoading(true);
		try {
			const { data, error, status } = await getUserProfile();
			setLoading(false);
			if (error && status !== 406) {
				setLoading(false);
				throw error;
			}

			if (data) {
				setAvatarUrl(data.avatar_url);
				setUsername(data.username);
			}
		} catch (error) {
			throw error;
		} finally {
			setLoading(false);
		}
	}

	useFocusEffect(
		useCallback(() => {
			if(session) {
				handleGetProfile();
			}
		}, [session])
	)

	const renderItem = ({item, index}: {item: Coin, index: number}) => {
		return (
			<Pressable className="flex-row w-full py-4 items-center" onPress={() => navigateHome("CoinDetails", { coinUUID: item.uuid })}>
			<Animated.View
				entering={FadeInDown.duration(100).delay(index*100).springify()}
				className="w-full flex-row items-center"
				>
					<View className="w-[16%]">
						<View>
							<View className="w-10 h-10">
								<Image
									source={{ uri: item.iconUrl }}
									placeholder={blurhash}
									contentFit="cover"
									transition={1000}
									className="w-full h-full flex-1"
									/>
							</View>
						</View>
					</View>
					<View className="w-[55%] justify-start items-start">
						<Text className="font-bold text-lg">{item?.name}</Text>

						<View className="flex-row items-center space-x-2">
							<Text className="text-medium text-sm text-neutral-700">{numeral(item?.price).format('$0,0.00')}</Text>

							<Text className={`font-medium text-sm ${item?.change > 0 ? "text-green-500" : "text-red-500"}`}>
								{item.change}%
							</Text>
						</View>
					</View>
					<View className="w-[29%] justify-end items-end">
						<Text className="font-bold text-base">{item.symbol}</Text>

						<View className="flex-row items-center justify-center space-x-2">
							<Text className="font-medium text-sm text-neutral-500">
								{item.marketCap.length > 9 ? item.marketCap.slice(0, 9) : item.marketCap}
							</Text>
						</View>
					</View>
				</Animated.View>
		</Pressable>
		)
	};

	return (
		<SafeAreaView className="flex-1 bg-white">
			<View className="relative">
				{/* Header */}
				<View className="w-full flex-row justify-between items-center px-4 my-4">
					<View className="w-3/4 flex-row space-x-2">
						<View className="justify-center items-center">
							<View className="w-12 h-12 overflow-hidden rounded-2xl">
								<Avatar size={50} url={avatarUrl} onUpload={handleGetProfile} />
							</View>
						</View>
						<View>
						<Text className="text-lg font-bold">
							Hi, {username ? username : "User"}
						</Text>
						<Text className="text-sm text-neutral-500">
							Have a good day
						</Text>
						</View>
						<View>

						</View>
					</View>
				</View>

				{/* Content */}
				{/* <View className="mx-4 bg-neutral-800 rounded-3xl overflow-hidden my-4">
					<View className="bg-orange-500 justify-center items-center py-6 rounded-3xl">
						<Text className="text-sm font-medium text-neutral-700">
							Total Balance
						</Text>

						<Text className="text-3xl font-bold text-neutral-700">
							$2,430.00
						</Text>
					</View>

					<View className="justify-center items-center flex-row py-4">
						<View className="w-1/4 justify-center items-center space-y-2">
							<View className="bg-neutral-400 w-10 h-10 overflow-hidden rounded-full p-2">
								<Image
									source={require("../../../../assets/images/money-send.png")}
									placeholder={blurhash}
									contentFit="cover"
									transition={1000}
									className="w-full h-full flex-1"
								/>
							</View>
						<Text className="text-white">Send To</Text>
						</View>
						<View className="w-1/4 justify-center items-center space-y-2">
							<View className="bg-neutral-400 w-10 h-10 overflow-hidden rounded-full p-2">
								<Image
									source={require("../../../../assets/images/money-receive.png")}
									placeholder={blurhash}
									contentFit="cover"
									transition={1000}
									className="w-full h-full flex-1"
								/>
							</View>
						<Text className="text-white">Request</Text>
						</View>
						<View className="w-1/4 justify-center items-center space-y-2">
							<View className="bg-neutral-400 w-10 h-10 overflow-hidden rounded-full p-2">
								<Image
									source={require("../../../../assets/images/card-add.png")}
									placeholder={blurhash}
									contentFit="cover"
									transition={1000}
									className="w-full h-full flex-1"
								/>
							</View>
						<Text className="text-white">Top Up</Text>
						</View>
						<View className="w-1/4 justify-center items-center space-y-2">
							<View className="bg-neutral-400 w-10 h-10 overflow-hidden rounded-full p-2">
								<Image
									source={require("../../../../assets/images/more.png")}
									placeholder={blurhash}
									contentFit="cover"
									transition={1000}
									className="w-full h-full flex-1"
								/>
							</View>
						<Text className="text-white">More</Text>
						</View>
					</View>
				</View> */}

				{/* Coins */}
				<ScrollView
					contentContainerStyle={{
						paddingBottom: 100,
					}}
					showsVerticalScrollIndicator={false}
					>
						<View className="px-4 pb-8 items-center">
							{IsAllCoinLoading ? (
								<ActivityIndicator size="large" color="orange" />
							): (
								<FlatList
									nestedScrollEnabled={true}
									scrollEnabled={false}
									data={CoinData.data.coins}
									keyExtractor={(item) => item.uuid}
									renderItem={renderItem}
									showsVerticalScrollIndicator={false}
									/>
							)}
						</View>
					</ScrollView>
			</View>
		</SafeAreaView>
	);
};

export default HomeScreen;
