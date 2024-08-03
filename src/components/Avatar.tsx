import { View, Text, Image, StyleSheet, ActivityIndicator, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../lib/supabase";
import { MaterialIcons } from "@expo/vector-icons";

interface Props {
	size: number;
	url: string | null;
	onUpload: (filePath: string) => void;
	showUpload?: boolean;
}

const Avatar = ({ size, url, onUpload, showUpload }: Props) => {
	const [uploading, setUploading] = useState<Boolean>(false);
	const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
	const avatarSize = {
		width: size,
		height: size,
	};

	useEffect(() => {
		if (url) {
			downloadImage(url);
		}
	}, [url]);

	async function downloadImage(path: string) {
		try {
			const { data, error } = await supabase.storage
				.from("avatars")
				.download(path);
			if (error) {
				throw error;
			}
			const fr = new FileReader();
			fr.onload = () => {
				if (typeof fr.result === "string") {
					setAvatarUrl(fr.result as string);
				}
			}
			const url = URL.createObjectURL(data);
			setAvatarUrl(url);
		} catch (error) {
			if (error instanceof Error) {
				console.log("Error downloading image: ", error.message);
			}
		}
	}

	async function uploadAvatar() {
	}
	return (
		<View>
			{avatarUrl ? (
				<View
					className="relative"
				>
					<Image
						source={{ uri: avatarUrl }}
						accessibilityLabel="Avatar"
						style={[
							avatarSize,
							styles.avatar,
							styles.image
						]}
					/>
				</View>
			) : (
				<View className="justify-center items-center" style={[avatarSize, styles.avatar, styles.noImage]}>
					<ActivityIndicator size="small" color="white" />
				</View>
			)}

			{showUpload && (
				<View className="absolute bottom-0 right-0">
					{!uploading && (
						<Pressable>
							<MaterialIcons name="cloud-upload" size={30} color={"black"} /> 
						</Pressable>
					)}
				</View>
			)}
		</View>
	);
};

export default Avatar;

const styles = StyleSheet.create({
	avatar: {
		overflow: "hidden",
		maxWidth: "100%",
		position: "relative",
	},
	image: {
		objectFit: "cover",
		paddingTop: 0,
	},
	noImage: {
		backgroundColor: "gray",
		borderWidth: 2,
		borderColor: "#e5e7eb",
		borderRadius: 20,
	}
});