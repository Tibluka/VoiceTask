import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuthStore } from '@/zustand/AuthStore/useAuthStore';
import { Redirect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import MainTabs from './(tabs)/main-tabs';

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
      <Redirect href="/(auth)/login" />
    );
  }

  return (
    <MainTabs />
  );
}