import { TranscriptionResponse } from '@/interfaces/Transcription';
import { apiRequest } from '@/utils/api';

export const sendAudioToApi = async (
    fileUri: string
): Promise<TranscriptionResponse | undefined> => {
    try {
        const formData = new FormData();
        formData.append('file', {
            uri: fileUri,
            name: 'audio.m4a',
            type: 'audio/mp4',
        } as any);

        const data = await apiRequest('/transcribe', 'POST', formData, true);

        return {
            gpt_answer: data.transcription.gpt_answer,
            description: data.transcription.description,
            consult_results: data.transcription.consult_results,
        };
    } catch (error) {
        debugger
        console.error('Erro ao enviar áudio:', error);
    }
};