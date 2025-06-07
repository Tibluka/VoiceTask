import { useAuthStore } from '@/zustand/AuthStore/useAuthStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

Alert.alert('url', apiUrl)

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

export const apiRequest = async (
    endpoint: string,
    method: Method = 'GET',
    body?: any,
    isFormData = false
) => {
    const token = await AsyncStorage.getItem('token');

    const headers: Record<string, string> = {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    console.log(apiUrl);

    try {
        const res = await fetch(`${apiUrl}${endpoint}`, {
            method,
            headers,
            ...(body
                ? { body: isFormData ? body : JSON.stringify(body) }
                : {}),
        });

        if (res.status === 401) {
            Alert.alert('Token expired', 'Redirecting to login')
            const { clearToken } = useAuthStore.getState();
            await clearToken();
        }

        if (!res.ok) {
            const errorData = await res.text();
            throw new Error(`Erro ${res.status}: ${errorData}`);
        }

        return res.json();

    } catch (error) {
        console.error('Erro na requisição:', error);
        throw error;
    }
};