import { ThemedView } from '@/components/ThemedView';
import { Audio } from 'expo-av';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    Easing,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const recordingOptions = {
    android: {
        extension: '.m4a',
        outputFormat: 2,
        audioEncoder: 3,
        sampleRate: 44100,
        numberOfChannels: 2,
        bitRate: 128000,
    },
    ios: {
        extension: '.caf',
        audioQuality: 127,
        sampleRate: 44100,
        numberOfChannels: 2,
        bitRate: 128000,
        linearPCMBitDepth: 16,
        linearPCMIsBigEndian: false,
        linearPCMIsFloat: false,
    },
};

interface ConsultResult {
    category: string;
    description: string;
    date: string;
    value: number;
    type: 'SPENDING' | 'REVENUE';
}

interface TranscriptionResponse {
    gpt_answer: string;
    description: string;
    consult_results?: ConsultResult[];
}

export default function AudioRecorder() {
    const [sentMessages, setSentMessages] = useState<
        Array<{ message: string; consult_results?: ConsultResult[] }>
    >([]);
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordedURI, setRecordedURI] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        (async () => {
            const permission = await Audio.requestPermissionsAsync();
            if (!permission.granted) {
                Alert.alert('Permissão para acessar o microfone foi negada');
            }
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });
        })();
    }, []);

    useEffect(() => {
        if (isRecording) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.5,
                        duration: 600,
                        useNativeDriver: true,
                        easing: Easing.inOut(Easing.ease),
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 600,
                        useNativeDriver: true,
                        easing: Easing.inOut(Easing.ease),
                    }),
                ])
            ).start();
        } else {
            pulseAnim.setValue(1);
        }
    }, [isRecording]);

    const startRecording = async () => {
        try {
            const { recording } = await Audio.Recording.createAsync(recordingOptions as any);
            setRecording(recording);
            setIsRecording(true);
            setRecordedURI(null);
        } catch (error) {
            console.error('Erro ao iniciar gravação', error);
        }
    };

    const stopRecording = async () => {
        if (!recording) return;
        try {
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            setRecordedURI(uri);
            setRecording(null);
            setIsRecording(false);
            setLoading(true);

            const transcription = await sendAudioToApi(uri!);
            setLoading(false);

            if (transcription) {
                setSentMessages(prev => [
                    {
                        message: transcription.gpt_answer,
                        consult_results: transcription.consult_results,
                    },
                    {
                        message: transcription.description,
                    },
                    ...prev,
                ]);
            }
        } catch (error) {
            console.error('Erro ao parar gravação', error);
        }
    };

    const sendAudioToApi = async (fileUri: string): Promise<TranscriptionResponse | undefined> => {
        try {
            const formData = new FormData();
            formData.append('file', {
                uri: fileUri,
                name: 'audio.m4a',
                type: 'audio/mp4',
            } as any);

            const res = await fetch('http://192.168.18.4:5004/transcribe', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error(`Erro na API: ${res.status}`);

            const data = await res.json();
            return {
                gpt_answer: data.transcription.gpt_answer,
                description: data.transcription.description,
                consult_results: data.transcription.consult_results,
            };
        } catch (error) {
            console.error('Erro ao enviar áudio:', error);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <FlatList
                data={sentMessages}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.messageContainer}>
                        <View style={styles.messageBubble}>
                            <Text style={styles.messageText}>{item.message}</Text>
                        </View>

                        {item.consult_results?.map((row, i) => (
                            <View key={i} style={styles.card}>
                                <View style={styles.cardLeft}>
                                    <Text style={styles.cardCategory}>{row.category}</Text>
                                    <Text style={styles.cardDescription}>{row.description}</Text>
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
                                    R$ {Number(row.value || 0).toFixed(2)}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}
                style={styles.messageList}
                contentContainerStyle={styles.messageListContent}
                inverted
            />

            {loading && (
                <View style={styles.loadingOverlay}>
                    <View style={styles.loadingBox}>
                        <ActivityIndicator size="large" color="#4A90E2" />
                        <Text style={styles.loadingText}>Transcrevendo áudio...</Text>
                    </View>
                </View>
            )}

            <View style={styles.recorderContainer}>
                <Animated.View style={[styles.micWrapper, isRecording && { transform: [{ scale: pulseAnim }] }]}>
                    <TouchableOpacity
                        style={[styles.micButton, isRecording && styles.micRecording]}
                        onPress={isRecording ? stopRecording : startRecording}
                        disabled={loading}
                    >
                        <Icon name="microphone" size={30} color="#fff" />
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    messageList: { flex: 1, paddingVertical: 160 },
    messageContainer: { marginBottom: 16 },
    messageBubble: {
        backgroundColor: '#e6e6fa',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    messageText: { fontSize: 14, color: '#333' },
    messageListContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
        marginBottom: 160,
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingBox: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 8,
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: '#333',
    },
    recorderContainer: {
        position: 'absolute',
        bottom: 120,
        right: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    micWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    micButton: {
        backgroundColor: '#4A90E2',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    micRecording: {
        backgroundColor: '#d32f2f',
    },
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