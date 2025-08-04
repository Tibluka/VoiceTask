import { useThemeColor } from '@/hooks/useThemeColor';
import { FixedBill, FixedBillsSectionProps } from '@/interfaces/FixedBills';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, TouchableOpacity, View, useColorScheme } from 'react-native';
import { ThemedText } from './ThemedText';

export const FixedBillsSection: React.FC<FixedBillsSectionProps> = ({ fixedBills, onBillPaid }) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const cardBg = useThemeColor({ light: '#f5f5f5', dark: '#1a1a1a' }, 'background');
    const textColor = useThemeColor({ light: '#333', dark: '#fff' }, 'text');
    const subtitleColor = useThemeColor({ light: '#666', dark: '#aaa' }, 'text');

    if (!fixedBills || fixedBills.length === 0) return null;

    // Filtra apenas contas ativas
    const activeBills = fixedBills.filter(b => b.status === 'ACTIVE');
    if (activeBills.length === 0) return null;

    // Calcula o status de pagamento do mês atual
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

    const billsWithStatus = activeBills.map((bill: FixedBill) => {
        const currentPayment = bill.paymentHistory?.find(p => p.month === currentMonth);
        return {
            ...bill,
            isPaid: currentPayment?.paid || false,
            paidDate: currentPayment?.paidDate
        };
    });

    // Calcula estatísticas
    const totalAmount = billsWithStatus.reduce((sum, bill) => sum + bill.amount, 0);
    const paidBills = billsWithStatus.filter(b => b.isPaid);
    const paidAmount = paidBills.reduce((sum, bill) => sum + bill.amount, 0);
    const pendingBills = billsWithStatus.filter(b => !b.isPaid);
    const pendingAmount = pendingBills.reduce((sum, bill) => sum + bill.amount, 0);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
        }).format(value);
    };

    const getCategoryIcon = (category: string): any => {
        const icons: Record<string, string> = {
            'HOUSING': 'home',
            'UTILITIES': 'flash-on',
            'TRANSPORTATION': 'directions-car',
            'INSURANCE': 'security',
            'EDUCATION': 'school',
            'ENTERTAINMENT': 'tv',
            'HEALTH': 'local-hospital',
            'OTHER': 'receipt'
        };
        return icons[category] || 'receipt';
    };

    return (
        <>
            <View style={[styles.sectionHeader, { marginTop: 24 }]}>
                <MaterialIcons name="receipt-long" size={24} color={textColor} />
                <ThemedText type="subtitle" style={styles.sectionTitle}>
                    Contas Fixas
                </ThemedText>
            </View>

            <View style={styles.statsContainer}>
                <LinearGradient
                    colors={isDark ? ['#1b5e20', '#2e7d32'] : ['#e8f5e9', '#c8e6c9']}
                    style={styles.statCard}
                >
                    <ThemedText style={[styles.statValue, { color: isDark ? 'white' : 'black' }]}>
                        {formatCurrency(totalAmount)}
                    </ThemedText>
                    <ThemedText style={[styles.statLabel, { color: isDark ? 'white' : 'black' }]}>
                        Total Mensal
                    </ThemedText>
                </LinearGradient>

                <View style={styles.statsRight}>
                    <View style={[styles.miniStatCard, { backgroundColor: cardBg }]}>
                        <View style={styles.miniStatRow}>
                            <Ionicons name="checkmark-circle" size={16} color="#4caf50" />
                            <ThemedText style={[styles.miniStatLabel, { color: subtitleColor }]}>
                                Pagas
                            </ThemedText>
                        </View>
                        <ThemedText style={[styles.miniStatValue, { color: textColor }]}>
                            {paidBills.length} • {formatCurrency(paidAmount)}
                        </ThemedText>
                    </View>

                    <View style={[styles.miniStatCard, { backgroundColor: cardBg }]}>
                        <View style={styles.miniStatRow}>
                            <Ionicons name="time-outline" size={16} color="#ff9800" />
                            <ThemedText style={[styles.miniStatLabel, { color: subtitleColor }]}>
                                Pendentes
                            </ThemedText>
                        </View>
                        <ThemedText style={[styles.miniStatValue, { color: textColor }]}>
                            {pendingBills.length} • {formatCurrency(pendingAmount)}
                        </ThemedText>
                    </View>
                </View>
            </View>

            {/* Lista de Contas */}
            <View style={styles.billsList}>
                {billsWithStatus
                    .sort((a, b) => {
                        // Primeiro ordena por status (pendentes primeiro)
                        if (a.isPaid !== b.isPaid) return a.isPaid ? 1 : -1;
                        // Depois por dia de vencimento
                        return a.dueDay - b.dueDay;
                    })
                    .map((bill) => (
                        <TouchableOpacity disabled={bill.isPaid} onPress={() => onBillPaid(bill)}
                            key={bill.billId}>
                            <View
                                style={[
                                    styles.billCard,
                                    { backgroundColor: cardBg },
                                    bill.isPaid && styles.billCardPaid
                                ]}
                            >
                                <View style={styles.billHeader}>
                                    <View style={styles.billInfo}>
                                        <View style={[
                                            styles.billIcon,
                                            { backgroundColor: bill.isPaid ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 152, 0, 0.1)' }
                                        ]}>
                                            <MaterialIcons
                                                name={getCategoryIcon(bill.category)}
                                                size={20}
                                                color={bill.isPaid ? '#4caf50' : '#ff9800'}
                                            />
                                        </View>
                                        <View style={styles.billDetails}>
                                            <ThemedText style={[styles.billName, { color: textColor }]}>
                                                {bill.name}
                                            </ThemedText>
                                            <ThemedText style={[styles.billDueDate, { color: subtitleColor }]}>
                                                Vence dia {bill.dueDay} • {bill.autopay ? 'Débito automático' : 'Pagamento manual'}
                                            </ThemedText>
                                        </View>
                                    </View>
                                    <View style={styles.billAmount}>
                                        <ThemedText style={[
                                            styles.billAmountText,
                                            { color: bill.isPaid ? '#4caf50' : textColor }
                                        ]}>
                                            {formatCurrency(bill.amount)}
                                        </ThemedText>
                                        {/* Ícones de status: checkmark se pago, e se for autopay, ícone de reloginho */}
                                        {bill.isPaid && (
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                                                <Ionicons
                                                    name="checkmark-circle"
                                                    size={20}
                                                    color="#4caf50"
                                                    style={styles.paidIcon}
                                                />
                                                {bill.autopay && (
                                                    <Ionicons
                                                        name="repeat"
                                                        size={18}
                                                        color="#4caf50"
                                                        style={[styles.paidIcon, { marginLeft: 2 }]}
                                                    />
                                                )}
                                            </View>
                                        )}

                                        {!bill.isPaid && bill.autopay && (
                                            <Ionicons
                                                name="repeat"
                                                size={18}
                                                color="#4caf50"
                                                style={[styles.paidIcon, { marginTop: 2 }]}
                                            />
                                        )}
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
            </View>

            {/* Barra de Progresso */}
            {totalAmount > 0 && (
                <View style={styles.progressSection}>
                    <View style={styles.progressInfo}>
                        <ThemedText style={[styles.progressLabel, { color: subtitleColor }]}>
                            Progresso de pagamento
                        </ThemedText>
                        <ThemedText style={[styles.progressPercentage, { color: textColor }]}>
                            {Math.round((paidAmount / totalAmount) * 100)}%
                        </ThemedText>
                    </View>
                    <View style={styles.progressBarBg}>
                        <View
                            style={[
                                styles.progressBar,
                                {
                                    width: `${(paidAmount / totalAmount) * 100}%`,
                                    backgroundColor: '#4caf50'
                                }
                            ]}
                        />
                    </View>
                </View>
            )}
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
    statsContainer: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    statCard: {
        flex: 1.2,
        padding: 20,
        borderRadius: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 14,
        fontWeight: '500',
    },
    statsRight: {
        flex: 1,
        gap: 8,
    },
    miniStatCard: {
        flex: 1,
        padding: 12,
        borderRadius: 12,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 3,
    },
    miniStatRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    miniStatLabel: {
        fontSize: 12,
    },
    miniStatValue: {
        fontSize: 13,
        fontWeight: '600',
    },
    billsList: {
        gap: 8,
    },
    billCard: {
        padding: 14,
        borderRadius: 12,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 3,
    },
    billCardPaid: {
        opacity: 0.7,
    },
    billHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    billInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    billIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    billDetails: {
        flex: 1,
    },
    billName: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 2,
    },
    billDueDate: {
        fontSize: 12,
    },
    billAmount: {
        alignItems: 'flex-end',
    },
    billAmountText: {
        fontSize: 16,
        fontWeight: '600',
    },
    paidIcon: {
        marginTop: 2,
    },
    progressSection: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0, 0, 0, 0.05)',
    },
    progressInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    progressLabel: {
        fontSize: 13,
    },
    progressPercentage: {
        fontSize: 13,
        fontWeight: '600',
    },
    progressBarBg: {
        height: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        borderRadius: 4,
    },
});