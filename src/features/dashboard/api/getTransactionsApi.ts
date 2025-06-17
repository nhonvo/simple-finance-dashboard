import { fetcher } from "src/shared/utilities/fetcher";
import { FetchTransactionsParams } from "src/shared/types/FetchTransactionsParams";
import { Transaction } from "src/shared/types/Transaction";
import { ExpenseTreeMapModel } from "src/features/dashboard/types/ExpenseTreeMapModel";
import { OverviewTransaction } from "src/features/dashboard/types/OverviewTransaction";

export const getTransactions = async (params: FetchTransactionsParams): Promise<Transaction[]> => {
    const filteredParams = { ...params };

    if (!filteredParams.start_date) delete filteredParams.start_date;
    if (!filteredParams.end_date) delete filteredParams.end_date;

    const query = new URLSearchParams(filteredParams as Record<string, string>).toString();
    return fetcher<Transaction[]>(`/api/transactions?${query}`);
};

export const getOverviewTransactions = async (params: FetchTransactionsParams): Promise<OverviewTransaction> => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return fetcher<OverviewTransaction>(`/api/overview?${query}`);
};

export const getExpenseTree = async (params: FetchTransactionsParams): Promise<ExpenseTreeMapModel[]> => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return fetcher<ExpenseTreeMapModel[]>(`/api/expense-tree?${query}`);
};