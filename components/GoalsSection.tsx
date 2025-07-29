import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';

interface GoalsSectionProps {
    goalsCount: number;
}

export const GoalsSection: React.FC<GoalsSectionProps> = ({ goalsCount }) => {
    const cardBg = useThemeColor({ light: '#f5f5f5', dark: '#1a1a1a' }, 'background');
    const textColor = useThemeColor({ light: '#333', dark: '#fff' }, 'text');
    const subtitleColor = useThemeColor({ light: '#666', dark: '#aaa' }, 'text');

    return (
        <View style={[styles.goalsCard, { backgroundColor: cardBg }]}>
            <View style={styles.goalsHeader}>
                <View style={styles.goalsIconContainer}>
                    <Ionicons name="flag" size={24} color="#ffd93d" />
                </View>
                <View style={styles.goalsInfo}>
                    <ThemedText style={[styles.goalsLabel, { color: subtitleColor }]}>
                        Metas ativas
                    </ThemedText>
                    <ThemedText style={[styles.goalsValue, { color: textColor }]}>
                        {goalsCount}
                    </ThemedText>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    goalsCard: {
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    goalsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    goalsIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 217, 61, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    goalsInfo: {
        flex: 1,
    },
    goalsLabel: {
        fontSize: 14,
        marginBottom: 2,
    },
    goalsValue: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});