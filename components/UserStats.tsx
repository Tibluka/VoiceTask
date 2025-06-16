// components/UserStats.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';

type UserStatsProps = {
    totalGoals: number;
};

export function UserStats({ totalGoals }: UserStatsProps) {
    return (
        <View style={styles.statBox}>
            <ThemedText type="defaultSemiBold">{totalGoals}</ThemedText>
            <ThemedText type="subtitle">Metas</ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
    statBox: {
        marginTop: 12,
        alignItems: 'flex-start',
        flex: 1,
    },
});
