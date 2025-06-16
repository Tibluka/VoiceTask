import { useAuthStore } from '@/zustand/AuthStore/useAuthStore';
import React from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './ThemedText';

type HeaderProps = {
    isDark: boolean;
    selectedIndex: number;
};

export const Header: React.FC<HeaderProps> = ({ isDark, selectedIndex }) => {
    const { clearToken } = useAuthStore();

    const handleLogout = () => {
        Alert.alert('Sair', 'Deseja realmente sair?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Sair',
                style: 'destructive',
                onPress: () => clearToken(),
            },
        ]);
    };

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#111' : '#f5f5f5' }]}>
            <ThemedText style={[styles.title]}>Registros</ThemedText>
            <TouchableOpacity onPress={handleLogout} style={styles.button}>
                <ThemedText style={styles.buttonText}>Sair</ThemedText>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 16,
        paddingBottom: 16,
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 4,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#E53935',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
    },
});
