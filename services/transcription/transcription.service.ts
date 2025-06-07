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
        console.log(data.transcription);

        return data.transcription;
    } catch (error) {
        console.error('Erro ao enviar áudio:', error);
    }
};