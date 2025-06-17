import { Transaction } from 'src/shared/types/Transaction';
import { FetchTransactionsParams } from "src/shared/types/FetchTransactionsParams";
import { getTransactions } from "../transactions/getTransactions";
import { applyFilters } from "src/shared/utilities/applyQuery";
import { savingFilters } from "src/shared/types/filterKeywords";

export async function getSavingTransactions(params: FetchTransactionsParams): Promise<Transaction[]> {
    let result = await getTransactions(params);
    result = applyFilters(result, savingFilters);
    return result;
}