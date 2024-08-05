import { View, Text, Pressable, ActivityIndicator, Alert } from "react-native";
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useQuery } from "@tanstack/react-query";
import { FetchAllCoins, SearchCoin } from "@/src/utils/cryptoapi";
import Animated, { FadeInDown } from "react-native-reanimated";
import numeral from "numeral";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { debounce } from "lodash";
import { FlatList, TextInput } from "react-native-gesture-handler";
import { XMarkIcon } from "react-native-heroicons/outline"


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

const SearchScreen = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>([]);
  const { navigate: navigateHome }: NavigationProp<HomeNavigationType> = useNavigation();

  const handleSearch = async (search: string) => {
    if (!search || search.trim() === "" || search.length < 3) return;

    setLoading(true);
    try {
      const coins = await SearchCoin(search);
  
      if (coins) {
        setResults(coins);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setResults([]);
      Alert.alert("Error", error instanceof Error ? error.message : "An unknown error occurred");
    }
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 500), [])

  const renderItem = ({item, index}: {item: Coin, index: number}) => {
		return (
			<Pressable className="flex-row w-full p-4 items-center" key={item.uuid} onPress={() => navigateHome("CoinDetails", { coinUUID: item.uuid })}>
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
						</View>
					</View>
					<View className="w-[29%] justify-end items-end">
						<Text className="font-bold text-base">{item.symbol}</Text>

						<View className="flex-row items-center justify-center space-x-2"> 
							<Text className="font-medium text-sm text-neutral-500">
								{item?.marketCap?.length > 9 ? item.marketCap.slice(0, 9) : item.marketCap}
							</Text>
						</View>
					</View>
				</Animated.View>
		</Pressable>
		)
	};
	return (
    <SafeAreaView className="flex-1 bg-white">

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4">
        <View className="w-3/4 flex-row space-x-2">
          <Text className="text-3xl font-bold">Search</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View className="mx-4 mb-3 flex-row p-2 border-2 justify-between items-center bg-white rounded-lg shadow-sm">
        <TextInput placeholder="Search for a coin" placeholderTextColor="gray" className="w-full pl-2 flex-1 font-medium text-black tracking-wider" onChangeText={handleTextDebounce} />

        <Pressable onPress={() => {
          handleSearch("");
          setResults([]);
        }}>
          <XMarkIcon color="gray" size={25} />
        </Pressable>
      </View>

      {/* Results */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#F9A700" />
        </View>
      ) : (
        <FlatList
          data={results?.data?.coins}
          keyExtractor={(item) => item.uuid}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          />
      )}
    </SafeAreaView>
	);
};

export default SearchScreen;
