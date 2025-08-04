// app/_layout.tsx - Versão atualizada com WebSocket
import { websocketService } from '@/services/websocket/websocket.service'
import { useAuthStore } from '@/zustand/AuthStore/useAuthStore'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import * as Notifications from 'expo-notifications'
import { Stack } from 'expo-router'
import React, { useEffect } from 'react'
import { useColorScheme } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

export default function Authenticated() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const { isLoggedIn } = useAuthStore();

    useEffect(() => {
        // Configurar handler de notificações recebidas quando app está aberto
        const subscription = Notifications.addNotificationReceivedListener(notification => {
            console.log('Notificação recebida:', notification);
        });

        // Configurar handler de resposta a notificações
        const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
            console.log('Resposta à notificação:', response);
            // Aqui você pode navegar para uma tela específica baseada na notificação
            const data = response.notification.request.content.data;

            if (data.billId) {
                // Navegar para a tela de contas fixas
                // router.push(`/bills/${data.billId}`);
            }
        });

        // Conectar ao WebSocket se estiver logado
        if (isLoggedIn) {
            websocketService.connect();
        }

        return () => {
            subscription.remove();
            responseSubscription.remove();
            if (!isLoggedIn) {
                websocketService.disconnect();
            }
        };
    }, [isLoggedIn]);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
                <SafeAreaProvider>
                    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#000' : '#fff' }}>
                        <Stack screenOptions={{
                            headerShown: false,
                        }}>
                            <Stack.Screen name="main-tabs" />
                            <Stack.Screen name="profile-screen" />
                        </Stack>
                    </SafeAreaView>
                </SafeAreaProvider>
            </ThemeProvider>
        </GestureHandlerRootView>
    )
}