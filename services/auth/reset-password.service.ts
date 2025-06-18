import { apiRequest } from '../../utils/api';

export const sendValidationCode = async (email: string) => {
    try {
        const response = await apiRequest('/auth/forgot-password', 'POST', {
            email
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const validateCode = async (code: string, email: string): Promise<boolean> => {
    const response = await apiRequest('/auth/validate-reset-code', 'POST', { email, code });
    return response;
};

export const resetPassword = async (code: string, email: string, newPassword: string): Promise<boolean> => {
    const response = await apiRequest('/auth/reset-password', 'POST', { email, code, newPassword });
    return response;
};
