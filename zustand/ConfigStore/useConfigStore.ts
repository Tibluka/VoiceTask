import { apiRequest } from "@/utils/api";
import { create } from "zustand";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

type Config = {
    id: string;
    userId: string;
    budgetStrategy: "50-30-20" | "custom";
    customPercentages?: {
        needs: number;
        wants: number;
        investments: number;
    };
    monthlyIncome?: number;
    monthLimit?: number;
    currentSpent?: number;
    fixedBills?: Array<{
        name: string;
        amount: number;
        dueDay: number;
        paid: boolean;
    }>;
    goals?: Array<{
        title: string;
        targetAmount: number;
        currentAmount: number;
        deadline: string;
    }>;
    createdAt: string;
    updatedAt: string;
};

type ConfigState = {
    cfg: Config | null;
    loadConfig: () => Promise<void>;
    saveConfig: (data: Partial<Config>) => Promise<void>;
};

export const useConfigStore = create<ConfigState>(set => ({
    cfg: null,
    loadConfig: async () => {
        const res = await apiRequest(`${apiUrl}/config`, 'GET');
        if (res.ok) {
            const cfg = await res.json();
            set({ cfg });
        }
    },
    saveConfig: async (data) => {
        await apiRequest(`${apiUrl}/config`, 'POST', JSON.stringify(data));
        await useConfigStore.getState().loadConfig();
    },
}));