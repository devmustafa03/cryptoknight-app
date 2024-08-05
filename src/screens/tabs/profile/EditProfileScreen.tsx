import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Alert, TextInput, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '@/src/lib/supabase';
import { useUserStore } from '@/src/store/useUserStore';
import useSupabaseAuth from '@/src/hooks/useSupabaseAuth';
import Avatar from '@/src/components/Avatar'; // Make sure to import the Avatar component

const EditProfileScreen = () => {
  const [avatarUrl, setAvatarUrl] = useState('');
  const [username, setUsername] = useState('');
  const { updateProfileImage } = useSupabaseAuth();
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { session, updateUserProfile } = useUserStore();

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
  
      // Update local state and global store
      updateUserProfile(avatarUrl, username);
  
      // Refresh the profile data
      await fetchProfile();
  
      Alert.alert('Profile updated successfully');
    } catch (error: any) {
      console.log('Error updating profile:', error.message);
      Alert.alert('Error updating profile', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (filePath: string) => {
    try {
      const { data: urlData } = await supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      if (urlData) {
        setAvatarUrl(urlData.publicUrl);
        // Update the profile with the new avatar URL
        await updateProfileImage(username, fullName, urlData.publicUrl);
        // Update the global store
        updateUserProfile(urlData.publicUrl, username);
      }
    } catch (error: any) {
      Alert.alert('Error updating avatar', error.message);
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
        <View className="items-center mb-6">
          <Avatar
            size={128}
            url={avatarUrl}
            onUpload={handleAvatarUpload}
            showUpload={true}
          />
          <Text className="text-yellow-500 mt-2">Tap to Change Avatar</Text>
        </View>

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