import { CreateBillData } from "@/components/CreateBillModal";

export type FixedBill = {
    billId: string;
    name: string;
    description?: string;
    amount: number;
    dueDay: number;
    category: string;
    status: "ACTIVE" | "PAUSED" | "CANCELLED";
    autopay: boolean;
    reminder: boolean;
    paymentHistory: PaymentHistory[];
};

export interface PaymentHistory {
    month: string; // YYYY-MM format
    paid: boolean;
    paidDate?: string;
    amount?: number;
}

export interface FixedBillsSectionProps {
    fixedBills?: FixedBill[];
    onBillPaid: (bill: FixedBill) => void;
    onCreateBill?: (billData: CreateBillData) => void;

}

export enum BillCategory {
    HOUSING = "HOUSING",
    UTILITIES = "UTILITIES",
    TRANSPORTATION = "TRANSPORTATION",
    INSURANCE = "INSURANCE",
    EDUCATION = "EDUCATION",
    ENTERTAINMENT = "ENTERTAINMENT",
    HEALTH = "HEALTH",
    OTHER = "OTHER"
}

export enum BillStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}
