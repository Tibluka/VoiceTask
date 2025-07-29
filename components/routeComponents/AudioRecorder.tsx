import { AudioMessage } from '@/components/AudioMessage';
import { MicButton } from '@/components/MicButton';
import { ThemedView } from '@/components/ThemedView';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { TranscriptionResponse } from '@/interfaces/Transcription';
import { executeQuery } from '@/services/execute-query/execure-query.service';
import { sendAudioToApi } from '@/services/transcription/transcription.service';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ThemedText } from '../ThemedText';
import { TypingIndicator } from '../TypingIndicator';
import { TextInputField } from './TextInputField';

export default function AudioRecorder() {
  const { isRecording, startRecording, stopRecording, cancelRecording } = useAudioRecorder();
  const [messages, setMessages] = useState<TranscriptionResponse[]>([]);
  const [transcribing, setTranscribing] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
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
        try {
          const transcribedText: any = await sendAudioToApi(uri);
          addUserMessage(transcribedText);
          setTranscribing(false);
          setThinking(true);

          const response: any = await executeQuery(transcribedText, messages);
          setThinking(false);
          if (response) addGptMessage(response);
          console.log(response);

        } catch (error) {
          console.error('Erro no processo:', error);
          setTranscribing(false);
          setThinking(false);
        }
      }
    } else {
      startRecording();
    }
  };

  const handleTextSubmit = async () => {
    if (textInput.trim() && !thinking) {
      const message = textInput.trim();
      setTextInput('');
      setShowTextInput(false);
      Keyboard.dismiss();

      addUserMessage(message);
      setThinking(true);

      try {
        const response: any = await executeQuery(message, messages);
        setThinking(false);
        if (response) addGptMessage(response);
      } catch (error) {
        console.error('Erro no processo:', error);
        setThinking(false);
      }
    }
  };

  const toggleInputMode = () => {
    setShowTextInput(!showTextInput);
    if (!showTextInput) {
      // Input será focado automaticamente pelo componente TextInputField
    } else {
      setTextInput('');
      Keyboard.dismiss();
    }
  };

  const handleInputClose = () => {
    setTextInput('');
    setShowTextInput(false);
    Keyboard.dismiss();
  };

  const renderInputArea = () => {
    if (showTextInput) {
      return (
        <TextInputField
          value={textInput}
          onChangeText={setTextInput}
          onSubmit={handleTextSubmit}
          onClose={handleInputClose}
          placeholder="Digite sua pergunta..."
          maxLength={500}
          autoFocus={true}
        />
      );
    }

    return (
      <View style={styles.micContainer}>
        <TouchableOpacity
          onPress={toggleInputMode}
          style={styles.textButton}
          disabled={thinking || isRecording}
        >
          <Icon name="keyboard" size={24} color="#4A90E2" />
        </TouchableOpacity>

        <MicButton
          onCancel={onCancel}
          isRecording={isRecording}
          onPress={handleMicPress}
          pulseAnim={pulseAnim}
          disabled={thinking}
        />
      </View>
    );
  };

  const renderInitialGreeting = () => {
    if (messages.length === 0 && (!thinking && !transcribing)) {
      return (
        <View style={styles.greetingContainer}>
          <ThemedText style={styles.appTitle}>VoiceTask</ThemedText>
          <ThemedText style={styles.greetingText}>
            Olá! {'\n'}
            Toque no microfone para falar ou no teclado para digitar 📣⌨️
          </ThemedText>
        </View>
      );
    }
    return null;
  };

  const addUserMessage = (text: string) => {
    const userMessage = {
      description: text,
      gpt_answer: text,
      type: 'user'
    };
    setMessages(prev => [userMessage, ...prev]);
  };

  const addGptMessage = (response: TranscriptionResponse) => {
    const gptMessage = {
      ...response,
      type: 'system'
    };
    setMessages(prev => [gptMessage, ...prev]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                  consult_results={item.consult_results}
                  type={item.type} />
              }
              contentContainerStyle={[
                styles.list,
                { paddingBottom: showTextInput ? 180 : 120 }
              ]}
              inverted
              keyboardShouldPersistTaps="handled"
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

          {renderInitialGreeting()}
          {renderInputArea()}
        </ThemedView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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
  list: {
    paddingHorizontal: 16,
    paddingVertical: 120
  },
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
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  textButton: {
    backgroundColor: '#f0f8ff',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
});