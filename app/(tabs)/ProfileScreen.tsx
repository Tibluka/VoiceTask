import { ThemedText } from '@/components/ThemedText';
import { UserStats } from '@/components/UserStats';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAuthStore } from '@/zustand/AuthStore/useAuthStore';
import { useUserStore } from '@/zustand/UserStores/useUserStore';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
    useColorScheme
} from 'react-native';

export default function ProfileScreen() {
    const { user, refreshUser, loadUser, clearUser } = useUserStore();
    const { clearToken } = useAuthStore();
    const systemScheme = useColorScheme();
    const [theme, setTheme] = useState(systemScheme); // estado local de tema
    const bg = useThemeColor({ light: '#fff', dark: '#000' }, 'background');
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await refreshUser();
        setRefreshing(false);
    }, []);

    useEffect(() => {
        loadUser();
    }, []);

    const logout = () =>
        Alert.alert('Sair', 'Deseja realmente sair?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Sair',
                style: 'destructive',
                onPress: () => {
                    clearToken();
                    clearUser();
                },
            },
        ]);

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: bg }}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor={theme === 'dark' ? '#fff' : '#000'}
                />
            }
            contentContainerStyle={styles.container}
        >
            <View style={styles.profileHeader}>
                <Image
                    source={
                        user?.avatar
                            ? { uri: user.avatar }
                            : require('@/assets/default-avatar.png')
                    }
                    style={styles.avatar}
                />
                <View style={{marginLeft: 24}}>
                    <ThemedText type="title" style={styles.name}>
                        {user?.name}
                    </ThemedText>

                    {user?.bio && (
                        <ThemedText type="default" style={styles.bio}>
                            {user.bio}
                        </ThemedText>
                    )}
                </View>
            </View>

            <UserStats />

            <View style={styles.logoutWrapper}>
                <TouchableOpacity onPress={logout}>
                    <MaterialIcons name="logout" size={28} color="#e53935" />
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 40,
        paddingTop: 60,
        paddingHorizontal: 24,
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: 32,
        flexDirection: 'row'
    },
    avatar: {
        width: 96,
        height: 96,
        borderRadius: 48,
        marginBottom: 12,
    },
    name: {
        textAlign: 'center',
        marginBottom: 4,
    },
    bio: {
        textAlign: 'center',
        color: '#666',
        marginTop: 8,
        lineHeight: 20,
    },
    logoutWrapper: {
        marginTop: 32,
        alignItems: 'center',
    },
    logoutText: {
        fontSize: 16,
        color: '#e53935',
        textDecorationLine: 'underline',
    }
});