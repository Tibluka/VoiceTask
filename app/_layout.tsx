import { Header } from '@/components/Header';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuthStore } from '@/zustand/AuthStore/useAuthStore';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AudioRecorderExample from '../components/recorder';
import Login from './(auth)/layout';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const { isLoggedIn, loadToken } = useAuthStore();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await loadToken();
      setLoading(false);
    };
    init();
  }, []);

  if (loading) {
    return (
      <View style={{
        flex: 1,
        backgroundColor: isDark ? '#000' : '#fff',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  if (!isLoggedIn) {
    return (
      <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#000' : '#fff' }}>
            <StatusBar style={isDark ? 'light' : 'dark'} />
            <Login />
          </SafeAreaView>
        </SafeAreaProvider>
      </ThemeProvider>

    );
  }

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#000' : '#fff' }}>
          <Header isDark={isDark} />
          <GestureHandlerRootView style={{ flex: 1 }}>
            <AudioRecorderExample />
          </GestureHandlerRootView>
          <StatusBar style={isDark ? 'light' : 'dark'} />
        </SafeAreaView>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}