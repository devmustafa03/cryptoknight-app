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

const NewsScreen = () => {
  const [loading, setLoading] = useState(false);
  
	return (
    <SafeAreaView className="flex-1 bg-white">

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4">
        <View className="w-3/4 flex-row space-x-2">
          <Text className="text-3xl font-bold">Crypto News</Text>
        </View>
      </View>

      
    </SafeAreaView>
	);
};

export default NewsScreen;
