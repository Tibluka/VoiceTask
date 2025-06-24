import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import React from 'react'
import { useColorScheme } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

export default function Authenticated() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

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
