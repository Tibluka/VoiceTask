import { apiRequest } from "@/utils/api";
import { create } from "zustand";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

type Project = {
    projectId: string;
    projectName: string;
    description?: string;
    totalValueRegistered: number;
    targetValue?: number;
    status: "ACTIVE" | "COMPLETED" | "PAUSED";
    dateHourCreated: string;
    dateHourUpdated: string;
    completedAt?: string;
};

type FixedBill = {
    billId: string;
    name: string;
    description?: string;
    amount: number;
    dueDay: number;
    paid: boolean;
    category: string;
    status: "ACTIVE" | "PAUSED" | "CANCELLED";
    autopay: boolean;
    reminder: boolean;
    paymentHistory: Array<{
        paymentId: string;
        month: string;
        amount: number;
        paid: boolean;
        paidDate?: string;
        createdAt: string;
    }>;
    createdAt?: string;
    updatedAt?: string;
};

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
    fixedBills?: FixedBill[];
    goals?: Array<{
        title: string;
        targetAmount: number;
        currentAmount: number;
        deadline: string;
    }>;
    projects?: Project[];
    createdAt: string;
    updatedAt: string;
};

type ConfigState = {
    cfg: Config | null;
    loadConfig: (userId: string) => Promise<void>;
    saveConfig: (userId: string, data: Partial<Config>) => Promise<void>;
};

export const useConfigStore = create<ConfigState>((set, get) => ({
    cfg: null,

    loadConfig: async (userId: string) => {
        const res = await apiRequest(`/config/${userId}`, 'GET') as Config;
        const cfg = res;
        set({ cfg });
    },

    saveConfig: async (userId: string, data: Partial<Config>) => {
        await apiRequest(`/config/${userId}`, 'POST', JSON.stringify(data));
        await get().loadConfig(userId);
    },
}));