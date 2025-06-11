import { CATEGORY_TRANSLATIONS } from '@/constants/CategoryTranslations';
import { ConsultResult } from '@/interfaces/Transcription';
import { deleteSpending } from '@/services/spendings/spendings.service';
import { formatCurrency } from '@/utils/format';
import moment from 'moment';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import {
    Gesture,
    GestureDetector,
} from 'react-native-gesture-handler';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
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

const SwipeableRow = ({
    item,
    onDelete,
}: {
    item: ConsultResult;
    onDelete: (item: ConsultResult, resetTranslate: () => void) => void;
}) => {
    const translateX = useSharedValue(0);
    const threshold = -200;

    const resetTranslate = () => {
        translateX.value = withSpring(0);
    };

    const panGesture = Gesture.Pan()
        .onUpdate((e) => {
            if (e.translationX < 0) {
                translateX.value = e.translationX;
            }
        })
        .onEnd(() => {
            if (translateX.value < threshold) {
                runOnJS(onDelete)(item, resetTranslate);
            } else {
                translateX.value = withSpring(0);
            }
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    return (
        <GestureDetector gesture={panGesture}>
            <Animated.View style={[styles.card, animatedStyle]}>
                <View style={styles.cardLeft}>
                    <Text style={styles.cardCategory}>
                        {CATEGORY_TRANSLATIONS[item.category] || item.category}
                    </Text>
                    <Text style={styles.cardDescription}>{item.description}</Text>
                    {item.installment_info && (
                        <Text style={styles.cardInstallment}>Parcela {item.installment_info}</Text>
                    )}
                    <Text style={styles.cardDate}>
                        {moment(item.date).format('DD/MM/yyyy')}
                    </Text>
                </View>
                <Text
                    style={[
                        styles.cardValue,
                        item.type === 'SPENDING' ? styles.valueExpense : styles.valueIncome,
                    ]}
                >
                    {formatCurrency(Number(item.value || 0))}
                </Text>
            </Animated.View>
        </GestureDetector>
    );
};

export const AudioMessage = ({ message, consult_results, chart_data }: Props) => {
    const [results, setResults] = useState(consult_results ?? []);

    const handleDelete = (item: ConsultResult, resetTranslate: () => void) => {
        Alert.alert('Remover registro', 'Deseja realmente remover esse registro?', [
            { text: 'Cancelar', style: 'cancel', onPress: () => resetTranslate() },
            {
                text: 'Remover',
                style: 'destructive',
                onPress: () => {
                    deleteAndUpdate(item, resetTranslate);
                },
            },
        ]);
    };

    const deleteAndUpdate = async (item: ConsultResult, resetTranslate: () => void) => {
        try {
            await deleteSpending(item._id);
            setResults((prev) => prev.filter((r) => r._id !== item._id));
        } catch (error) {
            console.error('Erro ao deletar:', error);
            resetTranslate();
        }
    };


    const renderResults = () => {
        const total = results.reduce((acc, cur) => {
            const value = Number(cur.value || 0);
            return cur.type === 'SPENDING' ? acc - value : acc + value;
        }, 0);

        if (chart_data || results.length === 0) return null;

        return (
            <View style={{ marginVertical: 24 }}>
                {results.map((row, i) => (
                    <View key={i} style={{ position: 'relative' }}>
                        <SwipeableRow item={row} onDelete={handleDelete} />
                    </View>
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
    deleteOverlay: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 8,
        width: 64,
        backgroundColor: '#e53935',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
});