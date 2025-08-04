import { useThemeColor } from '@/hooks/useThemeColor';
import { useSpendingStore } from '@/zustand/SpendingStore/useSpendingStore';
import { useUserStore } from '@/zustand/UserStores/useUserStore';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View, useColorScheme } from 'react-native';
import { ThemedText } from './ThemedText';

interface FinanceSectionProps {
    monthLimit?: number;
}

export const FinanceSection: React.FC<FinanceSectionProps> = ({ monthLimit }) => {
    const { totalSpent, predictedTotal, loadingTotal, fetchData } = useSpendingStore();
    const { user } = useUserStore();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const textColor = useThemeColor({ light: '#333', dark: '#fff' }, 'text');

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
        }).format(value);
    };

    useEffect(() => {
        if (user) fetchData(user.id);
    }, [user])

    return (
        <>
            <View style={styles.sectionHeader}>
                <MaterialIcons name="account-balance-wallet" size={24} color={textColor} />
                <ThemedText type="subtitle" style={styles.sectionTitle}>
                    Finanças
                </ThemedText>
            </View>

            <LinearGradient
                colors={isDark ? ['#1e3c72', '#2a5298'] : ['#667eea', '#764ba2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.salaryCard}
            >
                <View style={styles.salaryContent}>
                    <View>
                        <ThemedText style={styles.salaryLabel}>Total gasto esse mês</ThemedText>
                        <ThemedText style={styles.salaryValue}>
                            {
                                loadingTotal ?
                                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                        <ActivityIndicator size={28} color="#fff" />
                                    </View> :
                                    <>{totalSpent ? formatCurrency(totalSpent) : 'Não definido'}</>
                            }
                        </ThemedText>
                    </View>
                    <FontAwesome5 name="money-bill-wave" size={32} color="rgba(255,255,255,0.3)" />
                </View>

                <View style={styles.limitContainerRow}>
                    <View>
                        <ThemedText style={styles.limitLabel}>Limite mensal</ThemedText>
                        <ThemedText style={styles.limitValue}>
                            {monthLimit ? formatCurrency(monthLimit) : 'Não definido'}
                        </ThemedText>
                    </View>
                    <View style={styles.predictedTotalContainer}>
                        <ThemedText style={styles.limitLabel}>Previsto</ThemedText>
                        <ThemedText style={styles.predictedTotal}>
                            {typeof predictedTotal === 'number' ? formatCurrency(predictedTotal) : 'Não definido'}
                        </ThemedText>
                    </View>
                </View>
            </LinearGradient>
        </>
    );
};

const styles = StyleSheet.create({
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 8,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
    },
    salaryCard: {
        padding: 20,
        borderRadius: 20,
        marginBottom: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    salaryContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    salaryLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        marginBottom: 4,
    },
    salaryValue: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
    },
    // Nova linha para exibir limite e previsto lado a lado
    limitContainerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.2)',
    },
    limitContainer: {
        // Mantido para compatibilidade, mas não usado mais
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.2)',
    },
    limitLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        marginBottom: 4,
    },
    limitValue: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    predictedTotalContainer: {
        alignItems: 'flex-end',
    },
    predictedTotal: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});