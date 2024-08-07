import { View, Text, ActivityIndicator, SafeAreaView, Pressable } from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { CartesianChart, Line, useChartPressState } from "victory-native";
import { Circle } from "@shopify/react-native-skia";
import { useQuery } from "@tanstack/react-query";
import { FetchCoinDetails, FetchCoinHistory } from "@/src/utils/cryptoapi";
import { MaterialIcons } from "@expo/vector-icons";
import { SharedValue } from "react-native-reanimated";
import numeral from "numeral";
import { format } from "date-fns";
import { Image } from "expo-image";
import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  CoinDetails: { coinUUID: string };
};

type CoinDetailsScreenRouteProps = RouteProp<RootStackParamList, 'CoinDetails'>;
const ToolTip = React.memo(({ x, y }: { x: SharedValue<number>; y: SharedValue<number> }) => {
  return <Circle cx={x} cy={y} r={10} color="red" />;
});

const CoinDetailsScreen = () => {
  const route = useRoute<CoinDetailsScreenRouteProps>();
  const navigation = useNavigation();
  const { coinUUID } = route.params || {};

  const [lineData, setLineData] = useState<Array<{ price: number; timestamp: number }>>([]);
  const [item, setItem] = useState<any>(null);

  const blurhash = "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

  const { state, isActive } = useChartPressState({
    x: 0,
    y: { price: 0 }
  });

  const { data: CoinsDetails, isLoading: CoinDetailsLoading } = useQuery({
    queryKey: ["CoinDetails", coinUUID],
    queryFn: () => (coinUUID ? FetchCoinDetails(coinUUID) : Promise.resolve(null)),
  });

  const { data: CoinHistory, isLoading: CoinHistoryLoading } = useQuery({
    queryKey: ["CoinHistory", coinUUID],
    queryFn: () => (coinUUID ? FetchCoinHistory(coinUUID) : Promise.resolve(null)),
  });

  useEffect(() => {
    if (CoinHistory?.data?.history) {
      const datasets = CoinHistory.data.history.map((item: any) => ({
        price: parseFloat(item.price),
        timestamp: item.timestamp
      }));
      setLineData(datasets);
    }

    if (CoinsDetails?.data?.coin) {
      setItem(CoinsDetails.data.coin);
    }
  }, [CoinHistory, CoinsDetails]);

  const handleGoBack = useCallback(() => navigation.goBack(), [navigation]);

  const formattedPrice = useMemo(() => numeral(parseFloat(item?.price || "0")).format('$0,0.00'), [item?.price]);
  const formattedHighPrice = useMemo(() => numeral(parseFloat(item?.high || "0")).format('$0,0.00'), [item?.high]);
  const formattedMarkets = useMemo(() => numeral(parseFloat(item?.numberOfMarkets || "0")).format('0,0'), [item?.numberOfMarkets]);
  const formattedExchanges = useMemo(() => numeral(parseFloat(item?.numberOfExchanges || "0")).format('0,0'), [item?.numberOfExchanges]);

  if (!coinUUID) {
    return null;
  }

  if (CoinDetailsLoading || CoinHistoryLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {CoinDetailsLoading || CoinHistoryLoading ? (
        <View className="absolute z-50 h-full w-full justify-center items-center">
          <View className="h-full w-full justify-center items-center">
            <ActivityIndicator size="large" color="black" />
          </View>
        </View>
      ) : (
        <SafeAreaView className="pt-10">
          <View className="flex-row justify-between items-center px-4">
          <Pressable onPress={handleGoBack} className="rounded-full p-1">
            <MaterialIcons name="arrow-back-ios" size={24} color="black" />
          </Pressable>
          <Text className="text-lg font-bold">{item?.symbol}</Text>
          <View className="rounded-full p-1" />
        </View>

        <View className="px-4 justify-center items-center py-2">
          <Text className="font-extrabold text-3xl">{formattedPrice}</Text>
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
                <View className="w-[55%] justify-start items-start flex-row">
                  <View>
                    <Text className="font-bold text-lg">{item?.name}</Text>

                    <View className="flex-row items-center space-x-2">
                      <Text className="text-medium text-sm text-neutral-500">{numeral(item?.price).format('$0,0.00')}</Text>

                      <Text className={`font-medium text-sm ${parseFloat(item?.change) > 0 ? "text-green-500" : parseFloat(item?.change) < 0 ? "text-red-500" : "text-neutral-500"}`}>
                        {item.change}%
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}
          <View style={{ height: 400 }} className="px-4">
          {lineData.length > 0 && (
            <CartesianChart
              chartPressState={state}
              axisOptions={{
                tickCount: 8,
                labelColor: "orange",
                labelOffset: { x: -1, y: 0 },
                formatXLabel: (ms) => format(new Date(ms * 1000), "MM/dd"),
              }}
              data={lineData}
              xKey="timestamp"
              yKeys={["price"]}
            >
              {({ points }: any) => (
                <>
                  <Line points={points.price} color="orange" strokeWidth={2} />
                  {isActive && <ToolTip x={state.x.position} y={state.y.price.position} />}
                </>
              )}
            </CartesianChart>
          )}
        </View>

        <View className="flex-row justify-between px-4">
          <Text className="text-base font-bold text-neutral-500">All Time High</Text>
          <Text className="font-extrabold text-base">{formattedHighPrice}</Text>
        </View>

        <View className="flex-row justify-between px-4">
          <Text className="text-base font-bold text-neutral-500">Number of Markets</Text>
          <Text className="font-extrabold text-base">{formattedMarkets}</Text>
        </View>

        <View className="flex-row justify-between px-4">
          <Text className="text-base font-bold text-neutral-500">Number of Exchanges</Text>
          <Text className="font-extrabold text-base">{formattedExchanges}</Text>
        </View>
        </SafeAreaView>
      )}
    </View>
  );
};

export default React.memo(CoinDetailsScreen);
