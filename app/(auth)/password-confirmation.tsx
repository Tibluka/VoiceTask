// app/(auth)/password-confirmation.tsx

import { ThemedText } from '@/components/ThemedText';
import { resetPassword } from '@/services/auth/reset-password.service';
import { Ionicons } from '@expo/vector-icons';
import { CommonActions, useNavigation } from '@react-navigation/native';
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
    useColorScheme,
    View,
} from 'react-native';

type Params = { email: string; code: string };

export default function PasswordConfirmationScreen() {
    const router = useRouter();
    const { email, code } = useLocalSearchParams<Params>();
    const navigation = useNavigation();
    const isDark = useColorScheme() === 'dark';

    const [newPassword, setNewPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async () => {
        if (!newPassword || !confirm) {
            Alert.alert('Atenção', 'Preencha todos os campos');
            return;
        }
        if (newPassword !== confirm) {
            Alert.alert('Atenção', 'As senhas não coincidem');
            return;
        }

        try {
            setLoading(true);
            try {
                await resetPassword(code, email, newPassword);
                setIsSuccess(true);
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
        } catch (err: any) {
            Alert.alert('Erro', err.message || 'Falha ao redefinir senha.');
        } finally {
            setLoading(false);
        }
    };

    const goToLoginClearingHistory = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'login' }],
            })
        );
    };

    if (isSuccess) {
        return (
            <View style={[styles.successContainer, { backgroundColor: isDark ? '#000' : '#fff' }]}>
                <Ionicons name="checkmark-circle-outline" size={80} color="#4A90E2" style={styles.icon} />
                <ThemedText type="title" style={styles.successTitle}>
                    Senha redefinida!
                </ThemedText>
                <ThemedText type="default" style={styles.successSubtitle}>
                    Agora você já pode entrar com sua nova senha.
                </ThemedText>
                <TouchableOpacity
                    style={[styles.successButton, { backgroundColor: '#4A90E2' }]}
                    onPress={goToLoginClearingHistory}
                >
                    <ThemedText style={styles.successButtonText}>Ir para Login</ThemedText>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                behavior={Platform.select({ ios: 'padding', android: undefined })}
                style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}
            >
                <ThemedText type="title" style={styles.title}>
                    Redefinir senha
                </ThemedText>

                <TextInput
                    placeholder="Nova senha"
                    placeholderTextColor={isDark ? '#888' : '#aaa'}
                    secureTextEntry
                    value={newPassword}
                    onChangeText={setNewPassword}
                    style={[
                        styles.input,
                        {
                            backgroundColor: isDark ? '#1a1a1a' : '#f0f0f0',
                            color: isDark ? '#fff' : '#000',
                        },
                    ]}
                    editable={!loading}
                />

                <TextInput
                    placeholder="Confirme a nova senha"
                    placeholderTextColor={isDark ? '#888' : '#aaa'}
                    secureTextEntry
                    value={confirm}
                    onChangeText={setConfirm}
                    style={[
                        styles.input,
                        {
                            backgroundColor: isDark ? '#1a1a1a' : '#f0f0f0',
                            color: isDark ? '#fff' : '#000',
                        },
                    ]}
                    editable={!loading}
                />

                <TouchableOpacity
                    style={[styles.button, loading && { opacity: 0.6 }]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    <ThemedText style={styles.buttonText}>
                        {loading ? 'Aguarde...' : 'Redefinir senha'}
                    </ThemedText>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, justifyContent: 'center' },
    title: { marginBottom: 16, textAlign: 'center' },
    info: { marginBottom: 8, textAlign: 'center' },
    bold: { fontWeight: 'bold' },
    input: { height: 52, borderRadius: 12, paddingHorizontal: 16, fontSize: 16, marginBottom: 16 },
    button: { height: 52, borderRadius: 99, justifyContent: 'center', alignItems: 'center', backgroundColor: '#4A90E2', marginTop: 16 },
    buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },

    successContainer: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
    icon: { marginBottom: 24 },
    successTitle: { marginBottom: 12, textAlign: 'center' },
    successSubtitle: { marginBottom: 32, textAlign: 'center', lineHeight: 20 },
    successButton: { height: 52, borderRadius: 99, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
    successButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});