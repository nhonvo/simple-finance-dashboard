
export interface FetchTransactionsParams {
    order_by?: boolean;
    sort_by?: string;
    offset?: number;
    clean?: boolean;
    limit?: number;
    start_date?: string;
    end_date?: string;
    query?: string
}