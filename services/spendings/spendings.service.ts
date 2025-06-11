import { apiRequest } from '@/utils/api';

export const deleteSpending = async (
    spendingId: string
): Promise<any> => {
    await apiRequest(`/spendings/DELETE/${spendingId}`, 'DELETE', null, false);
}