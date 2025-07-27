export interface ConsultResult {
    _id: string;
    category: string;
    description: string;
    date: string;
    value: number;
    type: 'SPENDING' | 'REVENUE';
    installment_info?: string;
}

export interface TranscriptionResponse {
    gpt_answer: string;
    description: string;
    type: string;
    consult_results?: ConsultResult[];
    chart_data?: any;
}  