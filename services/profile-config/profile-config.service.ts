import { apiRequest } from '@/utils/api';

export const getUserProfileConfig = async (
    userId: string
): Promise<any> => {
    await apiRequest(`/config/${userId}`, 'GET', null, false);
}