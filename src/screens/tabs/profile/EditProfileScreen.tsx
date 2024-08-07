import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { View, Text, Pressable, Alert, TextInput, ActivityIndicator, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeftIcon, CameraIcon } from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '@/src/lib/supabase';
import { useUserStore } from '@/src/store/useUserStore';
import useSupabaseAuth from '@/src/hooks/useSupabaseAuth';
import Avatar from '@/src/components/Avatar';
import * as ImagePicker from 'expo-image-picker';
import { debounce } from 'lodash';

const AvatarSection = React.memo(({ previewImage, avatarUrl, handleImagePicker, setPreviewImage }: any) => (
  <View className="items-center mb-6">
    <Pressable onPress={handleImagePicker}>
      {previewImage ? (
        <Image source={{ uri: previewImage }} className="w-32 h-32 rounded" />
      ) : (
        <Avatar size={128} url={avatarUrl} showUpload={false} onUpload={setPreviewImage} />
      )}
      <View className="absolute right-0 bottom-0 bg-[#F9A700] rounded-full p-2">
        <CameraIcon size={20} color="white" />
      </View>
    </Pressable>
    <Text className="mt-2 text-[#F9A700] font-semibold">Tap to Change Avatar</Text>
  </View>
));

const InputField = React.memo(({ label, value, onChangeText, placeholder, editable = true, error }: any) => (
  <View className="mb-4">
    <Text className="text-base font-semibold mb-2">{label}</Text>
    <TextInput
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      className={`border border-gray-300 rounded-lg p-3 text-base ${!editable ? 'bg-gray-100' : ''} ${error ? 'border-red-500' : ''}`}
      editable={editable}
    />
    {error && <Text className="text-red-500 mt-1">{error}</Text>}
  </View>
));

const EditProfileScreen: React.FC = () => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
  const navigation = useNavigation();
  const { session, updateUserProfile } = useUserStore();
  const { updateProfileImage } = useSupabaseAuth();
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      fetchProfile();
    }
  }, [session?.user?.id]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      if (!session?.user.id) throw new Error('No user on the session!');

      const { data, error } = await supabase
        .from('profiles')
        .select('username, full_name, avatar_url')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;

      if (mountedRef.current) {
        setUsername(data.username || '');
        setFullName(data.full_name || '');
        setAvatarUrl(data.avatar_url || 'https://img.freepik.com/free-vector/cheerful-square-character-illustration_1308-164239.jpg');
      }
    } catch (error: any) {
      Alert.alert('Error', 'Failed to fetch profile. Please try again.');
      console.error('Error fetching profile:', error.message);
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  };

  const handleUpdateProfile = useCallback(async () => {
    try {
      setLoading(true);
      if (!session?.user.id) throw new Error('No user on the session!');
      if (!isUsernameAvailable) throw new Error('Username is not available');

      let finalAvatarUrl = avatarUrl || 'https://img.freepik.com/free-vector/cheerful-square-character-illustration_1308-164239.jpg';

      if (previewImage) {
        const { data, error } = await uploadAvatar(previewImage);
        if (error) throw error;
        finalAvatarUrl = data.publicUrl;
      }

      const { error } = await updateProfileImage(username, fullName, finalAvatarUrl);
  
      if (error) throw error;
  
      updateUserProfile(finalAvatarUrl, username);
      await fetchProfile();
  
      Alert.alert('Success', 'Profile updated successfully');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', `Failed to update profile: ${error.message}`);
      console.error('Error updating profile:', error.message);
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [session?.user.id, username, fullName, avatarUrl, previewImage, isUsernameAvailable, updateProfileImage, updateUserProfile, fetchProfile]);

  const uploadAvatar = async (uri: string) => {
    try {
      const fileExt = uri.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${session?.user.id}/${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, {
          uri: uri,
          type: `image/${fileExt}`,
          name: fileName,
        } as any);

      if (uploadError) throw uploadError;

      const { data, error }: any = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      console.error('Error uploading avatar:', error.message);
      return { data: null, error };
    }
  };

  const handleImagePicker = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPreviewImage(result.assets[0].uri);
    }
  }, []);

  const checkUsernameAvailability = useCallback(
    debounce(async (username: string) => {
      if (username.length < 3) {
        setIsUsernameAvailable(false);
        return;
      }
  
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('username', username)
          .neq('id', session?.user?.id)
          .maybeSingle();
  
        if (error && error.code !== 'PGRST116') {
          console.error('Error checking username availability:', error);
          return;
        }
  
        if (mountedRef.current) {
          setIsUsernameAvailable(data === null);
        }
      } catch (error) {
        console.error('Error checking username availability:', error);
      }
    }, 300),
    [session?.user?.id]
  );

  const handleUsernameChange = useCallback((text: string) => {
    setUsername(text);
    checkUsernameAvailability(text);
  }, [checkUsernameAvailability]);

  const isUpdateButtonDisabled = useMemo(() => {
    return loading || !isUsernameAvailable || username.length < 3;
  }, [loading, isUsernameAvailable, username]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center p-4 border-b border-gray-200">
      <Pressable onPress={() => navigation.goBack()} className="mr-4">
          <ChevronLeftIcon size={24} color="gray" />
        </Pressable>
        <Text className="text-xl font-bold">Edit Profile</Text>
      </View>

      <View className="flex-1 p-4">
        <AvatarSection
          previewImage={previewImage}
          avatarUrl={avatarUrl}
          handleImagePicker={handleImagePicker}
          setPreviewImage={setPreviewImage}
        />

        <InputField
          label="Username"
          value={username}
          onChangeText={handleUsernameChange}
          placeholder="Enter username"
          error={!isUsernameAvailable ? "Username is not available" : ""}
        />

        <InputField
          label="Full Name"
          value={fullName}
          onChangeText={setFullName}
          placeholder="Enter full name"
        />

        <InputField
          label="Email"
          value={session?.user.email || ''}
          placeholder="Email"
          editable={false}
        />

        <Pressable
          className={`bg-[#F9A700] rounded-lg p-4 items-center mt-6 ${isUpdateButtonDisabled ? 'opacity-50' : ''}`}
          onPress={handleUpdateProfile}
          disabled={isUpdateButtonDisabled}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-lg font-semibold">Update Profile</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarImage: {
    width: 128,
    height: 128,
    borderRadius: 5,
  },
  cameraIconContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#F9A700',
    borderRadius: 20,
    padding: 8,
  },
  changeAvatarText: {
    marginTop: 8,
    color: '#F9A700',
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginTop: 4,
  },
  disabledInput: {
    backgroundColor: '#f0f0f0',
  },
  updateButton: {
    backgroundColor: '#F9A700',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  disabledButton: {
    opacity: 0.5,
  },
  updateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default React.memo(EditProfileScreen);