import React from 'react';
import { Animated, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
    isRecording: boolean;
    onPress: () => void;
    pulseAnim: Animated.Value;
    disabled: boolean;
}

export const MicButton = ({ isRecording, onPress, pulseAnim, disabled }: Props) => (
    <Animated.View style={[styles.wrapper, isRecording && { transform: [{ scale: pulseAnim }] }]}>
        <TouchableOpacity
            style={[styles.button, isRecording && styles.recording]}
            onPress={onPress}
            disabled={disabled}
        >
            <Icon name="microphone" size={30} color="#fff" />
        </TouchableOpacity>
    </Animated.View>
);

const styles = StyleSheet.create({
    wrapper: { justifyContent: 'center', alignItems: 'center' },
    button: {
        backgroundColor: '#4A90E2',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    recording: { backgroundColor: '#d32f2f' },
});