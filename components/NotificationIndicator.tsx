// components/NotificationIndicator.tsx
import { useColorScheme } from '@/hooks/useColorScheme';
import { useWebSocket } from '@/services/websocket/websocket.service';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';

export function NotificationIndicator() {
    const { isConnected } = useWebSocket();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    if (!isConnected) return null;

    return (
        <View style={styles.container}>
            <View style={[styles.dot, { backgroundColor: '#4CAF50' }]} />
            <ThemedText style={[styles.text, { color: isDark ? '#fff' : '#000' }]}>
                Notificações ativas
            </ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        borderRadius: 16,
        marginHorizontal: 16,
        marginTop: 8,
        position: 'absolute'
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    text: {
        fontSize: 12,
        fontWeight: '500',
    },
});