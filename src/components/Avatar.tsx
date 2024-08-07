import React, { useEffect, useState, useCallback } from 'react';
import { View, Image, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useUserStore } from '../store/useUserStore';

interface AvatarProps {
  size: number;
  url: string | null;
  onUpload?: (filePath: string) => void;
  showUpload?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ size, url, onUpload, showUpload = false }) => {
  const avatarUrl = useUserStore(state => state.avatarUrl);
  const [localAvatarUrl, setLocalAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    setLocalAvatarUrl(avatarUrl || url || null);
  }, [avatarUrl, url]);

  const handleUpload = useCallback(() => {
    if (onUpload) {
      onUpload(localAvatarUrl || '');
    }
  }, [onUpload, localAvatarUrl]);

  return (
    <View>
      {localAvatarUrl ? (
        <Image
          source={{ uri: localAvatarUrl }}
          style={[styles.avatar, { width: size, height: size }]}
        />
      ) : (
        <View style={[styles.avatarPlaceholder, { width: size, height: size }]}>
          <MaterialIcons name="person" size={size * 0.5} color="#ffffff" />
        </View>
      )}
      {showUpload && onUpload && (
        <Pressable style={styles.uploadButton} onPress={handleUpload}>
          <MaterialIcons name="add" size={20} color="#ffffff" />
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

export default React.memo(Avatar);