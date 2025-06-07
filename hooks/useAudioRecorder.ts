import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';

export const useAudioRecorder = () => {
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordedURI, setRecordedURI] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            const permission = await Audio.requestPermissionsAsync();
            if (!permission.granted) {
                alert('Permissão para acessar o microfone foi negada');
            }
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });
        })();
    }, []);

    const startRecording = async () => {
        try {
            const { recording } = await Audio.Recording.createAsync({
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
            } as any);

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
            return uri;
        } catch (error) {
            console.error('Erro ao parar gravação', error);
        }
    };

    const cancelRecording = async () => {
        if (recording) {
            try {
                await recording.stopAndUnloadAsync();
            } catch { }
        }
        setRecording(null);
        setIsRecording(false);
        setRecordedURI(null);
    };

    return { recording, isRecording, recordedURI, startRecording, stopRecording, cancelRecording };
};
