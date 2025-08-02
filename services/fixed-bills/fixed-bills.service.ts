import { apiRequest } from '@/utils/api';

export const payBill = async (
    billId: string,
    amount: number,
    yearMonth: string
): Promise<any> => {
    await apiRequest(`/fixed-bills/${billId}/pay`, 'POST', { amount, yearMonth }, false);
}