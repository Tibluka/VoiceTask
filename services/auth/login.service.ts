import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiRequest } from '../../utils/api';

type LoginResponse = {
    token: string;
};

export const login = async (email: string, password: string) => {
    try {
        const response = await apiRequest('/auth/login', 'POST', {
            email,
            password,
        });

        const { token } = response as LoginResponse;

        if (!token) {
            throw new Error('Token não encontrado na resposta.');
        }

        await AsyncStorage.setItem('token', token);

        return response;
    } catch (error) {
        console.error('Erro no login:', error);
        throw error;
    }
};

export const logout = async () => {
    try {
        await AsyncStorage.removeItem('token');
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
    }
};

export const isLoggedIn = async (): Promise<boolean> => {
    const token = await AsyncStorage.getItem('token');
    return !!token;
};

export async function fetchCurrentUser() {
    const response = await apiRequest(`/auth/me`, 'GET', null);
    return response;
}