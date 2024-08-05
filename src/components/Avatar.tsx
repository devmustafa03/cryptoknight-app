import React, { useEffect, useState } from 'react';
import { View, Image, ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/src/lib/supabase';
import { MaterialIcons } from '@expo/vector-icons';

interface AvatarProps {
  size: number;
  url: string | null;
  onUpload: (filePath: string) => void;
  showUpload?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ size, url, onUpload, showUpload }) => {
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  async function downloadImage(path: string) {
		try {
			const { data, error } = supabase.storage
				.from('avatars')
				.getPublicUrl(path) as any;
	
			if (error) throw error;
			
			if (data && data.publicUrl) {
				setAvatarUrl(data.publicUrl);
			} else {
				throw new Error('Public URL not found');
			}
		} catch (error) {
			console.error('Error downloading image: ', error);
			setAvatarUrl('https://img.freepik.com/free-vector/cheerful-square-character-illustration_1308-164239.jpg?w=826&t=st=1722856773~exp=1722857373~hmac=8af25cd403de549ec8e6feec3efdc18f39b897f4f30d2cc74dbcc074faa50f66');
		}
	}

  async function uploadAvatar() {
    try {
      setUploading(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const image = result.assets[0];
        const fileExt = image.uri.split('.').pop();
        const filePath = `${Date.now()}.${fileExt}`;

        const formData = new FormData();
        formData.append('file', {
          uri: image.uri,
          name: filePath,
          type: `image/${fileExt}`,
        } as any);

        const { data, error } = await supabase.storage
          .from('avatars')
          .upload(filePath, formData);

        if (error) throw error;

        onUpload(data.path);
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
    } finally {
      setUploading(false);
    }
  }

  return (
    <View style={{ width: size, height: size }}>
      {avatarUrl ? (
        <Image
          source={{ uri: avatarUrl }}
          style={[styles.avatar, { width: size, height: size }]}
        />
      ) : (
        <View style={[styles.avatarPlaceholder, { width: size, height: size }]}>
          <ActivityIndicator size="small" color="#0000ff" />
        </View>
      )}
      {showUpload && (
        <Pressable style={styles.uploadButton} onPress={uploadAvatar} disabled={uploading}>
          {uploading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <MaterialIcons name="add-a-photo" size={20} color="#ffffff" />
          )}
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 5,
  },
  avatarPlaceholder: {
    backgroundColor: '#e1e1e1',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  uploadButton: {
    position: 'absolute',
    right: -5,
    bottom: -5,
    backgroundColor: '#3498db',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Avatar;