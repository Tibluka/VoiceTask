import { TranscriptionResponse } from '@/interfaces/Transcription';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export const sendAudioToApi = async (fileUri: string): Promise<TranscriptionResponse | undefined> => {
    try {
        const formData = new FormData();
        formData.append('file', {
            uri: fileUri,
            name: 'audio.m4a',
            type: 'audio/mp4',
        } as any);

        const res = await fetch(`${apiUrl}/transcribe`, {
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