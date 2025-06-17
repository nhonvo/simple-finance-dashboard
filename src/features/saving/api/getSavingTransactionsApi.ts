import { fetcher } from "src/shared/utilities/fetcher";
import { FetchTransactionsParams } from "src/shared/types/FetchTransactionsParams";
import { Transaction } from "src/shared/types/Transaction";

export const getSavingTransactions = async (params: FetchTransactionsParams): Promise<Transaction[]> => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return fetcher<Transaction[]>(`/api/saving?${query}`);
};
