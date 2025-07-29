// InitialGreeting.tsx
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ThemedText } from './ThemedText';

interface InitialGreetingProps {
    visible: boolean;
    onQuestionSelect: (question: string) => void;
}

const suggestedQuestions = [
    { text: "Quanto eu gastei hoje?", icon: "cash-multiple", value: 'Quanto eu gastei hoje?' },
    { text: "Parcelas em aberto", icon: "credit-card-clock", value: 'Quantas parcelas eu tenho em aberto?' },
    { text: "Maior gasto do mês", icon: "trending-up", value: 'Qual o meu maior gasto esse mês?' },
    { text: "Gastos por categoria", icon: "chart-pie", value: 'Quanto gastei por categoria esse mês?' }
];

export function InitialGreeting({ visible, onQuestionSelect }: InitialGreetingProps) {
    if (!visible) return null;

    return (
        <View style={styles.greetingContainer}>
            <ThemedText style={styles.appTitle}>VoiceTask</ThemedText>
            <ThemedText style={styles.greetingText}>
                Olá! Como posso ajudar você hoje? 👋
            </ThemedText>

            <View style={styles.suggestionsContainer}>
                {suggestedQuestions.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.questionChip}
                        onPress={() => onQuestionSelect(item.value)}
                        activeOpacity={0.8}
                    >
                        <Icon name={item.icon} size={20} color="#fff" style={styles.chipIcon} />
                        <ThemedText style={styles.chipText}>{item.text}</ThemedText>
                    </TouchableOpacity>
                ))}
            </View>

            <ThemedText style={styles.bottomHint}>
                Ou use o 🎤 microfone / ⌨️ teclado abaixo
            </ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
    greetingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        paddingHorizontal: 20,
    },
    appTitle: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#4A90E2',
        marginBottom: 8,
    },
    greetingText: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        marginBottom: 40,
    },
    suggestionsContainer: {
        width: '100%',
        gap: 12,
    },
    questionChip: {
        backgroundColor: '#4A90E2',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    chipIcon: {
        marginRight: 12,
    },
    chipText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
        flex: 1,
    },
    bottomHint: {
        fontSize: 14,
        color: '#999',
        marginTop: 40,
        textAlign: 'center',
    },
});