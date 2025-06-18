import { ThemedText } from '@/components/ThemedText';
import { sendValidationCode } from '@/services/auth/reset-password.service';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';

export default function ResetPasswordScreen() {
    const router = useRouter();
    const isDark = useColorScheme() === 'dark';

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleReset = async () => {
        if (!email.trim()) {
            Alert.alert('Atenção', 'Informe seu e-mail');
            return;
        }
        setLoading(true);
        try {
            const success = await sendValidationCode(email);
            if (success) {
                router.push({ pathname: '/validation-code', params: { email } });
            } else {
                Alert.alert('Erro', 'Não foi possível iniciar a redefinição de senha.');
            }
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível iniciar a redefinição de senha.');
        } finally {
            setLoading(false);
        }

    };

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
            <ThemedText type="title">Recuperar senha</ThemedText>

            <TextInput
                placeholder="Seu e-mail"
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
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
            />

            <TouchableOpacity
                style={[styles.button, loading && { opacity: 0.6 }]}
                onPress={handleReset}
                disabled={loading}
            >
                <ThemedText style={styles.buttonText}>
                    {loading ? 'Enviando...' : 'Enviar'}
                </ThemedText>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    input: {
        height: 52,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        marginVertical: 16,
    },
    button: {
        height: 52,
        borderRadius: 99,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4A90E2',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});