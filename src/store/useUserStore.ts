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
}

export const useUserStore = create(
    persist<UserStore>(
        (set) => ({
            user: null,
            session: null,
            isLoggedIn: false,
            isOnborded: false,
            setUser: (user: User | null) => set((state) => ({user})),
            setIsLoggedIn: (isLoggedIn: Boolean) => set((state) => ({isLoggedIn})),
            setSession: (session: Session | null) => set((state) => ({session})),
        }),
        {
            name: "fintechcrypto-user-store",
            storage: createJSONStorage(() => AsyncStorage)
        }
    )
);