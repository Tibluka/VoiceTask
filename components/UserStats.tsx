import { useConfigStore } from '@/zustand/ConfigStore/useConfigStore';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';

type Props = { totalGoals: number };

export const UserStats = ({ totalGoals }: Props) => {
    const cfg = useConfigStore(s => s.cfg);
    const strategy = cfg?.budgetStrategy ?? '50-30-20';

    const raw = cfg?.customPercentages;
    const values =
        strategy === 'custom' && typeof raw === 'string'
            ? JSON.parse(raw)
            : strategy === 'custom'
                ? raw ?? { needs: 0, wants: 0, investments: 0 }
                : { needs: 50, wants: 30, investments: 20 };

    return (
        <View style={styles.wrapper}>
            <View style={styles.card}>
                <ThemedText type="subtitle">Metas</ThemedText>
                <ThemedText type="defaultSemiBold" style={styles.value}>
                    {totalGoals}
                </ThemedText>
            </View>

            <View style={styles.card}>
                <ThemedText type="subtitle">Estratégia: {strategy}</ThemedText>
                <ThemedText type="default">Necessidades: {values.needs}%</ThemedText>
                <ThemedText type="default">Desejos: {values.wants}%</ThemedText>
                <ThemedText type="default">Investimentos: {values.investments}%</ThemedText>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        rowGap: 16,
        width: '100%',
    },
    card: {
        width: '100%',
        padding: 16,
        borderRadius: 12,
        backgroundColor: 'gray',
    },
    value: {
        fontSize: 32,
        marginTop: 4,
    },
});