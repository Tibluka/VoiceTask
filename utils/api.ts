import AsyncStorage from '@react-native-async-storage/async-storage';

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

    console.log(apiUrl);
    

    const res = await fetch(`${apiUrl}${endpoint}`, {
        method,
        headers,
        ...(body
            ? { body: isFormData ? body : JSON.stringify(body) }
            : {}),
    });

    if (!res.ok) {
        const errorData = await res.text();
        throw new Error(`Erro ${res.status}: ${errorData}`);
    }

    return res.json();
};