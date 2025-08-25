import { apiRequest } from '@/utils/api';

export const payBill = async (
    billId: string,
    amount: number,
    yearMonth: string
): Promise<any> => {
    await apiRequest(`/fixed-bills/${billId}/pay`, 'POST', { amount, yearMonth }, false);
}

export const createFixedBill = async (
    name: string,
    amount: number,
    dueDay: number,
    category: string,
    autopay?: boolean,
    reminder?: boolean,
    description?: string
): Promise<any> => {
    const requiredFields = { name, amount, dueDay, category, autopay, reminder, description };
    return await apiRequest('/fixed-bills', 'POST', requiredFields, false);
}

export const deleteFixedBill = async (billId: string): Promise<any> => {
    return await apiRequest(`/fixed-bills/${billId}`, 'DELETE', null, false);
};
