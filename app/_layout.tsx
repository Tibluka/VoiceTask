import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Login from './(auth)/layout';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const apiUrl = process.env.API_URL;

  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  // Simulação de verificação de login (substituir por lógica real)
  useEffect(() => {
    const checkAuth = async () => {
      // Simule uma verificação no storage ou API
      const isAuthenticated = null; // aqui você coloca sua lógica real
      setLoggedIn(isAuthenticated);
    };
    checkAuth();
  }, []);

  if (loggedIn === null) {
    // Tela de loading enquanto verifica login
    return (
      <View style={{ flex: 1, backgroundColor: isDark ? '#000' : '#fff', justifyContent: 'center', alignItems: 'center' }}>
        {/* Pode colocar um spinner */}
        <Text style={{color: 'white'}}>{apiUrl}</Text>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  if (loggedIn === false) {
    return (
      <View style={{ flex: 1, backgroundColor: isDark ? '#000' : '#fff', justifyContent: 'center', alignItems: 'center' }}>
        <Login />
      </View>
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
