import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';
import { TextInput, Button } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/src/lib/supabase';
import { useUserStore } from '@/src/store/useUserStore';
import { decode } from 'base64-arraybuffer';
import useSupabaseAuth from '@/src/hooks/useSupabaseAuth';

const EditProfileScreen = () => {
  const [avatarUrl, setAvatarUrl] = useState('');
  const [username, setUsername] = useState('');
  const { updateProfileImage} = useSupabaseAuth();
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { session, setUser } = useUserStore();

  useEffect(() => {
    if (session?.user) {
      fetchProfile();
    }
  }, [session]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('username, full_name, avatar_url')
        .eq('id', session?.user.id)
        .single();

      if (error) throw error;

      setUsername(data.username || '');
      setFullName(data.full_name || '');
      setAvatarUrl(data.avatar_url || '');
    } catch (error: any) {
      console.log('Error fetching profile:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      const { error } = await updateProfileImage(username, fullName, avatarUrl);

      if (error) throw error;
      Alert.alert('Profile updated successfully');
      setUser({ ...session?.user, user_metadata: { username, full_name: fullName, avatar_url: avatarUrl } } as any);
    } catch (error: any) {
      console.log('Error updating profile:', error.message);
      Alert.alert('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        base64: true,
      });

      if (!result.canceled && result.assets[0].base64) {
        const file = result.assets[0] as any;
        const fileExt = file.uri.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${session?.user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, decode(file.base64), {
            contentType: `image/${fileExt}`,
          });

        if (uploadError) throw uploadError;

        const { data: urlData } = await supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
        setAvatarUrl(urlData.publicUrl);
      }
    } catch (error: any) {
      Alert.alert('Error uploading avatar', error.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center p-4">
        <Pressable onPress={() => navigation.goBack()} className="mr-4">
          <ChevronLeftIcon size={24} color="gray" />
        </Pressable>
        <Text className="text-xl font-bold">Edit Profile</Text>
      </View>

      <View className="flex-1 p-4">
        <Pressable onPress={handleAvatarUpload} className="items-center mb-6">
          <Image
            source={{ uri: avatarUrl || 'https://via.placeholder.com/150' }}
            className="w-32 h-32 rounded-full mb-2"
          />
          <Text className="text-yellow-500">Change Avatar</Text>
        </Pressable>

        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          className="border border-gray-300 rounded-lg p-2 mb-4"
        />

        <TextInput
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
          className="border border-gray-300 rounded-lg p-2 mb-4"
        />

        <TextInput
          placeholder="Email"
          value={session?.user.email}
          editable={false}
          className="border border-gray-300 rounded-lg p-2 mb-4 bg-gray-100"
        />

        <Button
          title={loading ? 'Updating...' : 'Update Profile'}
          onPress={handleUpdateProfile}
          disabled={loading}
          color="#F9A700"
        />
      </View>
    </SafeAreaView>
  );
};

export default EditProfileScreen;