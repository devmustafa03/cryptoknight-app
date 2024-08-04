import { View, Text, ActivityIndicator, SafeAreaView, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { CartesianChart, Line, useChartPressState } from "victory-native"
import { Circle } from "@shopify/react-native-skia";
import { useQuery } from "@tanstack/react-query";
import { FetchCoinDetails, FetchCoinHistory } from "@/src/utils/cryptoapi";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { SharedValue } from "react-native-reanimated";
import numeral from "numeral";
import { format } from "date-fns";
import { Image } from "expo-image";
import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  CoinDetails: { coinUUID: string };
};

type CoinDetailsScreenRouteProps = RouteProp<RootStackParamList, 'CoinDetails'>;

const CoinDetailsScreen = () => {
	const route = useRoute<CoinDetailsScreenRouteProps>();

	if (!route.params?.coinUUID) {
	  return null;
	}

	const { coinUUID } = route.params;
	const [lineData, setLineData] = useState();
	const [item, setItem] = useState<any>();
	const navigation = useNavigation();

	const blurhash =
	"|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

	const { state, isActive } = useChartPressState({
		x: 0, y: {price: 0}
	});

	const ToolTip = ({x, y}: {x: SharedValue<number>, y: SharedValue<number>}) => {
		return <Circle cx={x} cy={y} r={10} color="red" />
	}

	const { data: CoinsDetails, isLoading: CoinDetailsLoading } = useQuery({
		queryKey: ["CoinDetails", coinUUID],
		queryFn: () => coinUUID && FetchCoinDetails(coinUUID),
	});

	// Coin History
	const { data: CoinHistory, isLoading: CoinHistoryLoading } = useQuery({
		queryKey: ["CoinHistory", coinUUID],
		queryFn: () => coinUUID && FetchCoinHistory(coinUUID),
	});

	useEffect(() => {
		if ( CoinHistory && CoinHistory?.data?.length > 0) {
			const datasets = CoinHistory.data.history.map((item: any) => {
				price: parseFloat(item.price)
				timestamp: item.timestamp
			});
			setLineData(datasets);
		}

		if ( CoinsDetails && CoinsDetails?.data?.coin) {
			setItem(CoinsDetails.data.coin);
		}
	}, [CoinHistory, CoinsDetails]);

	return (
		<View className="flex-1 bg-white">
			{ CoinDetailsLoading || CoinHistoryLoading ? (
				<View className="absolute z-50 h-full w-full justify-center items-center">
					<View className="h-full w-full justify-center items-center bg-black opacity-40">

					</View>
					<View className="absolute">
						<ActivityIndicator size="large" color="white" />
					</View>
				</View>
			): (
				<SafeAreaView>
					<View className="flex-row justify-between items-center px-4">
						<Pressable onPress={() => navigation.goBack()} className="border-2 border-neutral-500 rounded-full p-1">
							<MaterialIcons name="arrow-back-ios" size={24} color="black" />
						</Pressable>

						<View>
							<Text className="text-lg font-bold">{item?.symbol}</Text>
						</View>

						<View className="border-2 border-neutral-500 rounded-full p-1">
							<Entypo name="dots-three-horizontal" size={24} color="black" />
						</View>
					</View>

					<View className="px-4 justify-center items-center py-2">
						<Text className={`font-extrabold text-3xl`}>
							{numeral(parseFloat(item?.price)).format('$0,0.00')}
						</Text>
					</View>

					{item && (
						<View className="flex-row justify-center items-center space-x-2 px-4 py-2">
							<View className="flex-row w-full py-4 items-center">
								<View className="w-[16%]">
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
										<Text className="text-medium text-sm text-neutral-500">{numeral(item?.price).format('$0,0.00')}</Text>

										<Text className={`font-medium text-sm ${item?.change > 0 ? "text-green-500" : item?.change < 0 ? "text-red-500" : "text-neutral-500"}`}>
											{item.change}%
										</Text>
									</View>

									<View className="w-[29%] justify-start items-end">
										<Text className="font-bold text-base">{item.symbol}

									<View className="flex-row items-center space-x-2">
										<Text className="text-medium text-sm text-neutral-500">
											{item?.marketCap.length > 9 ? item.marketCap.slice(0, 9) : item.marketCap}
										</Text>
									</View>
										</Text>
									</View>
							</View>
						</View>
					)}
				</SafeAreaView>
			)}

			<View style={{height: 400, paddingHorizontal: 16}}>
				{
					lineData && (
						<CartesianChart
						chartPressState={state as any}
						axisOptions={{
							tickCount: 8,
							labelOffset: { x: -1, y: 0},
							labelColor: "green",
							formatXLabel: (ms) => format(new Date(ms*1000), "MM/dd")
						}}
						data={lineData}
						// @ts-ignore
						xKey={"timestamp"}
						yKeys={["price"] as any}
						>
							{
								({points}: any) => (
									<>
										<Line
										points={points?.price} color="green" strokeWidth={2} />
										{
											isActive && <ToolTip x={state.x.position} y={state.y.price.position} />
										}
									</>
								)
							}
						</CartesianChart>
					)
				}
			</View>

			<View className="flex-row justify-between">
				<Text className="text-base font-bold text-neutral-500">
					All Time High
				</Text>
				<Text className="font-extrabold text-base">
					{numeral(parseFloat(item?.high)).format('$0,0.00')}
				</Text>
			</View>

			<View className="flex-row justify-between">
				<Text className="text-base font-bold text-neutral-500">
					Number of Markets
				</Text>
				<Text className="font-extrabold text-base">
					{numeral(parseFloat(item?.numberOfMarkets)).format('$0,0.00')}
				</Text>
			</View>

			<View className="flex-row justify-between">
				<Text className="text-base font-bold text-neutral-500">
					Number of Exchanges
				</Text>
				<Text className="font-extrabold text-base">
					{numeral(parseFloat(item?.numberOfExchanges)).format('$0,0.00')}
				</Text>
			</View>
		</View>
	);
};

export default CoinDetailsScreen;
