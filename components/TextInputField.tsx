import React, { useEffect, useRef } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
    value: string;
    onChangeText: (text: string) => void;
    onSubmit: () => void;
    onClose: () => void;
    placeholder?: string;
    maxLength?: number;
    autoFocus?: boolean;
}

export const TextInputField = ({
    value,
    onChangeText,
    onSubmit,
    onClose,
    placeholder = "Digite sua pergunta...",
    maxLength = 500,
    autoFocus = true
}: Props) => {
    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
        if (autoFocus) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [autoFocus]);

    return (
        <View style={styles.inputContainer}>
            <TextInput
                ref={inputRef}
                style={styles.textInput}
                placeholder={placeholder}
                placeholderTextColor="#999"
                value={value}
                onChangeText={onChangeText}
                multiline
                maxLength={maxLength}
                onSubmitEditing={onSubmit}
                blurOnSubmit={false}
            />
            <View style={styles.inputActions}>
                <TouchableOpacity
                    onPress={onClose}
                    style={styles.inputActionButton}
                >
                    <Icon name="close" size={24} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={onSubmit}
                    style={[
                        styles.inputActionButton,
                        styles.sendButton,
                        { opacity: value.trim() ? 1 : 0.5 }
                    ]}
                    disabled={!value.trim()}
                >
                    <Icon name="send" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        position: 'absolute',
        bottom: 64,
        left: 16,
        right: 16,
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 12,
        maxHeight: 120,
        zIndex: 1000,
    },
    textInput: {
        fontSize: 16,
        color: '#333',
        maxHeight: 80,
        padding: 8,
    },
    inputActions: {
        position: 'absolute',
        right: 8,
        top: '50%',
        transform: [{ translateY: -6 }],
        flexDirection: 'row',
        gap: 8,
    },
    inputActionButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    sendButton: {
        backgroundColor: '#4A90E2',
    },
});