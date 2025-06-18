import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import React from 'react'
import { useColorScheme } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

export default function NotAuthenticated() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
            <SafeAreaProvider>
                <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#000' : '#fff' }}>
                    <Stack screenOptions={{
                        headerShown: false,
                    }}>
                        <Stack.Screen name="login" />
                        <Stack.Screen name="reset-password" />
                        <Stack.Screen name="validation-code" />
                        <Stack.Screen name="password-confirmation" />
                    </Stack>
                </SafeAreaView>
            </SafeAreaProvider>
        </ThemeProvider>
    )
}
