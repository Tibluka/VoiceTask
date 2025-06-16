import { ThemedText } from '@/components/ThemedText';
import { fetchCurrentUser, login } from '@/services/auth/login.service';
import { useAuthStore } from '@/zustand/AuthStore/useAuthStore';
import React, { useState } from 'react';
import {
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    useColorScheme,
    View
} from 'react-native';

const env = process.env.EXPO_PUBLIC_ENVIRONMENT;
const api = process.env.EXPO_PUBLIC_API_URL;

export default function Login() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !senha) {
            Alert.alert('Atenção', 'Preencha e-mail e senha');
            return;
        }

        try {
            setLoading(true);
            const response = await login(email, senha);
            useAuthStore.getState().setToken(response.token);
            const user = await fetchCurrentUser();
            //await useUserStore.getState().setUser(user);
            console.log(response.token);

        } catch (error: any) {
            let message = 'Erro desconhecido, tente novamente.';

            const statusMatch = error.message.match(/^Erro (\d+):/);
            const statusCode = statusMatch ? Number(statusMatch[1]) : null;

            if (statusCode === 401) {
                message = 'Credenciais inválidas. Por favor, verifique seu e-mail e senha.';
            } else {
                try {
                    const parsed = JSON.parse(error.message.replace(/^Erro \d+: /, ''));
                    if (parsed.error) {
                        message = parsed.error;
                    }
                } catch {
                    message = error.message;
                }
            }

            Alert.alert('Erro no login', message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <View style={[styles.envContainer, { backgroundColor: env === 'PRODUCTION' ? '#4CAF50' : '#90CAF9', }]}>
                <ThemedText style={{ fontSize: 12 }}>{env} - {api}</ThemedText>

            </View>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={styles.container}
                >
                    <View
                        style={[
                            { backgroundColor: isDark ? '#000' : '#fff' },
                        ]}
                    >
                        <ThemedText
                            style={styles.title}
                        >
                            Bem-vindo
                        </ThemedText>

                        <TextInput
                            placeholder="Email"
                            placeholderTextColor={isDark ? '#888' : '#aaa'}
                            value={email}
                            onChangeText={setEmail}
                            style={[
                                styles.input,
                                {
                                    backgroundColor: isDark ? '#1a1a1a' : '#f0f0f0',
                                    color: isDark ? '#fff' : '#000',
                                },
                            ]}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />

                        <TextInput
                            placeholder="Senha"
                            placeholderTextColor={isDark ? '#888' : '#aaa'}
                            value={senha}
                            onChangeText={setSenha}
                            style={[
                                styles.input,
                                {
                                    backgroundColor: isDark ? '#1a1a1a' : '#f0f0f0',
                                    color: isDark ? '#fff' : '#000',
                                },
                            ]}
                            secureTextEntry
                        />

                        <TouchableOpacity
                            onPress={handleLogin}
                            disabled={loading}
                            style={[
                                styles.button,
                                {
                                    backgroundColor: isDark ? '#333' : '#444',
                                    opacity: loading ? 0.6 : 1,
                                },
                            ]}
                        >
                            <ThemedText style={styles.buttonText}>
                                {loading ? 'Entrando...' : 'Entrar'}
                            </ThemedText>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </>
    );
}

const styles = StyleSheet.create({
    envContainer: {
        padding: 8,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 32,
        textAlign: 'center',
    },
    input: {
        height: 52,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        marginBottom: 16,
    },
    button: {
        height: 52,
        borderRadius: 99,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },
    buttonText: {
        fontWeight: '600',
        fontSize: 16,
    },
});