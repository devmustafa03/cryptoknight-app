import React, { useCallback, useState, useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import Avatar from '@/src/components/Avatar';
import useSupabaseAuth from '@/src/hooks/useSupabaseAuth';
import { useUserStore } from '@/src/store/useUserStore';

const ProfileScreen = () => {
  const [loading, setLoading] = useState(false);
  const { getUserProfile, signOut } = useSupabaseAuth();
  const navigation = useNavigation<any>();
  const { session, avatarUrl, username, setIsLoggedIn, setAvatarUrl, setUsername } = useUserStore();

  const handleGetProfile = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const { data, error, status } = await getUserProfile();
      if (error && status !== 406) {
        throw error;
      }
      if (data) {
        setAvatarUrl(data.avatar_url);
        setUsername(data.username);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }, [getUserProfile, setAvatarUrl, setUsername]);

  useFocusEffect(
    useCallback(() => {
      if (session) {
        handleGetProfile();
      }
    }, [session, handleGetProfile])
  );

  const handleSignOut = useCallback(async () => {
    await signOut();
    setIsLoggedIn(false);
    Toast.show({
      type: 'success',
      text1: 'Logout Successful',
      text2: 'Thanks for using Crypto Tracker',
    });
    navigation.navigate('Login');
  }, [signOut, setIsLoggedIn, navigation]);

  return (
    <View className='flex-1 bg-white'>
      <View>
				<View className='justify-center items-center py-14 pb-20 bg-primary'>
					<View className='overflow-hidden border-2 border-white rounded-3xl'>
						<Avatar size={100} url={avatarUrl} onUpload={() => {}} />
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

export default React.memo(ProfileScreen);
