import { ThemedText } from '@/components/ThemedText';
import { validateCode } from '@/services/auth/reset-password.service';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
    useColorScheme
} from 'react-native';

export default function ValidationCode() {
    const params = useLocalSearchParams<{ email: string }>();
    const router = useRouter();

    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!code.trim()) {
            Alert.alert('Atenção', 'Informe o código de validação.');
            return;
        }

        setLoading(true);
        try {
            const success = await validateCode(code, params.email);

            if (success) {
                router.push({ pathname: '/password-confirmation', params: { email: params.email, code } });
            } else {
                Alert.alert('Erro', 'Não foi possível iniciar a redefinição de senha.');
            }
        } catch (error: any) {
            let errorMsg = 'Falha ao validar o código.';

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

                <ThemedText type="title" style={styles.title}>
                    Código de validação
                </ThemedText>
                <ThemedText type="default" style={styles.subtitle}>
                    Digite o código que enviamos para o e-mail <ThemedText type="bold" style={styles.subtitle}>{params.email}.
                    </ThemedText>
                </ThemedText>
                <ThemedText type="default" style={styles.subtitle}>
                    Lembre-se de verificar na caixa de SPAM.
                </ThemedText>


                <TextInput
                    placeholder="Código de validação"
                    placeholderTextColor={isDark ? '#888' : '#aaa'}
                    value={code}
                    onChangeText={setCode}
                    style={[
                        styles.input,
                        {
                            backgroundColor: isDark ? '#1a1a1a' : 'white',
                            color: isDark ? '#fff' : '#000',
                        },
                    ]}
                    keyboardType="number-pad"
                    autoCapitalize="none"
                />

                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <ThemedText style={styles.buttonText}>
                        {loading ? 'Validando...' : 'Validar código'}
                    </ThemedText>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    title: {
        marginBottom: 8,
    },
    subtitle: {
        marginBottom: 24,
    },
    input: {
        height: 52,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        marginBottom: 24,
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