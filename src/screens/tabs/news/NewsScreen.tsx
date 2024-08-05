import { View, Text, Pressable, ActivityIndicator, Alert } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useQuery } from "@tanstack/react-query";
import { FetchNews } from "@/src/utils/cryptoapi";
import { useNavigation } from "@react-navigation/native";
import { FlatList } from "react-native-gesture-handler";
import {heightPercentageToDP as hp} from "react-native-responsive-screen"
import { BookmarkSquareIcon } from "react-native-heroicons/outline";

const NewsScreen = () => {
	const { data: NewsData, isLoading: isLoadingNews } = useQuery({
		queryKey: ["cryptonews"],
		queryFn: FetchNews,
		retry: 1,
	});

	const navigation = useNavigation() as any;

	const handleClick = (item: any) => {
		navigation.navigate("NewsDetails", item );
	};

	const renderItem = ({item, index}: {item: any, index: number}) => {
		return (
			<Pressable
				className="flex-row w-full shadow-sm items-center px-4"
				key={index}
				onPress={() => handleClick(item)}
				>
					<View className="flex-row justify-start w-full shadow-sm">
						<View className="items-start justify-start w-1/5">
							<Image
								source={{ uri: item.thumbnail }}
								style={{
									width: hp(9),
									height: hp(10),
								}}
								resizeMode="cover"
								className="rounded-lg"
								/>
						</View>

						<View className="w-[70%] pl-4 justify-center space-y-1">
								<Text className="text-sm font-bold text-gray-900">
									{item?.description?.length > 20 ? item?.description?.slice(0, 20) + "..." : item?.description}
								</Text>

								<Text className="text-neutral-800 capitalize max-w-[90%">
									{item?.title?.length > 50 ? item?.title?.slice(0, 50) + "..." : item?.title}
								</Text>

								<Text className="text-xs text-gray-700">
									{item?.createdAt}
								</Text>
						</View>
							{/* Bookmark */}
						<View className="w-[8%] justify-center pl-2">
							<BookmarkSquareIcon size={25} color="gray" />
						</View>
					</View>
				</Pressable>
		);
	};
  
	return (
    <SafeAreaView className="flex-1 bg-white pb-20 h-auto">

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-6 pt-3">
        <View className="w-3/4 flex-row space-x-2">
          <Text className="text-3xl font-bold">Crypto News</Text>
        </View>
      </View>

			{/* News */}
			<View>
				{
					NewsData && NewsData?.data?.length > 0 ? (
						<FlatList
							data={NewsData.data}
							showsVerticalScrollIndicator={false}
							keyExtractor={(item, id) => id.toString()}
							renderItem={renderItem}
							/>
					): (
						<View>
							<ActivityIndicator size="large" color="#F9A700" />
						</View>
					)
				}
			</View>
    </SafeAreaView>
	);
};

export default NewsScreen;
