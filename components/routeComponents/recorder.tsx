import { AudioMessage } from '@/components/AudioMessage';
import { MicButton } from '@/components/MicButton';
import { ThemedView } from '@/components/ThemedView';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { TranscriptionResponse } from '@/interfaces/Transcription';
import { executeQuery } from '@/services/execute-query/execure-query.service';
import { sendAudioToApi } from '@/services/transcription/transcription.service';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, FlatList, StyleSheet, View } from 'react-native';
import { ThemedText } from '../ThemedText';
import { TypingIndicator } from '../TypingIndicator';

export default function AudioRecorder() {
  const { isRecording, startRecording, stopRecording, cancelRecording } = useAudioRecorder();
  const [messages, setMessages] = useState<TranscriptionResponse[]>([]);
  const [transcribing, setTranscribing] = useState(false);
  const [thinking, setThinking] = useState(false);
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
      setTranscribing(true);
      const uri = await stopRecording();
      if (uri) {
        const transcribedText: any = await sendAudioToApi(uri);
        setTranscribing(false);
        setThinking(true);
        const response: any = await executeQuery(transcribedText);
        setThinking(false);
        if (response) setMessages(prev => [response, ...prev]);
      }
    } else {
      startRecording();
    }
  };

  const renderInitialGreeting = () => {
    if (messages.length === 0 && (!thinking && !transcribing)) {
      return (
        <View style={styles.greetingContainer}>
          <ThemedText style={styles.appTitle}>VoiceTask</ThemedText>
          <ThemedText style={styles.greetingText}>
            Olá! Toque no microfone para começar uma conversa por voz 📣
          </ThemedText>
        </View>
      );
    }
    return null;
  };


  return (
    <ThemedView style={styles.container}>

      {
        messages.length > 0 &&
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
      }

      {thinking && (
        <>
          <TypingIndicator />
        </>
      )}
      {transcribing && (
        <View style={styles.overlay}>
          <View style={styles.loaderBox}>
            <ActivityIndicator size="large" color="#4A90E2" />
            <ThemedText style={styles.loaderText}>Transcrevendo áudio...</ThemedText>
          </View>
        </View>
      )}

      {
        renderInitialGreeting()
      }

      <View style={styles.micContainer}>
        <MicButton
          onCancel={onCancel}
          isRecording={isRecording}
          onPress={handleMicPress}
          pulseAnim={pulseAnim}
          disabled={thinking}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  greetingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 12,
  },
  greetingText: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 26,
  },
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
  loaderText: {
    marginTop: 10,
    fontSize: 14,
    color: '#333'
  },
  micContainer: {
    position: 'absolute',
    bottom: 30,
    right: 24,
  },
});