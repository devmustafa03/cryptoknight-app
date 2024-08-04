import { View, Text, Pressable, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
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

const MarketScreen = () => {
  const [topGainers, setTopGainers] = useState<Coin[]>([]);
  const [topLosers, setTopLosers] = useState<Coin[]>([]);
  const [active, setActive] = useState("all");

  const allCoins = () => {
    setActive("all");
  };

  const calculateTopGainers = () => {
    setActive("gainers");

    const gainers = CoinData?.data?.coins.filter(
      (coin: any) => parseFloat(coin?.change) > 0
    );

    setTopGainers(gainers);
  }

  const calculateTopLosers = () => {
    setActive("losers");

    const losers = CoinData?.data?.coins.filter(
      (coin: any) => parseFloat(coin?.change) < 0
    );

    setTopLosers(losers);
  };

	const {data: CoinData, isLoading: IsAllCoinLoading} = useQuery({
		queryKey: ["allCoins"],
		queryFn: FetchAllCoins,
		retry: 1,
	});

	const renderItem = ({item, index}: {item: Coin, index: number}) => {
		return (
			<Pressable className="flex-row w-full py-4 items-center">
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
				<View className="w-full flex-row justify-between items-center px-4">
					<View className="w-3/4 flex-row space-x-2">
						<View>
              <Text className="font-bold text-3xl">
                Market
              </Text>
						</View>
					</View>
				</View>

        <View className="w-full flex-row justify-between items-center px-4">
          {/* All */}
          <Pressable className={`w-1/4 justify-center items-center py-1 ${active === "all" ? "border-b-2 border-primary" : ""}`} onPress={allCoins}>
            <Text className={`text-lg ${active === "all" ? "font-extrabold" : "text-gray-500"}`}>All</Text>
          </Pressable>

          {/* Gainers */}
          <Pressable className={`w-1/4 justify-center items-center py-1 ${active === "gainers" ? "border-b-2 border-primary" : ""}`} onPress={calculateTopGainers}>
            <Text className={`text-lg ${active === "gainers" ? "font-extrabold" : "text-gray-500"}`}>Gainers</Text>
          </Pressable>

          {/* Losers */}
          <Pressable className={`w-1/4 justify-center items-center py-1 ${active === "losers" ? "border-b-2 border-primary" : ""}`} onPress={calculateTopLosers}>
            <Text className={`text-lg ${active === "losers" ? "font-extrabold" : "text-gray-500"}`}>Losers</Text>
          </Pressable>
        </View>

				{/* Coins */}
				<ScrollView
					contentContainerStyle={{
						paddingBottom: 100,
					}}
					showsVerticalScrollIndicator={false}
					>
						<View className="px-4 py-8 items-center">
              {active === "all" && (
                <View className="px-4 items-center">
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
              )}

              {active === "gainers" && (
                <View className="px-4 items-center">
                  {IsAllCoinLoading ? (
                    <ActivityIndicator size="large" color="orange" />
                  ): (
                    <FlatList
                      nestedScrollEnabled={true}
                      scrollEnabled={false}
                      data={active === "gainers"? topGainers : CoinData.data.coins}
                      keyExtractor={(item) => item.uuid}
                      renderItem={renderItem}
                      showsVerticalScrollIndicator={false}
                      />
                  )}
                </View>
              )}

              {active === "losers" && (
                <View className="px-4 items-center">
                  {IsAllCoinLoading ? (
                    <ActivityIndicator size="large" color="orange" />
                  ): (
                    <FlatList
                      nestedScrollEnabled={true}
                      scrollEnabled={false}
                      data={active === "losers"? topLosers : CoinData.data.coins}
                      keyExtractor={(item) => item.uuid}
                      renderItem={renderItem}
                      showsVerticalScrollIndicator={false}
                      />
                  )}
                </View>
              )}
						</View>
					</ScrollView>
			</View>
		</SafeAreaView>
	);
};

export default MarketScreen;
