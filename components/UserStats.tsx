import { useConfigStore } from '@/zustand/ConfigStore/useConfigStore';
import { useUserStore } from '@/zustand/UserStores/useUserStore';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';

export const UserStats = () => {
    const { user } = useUserStore();
    const { cfg, loadConfig } = useConfigStore();

    useEffect(() => {
        if (user) {
            loadConfig(user.id);
        }
    }, [user, loadConfig]);

    const values =
        cfg?.budgetStrategy === 'custom'
            ? cfg?.customPercentages
            : { needs: 50, wants: 30, investments: 20 }

    return (
        <View style={styles.wrapper}>
            <View style={styles.card}>
                <ThemedText type="subtitle">Metas</ThemedText>
                <ThemedText type="defaultSemiBold" style={styles.value}>
                    {cfg?.goals?.length || 0}
                </ThemedText>
            </View>

            <View style={styles.card}>
                <ThemedText type="subtitle">Salário</ThemedText>
                <ThemedText type="defaultSemiBold" style={styles.value}>
                    {cfg?.monthlyIncome}
                </ThemedText>
            </View>

            <View style={styles.card}>
                <ThemedText type="subtitle">Estratégia: {cfg?.budgetStrategy}</ThemedText>
                <ThemedText type="default">Necessidades: {values?.needs}%</ThemedText>
                <ThemedText type="default">Desejos: {values?.wants}%</ThemedText>
                <ThemedText type="default">Investimentos: {values?.investments}%</ThemedText>
                <ThemedText type="default">Limite mensal definito: R${cfg?.monthLimit}</ThemedText>
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