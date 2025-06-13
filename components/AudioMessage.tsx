import { CATEGORY_TRANSLATIONS } from '@/constants/CategoryTranslations';
import { ConsultResult } from '@/interfaces/Transcription';
import { deleteSpending } from '@/services/spendings/spendings.service';
import { formatCurrency } from '@/utils/format';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ChartScreen from './ChartScreen';

interface Props {
    message: string;
    consult_results?: ConsultResult[];
    chart_data: {
        chartType: 'pie' | 'pyramid' | 'bar' | 'radar' | 'line';
        data: {
            value: number;
            label?: string;
        }[];
    };
}

export const AudioMessage = ({ message, consult_results, chart_data }: Props) => {
    const [results, setResults] = useState(consult_results ?? []);

    const handleDelete = (item: ConsultResult) => {
        Alert.alert('Remover registro', 'Deseja realmente remover esse registro?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Remover',
                style: 'destructive',
                onPress: async () => {
                    await deleteSpending(item._id)
                    const filtered = results.filter((r) => r !== item);
                    setResults(filtered);
                },
            },
        ]);
    };

    const renderRightActions = (row: ConsultResult) => (
        <TouchableOpacity
            onPress={() => handleDelete(row)}
            style={styles.deleteButton}
        >
            <Icon name="trash-can-outline" size={24} color="#fff" />
        </TouchableOpacity>
    );

    const renderResults = () => {
        const total = results.reduce((acc, cur) => {
            const value = Number(cur.value || 0);
            return cur.type === 'SPENDING' ? acc - value : acc + value;
        }, 0);

        if (chart_data || results.length === 0) return null;

        return (
            <View style={{ marginVertical: 24 }}>
                {results.map((row, i) => (
                    <Swipeable
                        key={i}
                        renderRightActions={() => renderRightActions(row)}
                        overshootRight={false}
                    >
                        <View style={styles.card}>
                            <View style={styles.cardLeft}>
                                <Text style={styles.cardCategory}>
                                    {CATEGORY_TRANSLATIONS[row.category] || row.category}
                                </Text>
                                <Text style={styles.cardDescription}>{row.description}</Text>
                                {row.installment_info && (
                                    <Text style={styles.cardInstallment}>Parcela {row.installment_info}</Text>
                                )}
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
                    </Swipeable>
                ))}
                <Text
                    style={{
                        marginTop: 4,
                        fontWeight: 'bold',
                        color: total < 0 ? 'red' : 'green',
                    }}
                >
                    Total: {formatCurrency(total)}
                </Text>
            </View>
        );
    };

    const renderChart = () => {
        if (!chart_data) return;
        return (
            <View style={{ marginVertical: 24 }}>
                <ChartScreen chartType={chart_data.chartType} data={chart_data.data} />
            </View>
        );
    };

    useEffect(() => {
        if (consult_results) {
            setResults(consult_results);
        }
    }, [consult_results]);

    return (
        <View style={styles.messageContainer}>
            <View style={styles.messageBubble}>
                <Text style={styles.messageText}>{message}</Text>
            </View>
            {renderResults()}
            {renderChart()}
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
        fontWeight: '700',
        marginVertical: 4,
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
    deleteButton: {
        backgroundColor: '#e53935',
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        borderRadius: 8,
        marginBottom: 8,
    },
});