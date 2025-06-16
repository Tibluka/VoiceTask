import { ThemedText } from '@/components/ThemedText';
import { UserStats } from '@/components/UserStats';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAuthStore } from '@/zustand/AuthStore/useAuthStore';
import { useUserStore } from '@/zustand/UserStores/useUserStore';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    View,
    useColorScheme
} from 'react-native';

export default function ProfileScreen() {
    const { user, refreshUser, loadUser, clearUser } = useUserStore();
    const { clearToken } = useAuthStore();
    const colorScheme = useColorScheme();
    const bg = useThemeColor({ light: '#fff', dark: '#000' }, 'background');

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await refreshUser();
        setRefreshing(false);
    }, []);

    const handleLogout = () => {
        Alert.alert('Sair', 'Deseja realmente sair?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Sair', style: 'destructive', onPress: () => {
                    clearToken()
                    clearUser()
                }
            },
        ]);
    };

    useEffect(() => {
        loadUser(); // carregar ao abrir o app
    }, []);

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: bg }}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor={colorScheme === 'dark' ? '#fff' : '#000'}
                />
            }
            contentContainerStyle={styles.container}
        >
            <View style={styles.header}>
                <Image
                    source={{ uri: user?.avatar }}
                    style={styles.avatar}
                />
                <View style={styles.headerDescription}>
                    <ThemedText type="title" style={styles.username}>
                        {user?.name}
                    </ThemedText>

                    <UserStats totalGoals={42} />

                </View>
            </View>
            
            <ThemedText type="default" style={styles.username}>
                {user?.bio}
            </ThemedText>

        </ScrollView >
    );
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 40,
        paddingTop: 60,
        paddingHorizontal: 16,
        alignItems: 'flex-start',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24
    },
    headerDescription: {
        marginLeft: 24
    },
    avatar: { width: 96, height: 96, borderRadius: 48 },
    username: {
        marginTop: 8
    },
    stats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginVertical: 24,
    },
    logoutButton: {
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 20,
        backgroundColor: '#4A90E2',
    },
    logoutButtonDark: {
        backgroundColor: '#1e3a5f',
    },
    logoutText: {
        color: '#fff',
    },
    logoutTextDark: {
        color: '#ccc',
    },
});
