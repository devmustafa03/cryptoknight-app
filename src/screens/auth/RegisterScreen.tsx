import React, { useState } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	ActivityIndicator,
	Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Formik } from "formik";
import * as Yup from "yup";
import { AntDesign } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Image } from "expo-image";
import ButtonOutline from "@/src/components/ButtonOutline";
import Breaker from "@/src/components/Breaker";
import InfoPopup from "@/src/components/InfoPopup";
import { supabase } from "@/src/lib/supabase";

type RootStackParamList = {
	Home: undefined;
	Login: undefined;
};

const RegisterSchema = Yup.object().shape({
	email: Yup.string().email("Invalid email").required("Email is required"),
	password: Yup.string()
		.min(8, "Password must be at least 8 characters")
		.matches(
			/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
			"Must contain at least one number and one special character"
		)
		.required("Password is required"),
});
const RegisterScreen = () => {
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [infoPopup, setInfoPopup] = useState({ visible: false, message: "" });

	const showInfoPopup = (field: "email" | "password") => {
		let message = "";
		if (field === "email") {
			message = "Please enter a valid email address.";
		} else if (field === "password") {
			message =
				"Password must be at least 8 characters long and contain at least one number and one special character.";
		}
		setInfoPopup({ visible: true, message });
	};

	const handleSignUp = async (values: { email: string; password: string }) => {
		setIsLoading(true);
		try {
			const {data: {session}, error} = await supabase.auth.signUp({
				email: values.email,
				password: values.password,
			});
			if (error) {
				setIsLoading(false);
				Alert.alert("Registration Failed", error.message);
				return;
			}
			if (!session) {
				Toast.show({
					type: "success",
					text1: "Registration Successful",
					text2: "Hurray! Please check mail for verification link.",
				});
				navigation.navigate("Login");
			}
		} catch (error) {
			Toast.show({
				type: "error",
				text1: "Registeration Failed",
				text2:
					error instanceof Error ? error.message : "An unknown error occurred",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleGoogleSignUp = async () => {
		try {
			// await googleSignIn();
			Toast.show({
				type: "success",
				text1: "Google Sign-up Successful",
				text2: "Welcome!",
			});
			navigation.navigate("Home");
		} catch (error) {
			Toast.show({
				type: "error",
				text1: "Google Sign-up Failed",
				text2:
					error instanceof Error ? error.message : "An unknown error occurred",
			});
		}
	};

	const blurhash =
		"|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

	return (
		<SafeAreaView className="flex-1 bg-white px-6">
			<View className="flex-1 justify-center">
				<Animated.View
					entering={FadeInDown.duration(300).springify()}
					className="mb-8"
				>
					<View className="w-16 h-16 overflow-hidden mb-4">
						<Image
							source={require("../../../assets/images/icon.png")}
							placeholder={blurhash}
							contentFit="cover"
							transition={1000}
							className="w-full h-full flex-1"
						/>
					</View>
					<Text className="text-3xl font-bold mb-2">Register To Join Us.</Text>
					<Text className="text-gray-600">
						Welcome back! Please enter your details.
					</Text>
				</Animated.View>

				<Formik
					initialValues={{ email: "", password: "" }}
					validationSchema={RegisterSchema}
					onSubmit={handleSignUp}
				>
					{({
						handleChange,
						handleBlur,
						handleSubmit,
						values,
						errors,
						touched,
					}) => (
						<View>
							<Animated.View
								entering={FadeInDown.duration(300).delay(100).springify()}
								className="mb-4"
							>
								<TextInput
									className={`border rounded-lg p-3 ${
										errors.email && touched.email
											? "border-red-500"
											: "border-gray-300"
									}`}
									placeholder="Email"
									onChangeText={handleChange("email")}
									onBlur={handleBlur("email")}
									value={values.email}
									keyboardType="email-address"
									autoCapitalize="none"
								/>
								{errors.email && touched.email && (
									<TouchableOpacity
										className="absolute right-3 top-4"
										onPress={() => showInfoPopup("email")}
									>
										<AntDesign name="infocirlceo" size={20} color="red" />
									</TouchableOpacity>
								)}
							</Animated.View>

							<Animated.View
								entering={FadeInDown.duration(300).delay(200).springify()}
								className="mb-6"
							>
								<TextInput
									className={`border rounded-lg p-3 ${
										errors.password && touched.password
											? "border-red-500"
											: "border-gray-300"
									}`}
									placeholder="Password"
									onChangeText={handleChange("password")}
									onBlur={handleBlur("password")}
									value={values.password}
									secureTextEntry
								/>
								{errors.password && touched.password && (
									<TouchableOpacity
										className="absolute right-3 top-4"
										onPress={() => showInfoPopup("password")}
									>
										<AntDesign name="infocirlceo" size={20} color="red" />
									</TouchableOpacity>
								)}
							</Animated.View>

							<Animated.View
								entering={FadeInDown.duration(300).delay(300).springify()}
							>
								<TouchableOpacity
									className="bg-primary rounded-lg p-4 items-center"
									onPress={() => handleSubmit()}
									disabled={isLoading}
								>
									{isLoading ? (
										<ActivityIndicator color="white" />
									) : (
										<Text className="text-white font-semibold">Sign Up</Text>
									)}
								</TouchableOpacity>
							</Animated.View>
						</View>
					)}
				</Formik>

				<Breaker />

				<Animated.View
					entering={FadeInDown.duration(100).delay(600).springify()}
					className="border border-white pb-4"
				>
					<ButtonOutline
						title="Continue with Google"
						action={handleGoogleSignUp}
					>
						<AntDesign name="google" size={20} color="gray" />
					</ButtonOutline>
				</Animated.View>

				<Animated.View
					entering={FadeInDown.duration(300).delay(600).springify()}
					className="mt-8 flex-row justify-center"
				>
					<Text className="text-gray-600">Have an account? </Text>
					<TouchableOpacity onPress={() => navigation.navigate("Login")}>
						<Text className="text-primary font-semibold">Login</Text>
					</TouchableOpacity>
				</Animated.View>
			</View>
			<InfoPopup
				isVisible={infoPopup.visible}
				message={infoPopup.message}
				onClose={() => setInfoPopup({ visible: false, message: "" })}
			/>
		</SafeAreaView>
	);
};

export default RegisterScreen;
