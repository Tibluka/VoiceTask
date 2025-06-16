import { fetchCurrentUser } from '@/services/auth/login.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

type User = {
    id: string;
    name: string;
    email: string;
    avatar: string;
    bio: string;
};

type UserState = {
    user: User | null;

    /** Grava usuário em memória + AsyncStorage */
    setUser: (user: User) => Promise<void>;

    /** Limpa usuário em memória + AsyncStorage */
    clearUser: () => Promise<void>;

    /** Carrega usuário a partir do AsyncStorage (sem network) */
    loadUser: () => Promise<void>;

    /** (Novo) Busca /auth/me usando o token salvo e atualiza o usuário */
    refreshUser: () => Promise<void>;
};

const USER_KEY = 'current_user';
const TOKEN_KEY = 'token'; // mesmo nome usado no AuthStore

export const useUserStore = create<UserState>(set => ({
    user: null,

    setUser: async (user: User) => {
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
        set({ user });
    },

    clearUser: async () => {
        await AsyncStorage.removeItem(USER_KEY);
        set({ user: null });
    },

    loadUser: async () => {
        try {
            const stored = await AsyncStorage.getItem(USER_KEY);
            if (stored) {
                set({ user: JSON.parse(stored) as User });
            } else {
                const user = await fetchCurrentUser();
                if (user) {
                    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
                    set({ user: user });
                }
            }
        } catch (error) {
            console.error('Erro ao carregar usuário:', error);
        }
    },

    refreshUser: async () => {
        try {
            // 1. Recupera o token JWT salvo pelo AuthStore
            const token = await AsyncStorage.getItem(TOKEN_KEY);
            if (!token) {
                // Nenhum token → desloga o usuário
                await AsyncStorage.removeItem(USER_KEY);
                set({ user: null });
                return;
            }

            // 2. Chama o endpoint protegido /auth/me
            const res = await fetch(`${apiUrl}/auth/me`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            });

            if (!res.ok) {
                // Token expirado ou inválido → limpa usuário
                await AsyncStorage.removeItem(USER_KEY);
                set({ user: null });
                return;
            }

            // 3. Salva usuário retornado
            const user: User = await res.json();
            await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
            set({ user });
        } catch (err) {
            console.warn('Erro ao atualizar usuário:', err);
            // mantém o usuário anterior em caso de falha de rede
        }
    },
}));