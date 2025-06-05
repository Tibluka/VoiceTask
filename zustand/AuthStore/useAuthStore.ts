import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

type AuthState = {
    token: string | null;
    isLoggedIn: boolean;
    setToken: (token: string) => Promise<void>;
    clearToken: () => Promise<void>;
    loadToken: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
    token: null,
    isLoggedIn: false,

    setToken: async (token: string) => {
        await AsyncStorage.setItem('token', token);
        set({ token, isLoggedIn: true });
    },

    clearToken: async () => {
        await AsyncStorage.removeItem('token');
        set({ token: null, isLoggedIn: false });
    },

    loadToken: async () => {
        const storedToken = await AsyncStorage.getItem('token');
        set({ token: storedToken, isLoggedIn: !!storedToken });
    },
}));