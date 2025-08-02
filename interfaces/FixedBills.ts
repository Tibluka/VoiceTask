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
    paymentHistory: Array<{
        paymentId: string;
        month: string;
        amount: number;
        paid: boolean;
        paidDate?: string;
    }>;
};

export interface FixedBillsSectionProps {
    fixedBills?: FixedBill[];
    onBillPaid: any;
}