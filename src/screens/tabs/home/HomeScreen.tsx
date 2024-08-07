import React, { useCallback, useState, useMemo } from "react";
import { View, Text, Pressable, ActivityIndicator, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { useQuery } from "@tanstack/react-query";
import Animated, { FadeInDown } from "react-native-reanimated";
import numeral from "numeral";

import Avatar from "@/src/components/Avatar";
import useSupabaseAuth from "@/src/hooks/useSupabaseAuth";
import { useUserStore } from "@/src/store/useUserStore";
import { FetchAllCoins } from "@/src/utils/cryptoapi";

interface Coin {
	uuid: string
	name: string;
	symbol: string;
	iconUrl: string;
	price: string;
	change: number;
	marketCap: string;
}

const blurhash = "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const HomeScreen = () => {
  const [loading, setLoading] = useState(false);
  const { getUserProfile } = useSupabaseAuth();
  const { session, avatarUrl, username, setAvatarUrl, setUsername } = useUserStore();
  const navigation = useNavigation() as any;

  const { data: coinData, isLoading: isAllCoinLoading } = useQuery({
    queryKey: ["allCoins"],
    queryFn: FetchAllCoins,
    retry: 1,
  });

  const handleGetProfile = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error, status } = await getUserProfile();
      if (error && status !== 406) throw error;
      if (data) {
        setAvatarUrl(data.avatar_url);
        setUsername(data.username);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  }, [getUserProfile, setAvatarUrl, setUsername]);

  useFocusEffect(
    useCallback(() => {
      if (session) {
        handleGetProfile();
      }
    }, [session, handleGetProfile])
  );

  const renderItem = useCallback(({ item, index }: {
		item: Coin,
		index: number
	}) => (
    <Pressable 
      className="flex-row w-full py-4 items-center px-4" 
      onPress={() => navigation.navigate("CoinDetails", { coinUUID: item.uuid })}
    >
      <Animated.View
        entering={FadeInDown.duration(100).delay(index * 100).springify()}
        className="w-full flex-row items-center"
      >
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
        <View className="w-[55%] justify-start items-start">
          <Text className="font-bold text-lg">{item.name}</Text>
          <View className="flex-row items-center space-x-2">
            <Text className="text-medium text-sm text-neutral-700">
              {numeral(item.price).format('$0,0.00')}
            </Text>
            <Text className={`font-medium text-sm ${item.change > 0 ? "text-green-500" : "text-red-500"}`}>
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
  ), [navigation]);

  const memoizedCoinList = useMemo(() => (
    <FlatList
      data={coinData?.data?.coins}
      keyExtractor={(item) => item.uuid}
      renderItem={renderItem}
      initialNumToRender={10}
      windowSize={21}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      removeClippedSubviews={true}
      showsVerticalScrollIndicator={false}
    />
  ), [coinData, renderItem]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="w-full flex-row justify-between items-center px-4 my-4">
        <View className="w-3/4 flex-row space-x-2">
          <View className="w-12 h-12 overflow-hidden rounded-2xl">
            <Avatar size={50} url={avatarUrl} onUpload={handleGetProfile} />
          </View>
          <View>
            <Text className="text-lg font-bold">
              Hi, {username || "User"}
            </Text>
            <Text className="text-sm text-neutral-500">
              Have a good day
            </Text>
          </View>
        </View>
      </View>

      {isAllCoinLoading ? (
        <ActivityIndicator size="large" color="orange" />
      ) : (
        memoizedCoinList
      )}
    </SafeAreaView>
  );
};

export default React.memo(HomeScreen);