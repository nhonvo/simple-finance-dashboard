export interface Transaction {
    transaction_date: Date;
    description: string;
    effective_date: Date;
    debit: number;
    credit: number;
    balance: number;
    counter_account: string;
    category: string;
    transaction_code: string;
}