import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuthStore } from '@/zustand/AuthStore/useAuthStore';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
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
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style={isDark ? 'light' : 'dark'} />
        </SafeAreaView>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}