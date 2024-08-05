import {create} from "zustand";
import {persist, createJSONStorage} from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Session, User } from "@supabase/supabase-js";

interface UserStore {
    user: User | null;
    setUser: (user: User | null) => void;
    session: Session | null;
    setSession: (session: Session | null) => void;
    isLoggedIn: Boolean;
    setIsLoggedIn: (isLoggedIn: Boolean) => void;
    isOnborded: Boolean;
    avatarUrl: string;
    username: string;
    setAvatarUrl: (url: string) => void;
    setUsername: (username: string) => void;
    updateUserProfile: (avatarUrl: string, username: string) => void;
}

export const useUserStore = create(
    persist<UserStore>(
        (set) => ({
            user: null,
            session: null,
            isLoggedIn: false,
            isOnborded: false,
            avatarUrl: "",
            username: "",
            setUser: (user: User | null) => set((state) => ({user})),
            setIsLoggedIn: (isLoggedIn: Boolean) => set((state) => ({isLoggedIn})),
            setSession: (session: Session | null) => set((state) => ({session})),
            setAvatarUrl: (url: string) => set((state) => ({avatarUrl: url})),
            setUsername: (username: string) => set((state) => ({username})),
            updateUserProfile: (avatarUrl: string, username: string) => set((state) => ({
                avatarUrl,
                username,
                user: state.user ? {...state.user, user_metadata: {...state.user.user_metadata, avatar_url: avatarUrl, username}} : null
            })),
        }),
        {
            name: "fintechcrypto-user-store",
            storage: createJSONStorage(() => AsyncStorage)
        }
    )
);