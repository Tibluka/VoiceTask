export interface ConsultResult {
    category: string;
    description: string;
    date: string;
    value: number;
    type: 'SPENDING' | 'REVENUE';
}

export interface TranscriptionResponse {
    gpt_answer: string;
    description: string;
    consult_results?: ConsultResult[];
}  