import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';

interface StrategySectionProps {
    values: {
        needs: number;
        wants: number;
        investments: number;
    };
}

export const StrategySection: React.FC<StrategySectionProps> = ({ values }) => {
    const cardBg = useThemeColor({ light: '#f5f5f5', dark: '#1a1a1a' }, 'background');
    const textColor = useThemeColor({ light: '#333', dark: '#fff' }, 'text');
    const subtitleColor = useThemeColor({ light: '#666', dark: '#aaa' }, 'text');

    return (
        <View style={styles.strategyContainer}>
            <View style={[styles.miniCard, { backgroundColor: cardBg }]}>
                <Ionicons name="trending-up" size={20} color="#4caf50" />
                <ThemedText style={[styles.miniCardLabel, { color: subtitleColor }]}>
                    Necessidades
                </ThemedText>
                <ThemedText style={[styles.miniCardValue, { color: textColor }]}>
                    {values?.needs}%
                </ThemedText>
            </View>

            <View style={[styles.miniCard, { backgroundColor: cardBg }]}>
                <Ionicons name="heart" size={20} color="#ff6b6b" />
                <ThemedText style={[styles.miniCardLabel, { color: subtitleColor }]}>
                    Desejos
                </ThemedText>
                <ThemedText style={[styles.miniCardValue, { color: textColor }]}>
                    {values?.wants}%
                </ThemedText>
            </View>

            <View style={[styles.miniCard, { backgroundColor: cardBg }]}>
                <Ionicons name="rocket" size={20} color="#4ecdc4" />
                <ThemedText style={[styles.miniCardLabel, { color: subtitleColor }]}>
                    Investimentos
                </ThemedText>
                <ThemedText style={[styles.miniCardValue, { color: textColor }]}>
                    {values?.investments}%
                </ThemedText>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    strategyContainer: {
        flexDirection: 'row',
        gap: 8,
        marginVertical: 8,
    },
    miniCard: {
        flex: 1,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    miniCardLabel: {
        fontSize: 11,
        marginTop: 8,
        marginBottom: 4,
    },
    miniCardValue: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});