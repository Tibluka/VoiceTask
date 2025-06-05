import { ConsultResult } from '@/interfaces/Transcription';
import { formatCurrency } from '@/utils/format';
import moment from 'moment';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
    message: string;
    consult_results?: ConsultResult[];
}

export const AudioMessage = ({ message, consult_results }: Props) => {
    const total = consult_results?.reduce((acc, cur) => {
        const value = Number(cur.value || 0);
        return cur.type === 'SPENDING' ? acc - value : acc + value;
    }, 0) ?? 0;

    return (
        <View style={styles.messageContainer}>
            <View style={styles.messageBubble}>
                <Text style={styles.messageText}>{message}</Text>
            </View>

            {consult_results && consult_results?.map((row, i) => (
                <View key={i} style={styles.card}>
                    <View style={styles.cardLeft}>
                        <Text style={styles.cardCategory}>{row.category}</Text>
                        <Text style={styles.cardDescription}>{row.description}</Text>
                        {row.installment_info && <Text style={styles.cardInstallment}>Parcela {row.installment_info}</Text>}
                        <Text style={styles.cardDate}>
                            {moment(row.date).format('DD/MM/yyyy')}
                        </Text>
                    </View>
                    <Text
                        style={[
                            styles.cardValue,
                            row.type === 'SPENDING' ? styles.valueExpense : styles.valueIncome,
                        ]}
                    >
                        {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                        }).format(Number(row.value || 0))}
                    </Text>
                </View>
            ))}

            {consult_results && consult_results?.length > 0 && (
                <Text style={{ marginTop: 4, fontWeight: 'bold', color: total < 0 ? 'red' : 'green' }}>
                    Total: {formatCurrency(total)}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    messageContainer: { marginBottom: 16 },
    messageBubble: {
        backgroundColor: '#e6e6fa',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    messageText: { fontSize: 14, color: '#333' },
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 12,
        marginBottom: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    cardLeft: { flex: 1 },
    cardCategory: {
        fontWeight: '600',
        fontSize: 14,
        marginBottom: 2,
        color: '#333',
    },
    cardDescription: {
        fontSize: 13,
        color: '#666',
        marginBottom: 2,
    },
    cardInstallment: {
        color: '#666',
        fontSize: 11,
        fontWeight: 700,
        marginVertical: 4
    },
    totalContainer: {
        backgroundColor: '#F1F8E9',
        borderRadius: 10,
        padding: 12,
        alignItems: 'flex-end',
        marginTop: 8,
    },
    totalText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#33691E',
    },
    cardDate: {
        fontSize: 12,
        color: '#999',
    },
    cardValue: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    valueExpense: { color: '#e53935' },
    valueIncome: { color: '#43a047' },
});