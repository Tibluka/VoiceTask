import { apiRequest } from "@/utils/api";
import { create } from "zustand";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

type SpendingState = {
    totalSpent: number | undefined;
    predictedTotal: number | undefined;
    loadingTotal: boolean;
    fetchData: (userId: string) => Promise<void>
};

export const useSpendingStore = create<SpendingState>((set) => ({
    totalSpent: undefined,
    predictedTotal: undefined,
    loadingTotal: false,
    fetchData: async (userId: string) => {
        set({ loadingTotal: true });
        try {
            const res = await apiRequest(`/spendings/month/${userId}`, 'GET') as SpendingState;
            set({
                totalSpent: res.totalSpent,
                predictedTotal: res.predictedTotal,
                loadingTotal: false
            });
        } catch (error) {
            set({ loadingTotal: false });
        }
    },
}));