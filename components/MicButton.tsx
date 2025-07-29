import React from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
    isRecording: boolean;
    onPress: () => void;
    onCancel: () => void;
    pulseAnim: Animated.Value;
    disabled: boolean;
}

export const MicButton = ({ isRecording, onPress, onCancel, pulseAnim, disabled }: Props) => (
    <View style={styles.row}>
        {isRecording && (
            <TouchableOpacity onPress={onCancel} style={styles.trashButton}>
                <Icon name="trash-can" size={28} color="#d32f2f" />
            </TouchableOpacity>
        )}

        <Animated.View style={[styles.wrapper, isRecording && { transform: [{ scale: pulseAnim }] }]}>
            <TouchableOpacity
                style={[styles.button, isRecording && styles.recording]}
                onPress={onPress}
                disabled={disabled}
            >
                <Icon name="microphone" size={30} color="#fff" />
            </TouchableOpacity>
        </Animated.View>
    </View>
);

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    wrapper: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#4A90E2',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    recording: {
        backgroundColor: '#d32f2f',
    },
    trashButton: {
        marginRight: 16,
        padding: 8,
        backgroundColor: '#ffebee',
        borderRadius: 20,
    },
});