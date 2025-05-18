import { Audio } from 'expo-av';
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

export default function AudioRecorder() {
    const [sentMessages, setSentMessages] = useState<Array<{ message: string }>>([]);
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
                setSentMessages(prev => [{ message: transcription }, ...prev]);
            }
        } catch (error) {
            console.error('Erro ao parar gravação', error);
        }
    };

    const sendAudioToApi = async (fileUri: string) => {
        try {
            const formData = new FormData();
            formData.append("file", {
                uri: fileUri,
                name: "audio.m4a",
                type: "audio/mp4",
            } as any);

            const res = await fetch("http://192.168.0.200:5003/transcribe", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error(`Erro na API: ${res.status}`);

            const data = await res.json();
            return data.transcription;
        } catch (error) {
            console.error("Erro ao enviar áudio:", error);
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={sentMessages}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.messageBubble}>
                        <Text style={styles.messageText}>{item.message}</Text>
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f4f4f8', paddingBottom: 130 },
    messageList: {
        flex: 1,
    },
    messageListContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
        marginBottom: 160
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 180,
        zIndex: 10,
    },
    loadingBox: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    messageBubble: {
        backgroundColor: '#E1FFC7',
        padding: 12,
        borderRadius: 16,
        alignSelf: 'flex-end',
        marginVertical: 6,
        maxWidth: '80%',
    },
    messageText: {
        fontSize: 16,
        color: '#333',
    },
    recorderContainer: {
        position: 'absolute',
        bottom: 70,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    micWrapper: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    micButton: {
        backgroundColor: '#4A90E2',
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    micRecording: {
        backgroundColor: '#E94E77',
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
    },
    loadingText: {
        marginTop: 8,
        color: '#666',
    },
});