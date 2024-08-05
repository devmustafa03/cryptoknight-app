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
			setAvatarUrl("https://img.freepik.com/free-vector/cheerful-square-character-illustration_1308-164239.jpg?w=826&t=st=1722856773~exp=1722857373~hmac=8af25cd403de549ec8e6feec3efdc18f39b897f4f30d2cc74dbcc074faa50f66")
			console.log("Error downloading image: ", error);
		}
	}

	async function uploadAvatar() {
		try {
			setUploading(true);

			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsMultipleSelection: false,
				allowsEditing: true,
				quality: 1,
				exif: false
			});

			if (result.canceled || !result.assets || result.assets.length === 0) {
				console.log("User Cancelled Image Picker");
				return;
			}

			const image = result.assets[0];
			console.log("Got image", image);

			if (!image.uri) {
				throw new Error("No image selected");
			}

			const arrayBuffer = await fetch(image.uri).then((res) => res.arrayBuffer());
			const fileExt = image.uri.split(".").pop()?.toLocaleLowerCase() ?? "jpeg";
			const path = `${Date.now()}.${fileExt}`;
			const { data, error: uploadError} = await supabase.storage.from("avatars").upload(path, arrayBuffer, {
				contentType: image.mimeType ?? "image/jpeg",
			});

			if (uploadError) {
				throw uploadError;
			}

			if (data) {
				onUpload(data.path);
			}
		} catch (error) {
			console.error(error);
		} finally {
			setUploading(false);
		}
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
						<Pressable onPress={uploadAvatar}>
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