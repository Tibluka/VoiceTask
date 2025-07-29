import { useThemeColor } from '@/hooks/useThemeColor';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View, useColorScheme } from 'react-native';
import { ThemedText } from './ThemedText';

interface FinanceSectionProps {
    monthlyIncome?: number;
    monthLimit?: number;
}

export const FinanceSection: React.FC<FinanceSectionProps> = ({ monthlyIncome, monthLimit }) => {
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
                        <ThemedText style={styles.salaryLabel}>Renda Mensal</ThemedText>
                        <ThemedText style={styles.salaryValue}>
                            {monthlyIncome ? formatCurrency(monthlyIncome) : 'Não definido'}
                        </ThemedText>
                    </View>
                    <FontAwesome5 name="money-bill-wave" size={32} color="rgba(255,255,255,0.3)" />
                </View>

                <View style={styles.limitContainer}>
                    <ThemedText style={styles.limitLabel}>Limite mensal</ThemedText>
                    <ThemedText style={styles.limitValue}>
                        {monthLimit ? formatCurrency(monthLimit) : 'Não definido'}
                    </ThemedText>
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
    limitContainer: {
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
});