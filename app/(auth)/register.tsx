import { ThemedText } from '@/components/ThemedText';
import { register as registerService } from '@/services/auth/login.service';
import { Link, useRouter } from 'expo-router';
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
import { MaskedTextInput } from 'react-native-mask-text';

export default function Register() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async () => {
        if (!email || !password || !name || !phone) {
            Alert.alert('Atenção', 'Preencha todos os campos');
            return;
        }
        setLoading(true);
        try {
            await registerService(name, email, password, phone);
            Alert.alert('Sucesso', 'Conta criada com sucesso! Verifique seu e-mail para ativar a conta.', [
                { text: 'OK', onPress: () => router.replace('/(auth)/login') }
            ]);
        } catch (error: any) {
            let errorMsg = 'Ocorreu um erro ao criar a conta.';

            if (error.response?.data?.error) {
                errorMsg = error.response.data.error;
            } else if (error.message) {
                errorMsg = error.message;
            }

            Alert.alert('Erro', errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.container}
            >
                <View style={{ backgroundColor: isDark ? '#000' : '#fff' }}>
                    <ThemedText style={styles.title}>Criar conta</ThemedText>
                    <TextInput
                        placeholder="Nome"
                        placeholderTextColor={isDark ? '#888' : '#aaa'}
                        value={name}
                        onChangeText={setName}
                        style={[
                            styles.input,
                            {
                                backgroundColor: isDark ? '#1a1a1a' : '#f0f0f0',
                                color: isDark ? '#fff' : '#000',
                            },
                        ]}
                        autoCapitalize="words"
                    />
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
                    <MaskedTextInput
                        mask="(99) 99999-9999"
                        placeholder="Telefone"
                        placeholderTextColor={isDark ? '#888' : '#aaa'}
                        value={phone}
                        onChangeText={setPhone}
                        style={[
                            styles.input,
                            {
                                backgroundColor: isDark ? '#1a1a1a' : '#f0f0f0',
                                color: isDark ? '#fff' : '#000',
                            },
                        ]}
                        keyboardType="phone-pad"
                    />
                    <TextInput
                        placeholder="Senha"
                        placeholderTextColor={isDark ? '#888' : '#aaa'}
                        value={password}
                        onChangeText={setPassword}
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
                        onPress={handleRegister}
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
                            {loading ? 'Registrando...' : 'Registrar'}
                        </ThemedText>
                    </TouchableOpacity>
                    <Link href="/(auth)/login" style={{ textAlign: 'center', marginTop: 16 }}>
                        <ThemedText type='link'>Já tem conta? Entrar</ThemedText>
                    </Link>
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    envContainer: {
        padding: 8,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
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
        color: '#fff',
    },
}); 