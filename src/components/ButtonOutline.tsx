import { Text, Pressable, View } from "react-native";
import React from "react";

interface OutlineButton {
	title: string;
	action?: () => void;
	children?: React.ReactNode;
}

const ButtonOutline = ({ title, action, children }: OutlineButton) => {
	return (
		<Pressable
			className="border border-primary rounded-lg justify-center items-center p-3 px-4 flex-row w-full"
			onPress={action}
		>
			{children && <View className="mr-4">{children}</View>}
			<Text className="text-gray-500 font-medium text-lg">{title}</Text>
		</Pressable>
	);
};

export default ButtonOutline;
