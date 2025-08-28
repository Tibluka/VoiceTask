import { useAuthStore } from '@/zustand/AuthStore/useAuthStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

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


    try {
        const url = `${apiUrl}${endpoint}`;
        console.log(url);
        const res = await fetch(url, {
            method,
            headers,
            ...(body ? { body: isFormData ? body : JSON.stringify(body) } : {}),
        });

        if (res.status === 401 && !res.url.includes('auth/login')) {
            Alert.alert('Token expirado', 'Redirecionando para login');
            const { clearToken } = useAuthStore.getState();
            await clearToken();
        }

        if (!res.ok) {
            let errorData: any;

            try {
                errorData = await res.json();
            } catch (jsonErr) {
                const text = await res.text();
                throw new Error(`Erro ${res.status}: ${text}`);
            }

            throw { status: res.status, response: { data: errorData } };
        }

        return res.json();
    } catch (error: any) {
        throw error;
    }
};