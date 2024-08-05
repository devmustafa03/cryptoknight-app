import Avatar from '@/src/components/Avatar';
import useSupabaseAuth from '@/src/hooks/useSupabaseAuth';
import { useUserStore } from '@/src/store/useUserStore';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

const ProfileScreen = () => {
	const [avatarUrl, setAvatarUrl] = useState("https://img.freepik.com/free-vector/cheerful-square-character-illustration_1308-164239.jpg?w=826&t=st=1722856773~exp=1722857373~hmac=8af25cd403de549ec8e6feec3efdc18f39b897f4f30d2cc74dbcc074faa50f66");
	const [username, setUsername] = useState("");
	const [loading, setLoading] = useState(false);
	const { getUserProfile, signOut } = useSupabaseAuth();
	const { session } = useUserStore();
	const navigation = useNavigation<any>();

  const handleGetProfile = async () => {
		setLoading(true);
		try {
			const { data, error, status } = await getUserProfile();
			setLoading(false);
			if (error && status !== 406) {
				setLoading(false);
				throw error;
			}

			if (data) {
				setAvatarUrl(data.avatar_url);
				setUsername(data.username);
			}
		} catch (error) {
			throw error;
		} finally {
			setLoading(false);
		}
	}

	useFocusEffect(
		useCallback(() => {
			if(session) {
				handleGetProfile();
			}
		}, [session])
	)

	const handleSignOut = async () => {
		await signOut();
		Toast.show({
			type: 'success',
			text1: 'Logout Successful',
			text2: 'Thanks for using Crypto Tracker',
		});
		navigation.navigate('Login');
	}
  return (
    <View className='flex-1 bg-white'>
      <View>
				<View className='justify-center items-center py-14 pb-20 bg-primary'>
					<View className='overflow-hidden border-2 border-white rounded-3xl'>
						<Avatar size={100} url={avatarUrl} onUpload={() => console.log('upload')} />
					</View>

					<View className='w-full py-3 items-center'>
						<Text className="text-lg font-bold text-white">
							{username || "User"}
						</Text>
					</View>
				</View>

				<View className='bg-white px-4 py-6 -mt-11 rounded-t-3xl'>
					<Text className="text-lg font-bold pb-2">
						Account Overview
					</Text>
				</View>

				<View className='p-2 py-3 rounded-xl border-2 border-gray-300 my-3 mx-4'>
					<Pressable className='flex-row items-center' onPress={() => navigation.navigate('EditProfileS')}>
						<View className='w-full flex-row items-center space-x-4'>
							<View className='bg-primary p-2 rounded-full'>
								<MaterialIcons name="edit" size={24} color="black" />
							</View>

							<Text className='text-lg font-bold'>
								Edit Profile
							</Text>
						</View>
					</Pressable>
				</View>

				<View className='p-2 py-3 rounded-xl border-2 border-gray-300 my-3 mx-4'>
					<Pressable className='flex-row items-center' onPress={() => navigation.navigate('EditProfileS')}>
						<View className='w-full flex-row items-center space-x-4'>
							<View className='bg-primary p-2 rounded-full'>
								<MaterialIcons name="lock" size={24} color="black" />
							</View>

							<Text className='text-lg font-bold'>
								Change Password
							</Text>
						</View>
					</Pressable>
				</View>

				<View className='p-2 py-3 rounded-xl border-2 border-gray-300 my-3 mx-4'>
					<Pressable className='flex-row items-center' onPress={handleSignOut}>
						<View className='w-full flex-row items-center space-x-4'>
							<View className='bg-primary p-2 rounded-full'>
								<MaterialIcons name="logout" size={24} color="black" />
							</View>

							<Text className='text-lg font-bold'>
								Logout
							</Text>
						</View>
					</Pressable>
				</View>
			</View>
    </View>
  );
}

export default ProfileScreen;
