import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuthStore } from '@/zustand/AuthStore/useAuthStore';
import { Tabs } from 'expo-router';
import React from 'react';
import { Alert, Pressable, Text } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja realmente sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => useAuthStore.getState().clearToken(),
      },
    ]);
  };

  return (
    <Tabs
    screenOptions={{
      tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
      tabBarStyle: {
        position: 'relative',
      },
      headerStyle: {

      },
      headerTitleStyle: {
        fontWeight: '600',
      },
      headerRight: () => (
        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => ({
            opacity: pressed ? 0.5 : 1,
            paddingHorizontal: 16,
          })}>
          <Text style={{ color: Colors[colorScheme ?? 'light'].tint, fontWeight: '600' }}>
            Logout
          </Text>
        </Pressable>
      ),
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Registros',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}