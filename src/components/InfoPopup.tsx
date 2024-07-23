import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";

interface InfoPopupProps {
	isVisible: boolean;
	message: string;
	onClose: () => void;
}

const InfoPopup = ({ isVisible, message, onClose }: InfoPopupProps) => {
	return (
		<Modal isVisible={isVisible} onBackdropPress={onClose}>
			<View className="bg-white p-4 rounded-lg">
				<Text className="text-lg font-bold mb-2">Information</Text>
				<Text className="mb-4">{message}</Text>
				<TouchableOpacity
					className="bg-primary py-2 px-4 rounded-lg self-end"
					onPress={onClose}
				>
					<Text className="text-white font-semibold">Close</Text>
				</TouchableOpacity>
			</View>
		</Modal>
	);
};

export default InfoPopup;
