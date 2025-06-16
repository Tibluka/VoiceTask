import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';

interface FooterProps {
    selectedIndex: number;
    onTabPress: (index: number) => void;
}

export function Footer({ selectedIndex, onTabPress }: FooterProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const iconColor = isDark ? '#fff' : '#000';
    const activeColor = '#4A90E2';

    return (
        <View style={[styles.container, isDark && styles.containerDark]}>
            <TouchableOpacity
                style={[styles.tab]}
                onPress={() => onTabPress(0)}
            >
                <Ionicons
                    name={selectedIndex === 0 ? 'chatbubble' : 'chatbubble-outline'}
                    size={28}
                    color={selectedIndex === 0 ? activeColor : iconColor}
                />
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.tab]}
                onPress={() => onTabPress(1)}
            >
                <Ionicons
                    name={selectedIndex === 1 ? 'person' : 'person-outline'}
                    size={28}
                    color={selectedIndex === 1 ? activeColor : iconColor}
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 60,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        backgroundColor: '#f9f9f9',
    },
    containerDark: {
        backgroundColor: '#111',
        borderTopColor: '#444',
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});