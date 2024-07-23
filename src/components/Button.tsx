import { Text, Pressable } from "react-native";
import React from "react";

interface Button {
	title: string;
	action?: () => void;
}

const Button = ({ title, action }: Button) => {
	return (
		<Pressable
			className="bg-primary rounded-lg justify-center items-center py-3"
			onPress={action}
		>
			<Text className="text-white font-medium text-lg">{title}</Text>
		</Pressable>
	);
};

export default Button;
