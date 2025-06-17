import { TranscriptionResponse } from '@/interfaces/Transcription';
import { apiRequest } from '@/utils/api';

export const executeQuery = async (
    transcribedText: string
): Promise<TranscriptionResponse | undefined> => {
    try {
        const data = await apiRequest('/execute-query', 'POST', { transcribedText }, false);
        return data.transcription;
    } catch (error) {
        console.error('Erro ao enviar áudio:', error);
    }
};