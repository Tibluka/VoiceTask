import { AudioMessage } from '@/components/AudioMessage';
import { MicButton } from '@/components/MicButton';
import { ThemedView } from '@/components/ThemedView';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { TranscriptionResponse } from '@/interfaces/Transcription';
import { sendAudioToApi } from '@/services/transcription/transcription.service';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, FlatList, StyleSheet, Text, View } from 'react-native';

export default function AudioRecorder() {
  const { isRecording, startRecording, stopRecording, cancelRecording } = useAudioRecorder();
  const [messages, setMessages] = useState<TranscriptionResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.5, duration: 600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording]);

  const onCancel = () => {
    cancelRecording();
  };

  const handleMicPress = async () => {

    if (isRecording) {
      setLoading(true);
      const uri = await stopRecording();
      if (uri) {
        const transcription = await sendAudioToApi(uri);

        if (transcription) setMessages(prev => [transcription, ...prev]);
      }
      setLoading(false);
    } else {
      startRecording();
    }
  };

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) =>
          <AudioMessage
            message={item.gpt_answer}
            chart_data={item.chart_data}
            consult_results={item.consult_results} />
        }
        contentContainerStyle={styles.list}
        inverted
      />
      {loading && (
        <View style={styles.overlay}>
          <View style={styles.loaderBox}>
            <ActivityIndicator size="large" color="#4A90E2" />
            <Text style={styles.loaderText}>Transcrevendo áudio...</Text>
          </View>
        </View>
      )}

      <View style={styles.micContainer}>
        <MicButton
          onCancel={onCancel}
          isRecording={isRecording}
          onPress={handleMicPress}
          pulseAnim={pulseAnim}
          disabled={loading}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { paddingHorizontal: 16, paddingVertical: 120 },
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  loaderBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  loaderText: { marginTop: 10, fontSize: 14, color: '#333' },
  micContainer: {
    position: 'absolute',
    bottom: 30,
    right: 24,
  },
});
