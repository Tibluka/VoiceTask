import { apiRequest } from '@/utils/api';

export const sendAudioToApi = async (
    fileUri: string
): Promise<{ text: string } | undefined> => {
    const formData = new FormData();
    formData.append('file', {
        uri: fileUri,
        name: 'audio.m4a',
        type: 'audio/mp4',
    } as any);

    const data = await apiRequest('/transcribe', 'POST', formData, true);

    return data.transcribed_text;
};