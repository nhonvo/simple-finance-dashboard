import { FetchTransactionsParams } from "src/shared/types/FetchTransactionsParams";
import { getTransactions } from "../transactions/getTransactions";
import { applyFilters } from "src/shared/utilities/applyQuery";
import { Transaction } from "src/shared/types/Transaction";
import { investFilters } from "src/shared/types/filterKeywords";


export async function getInvestTransactions(params: FetchTransactionsParams): Promise<Transaction[]> {
    let result = await getTransactions(params);
    result = applyFilters(result, investFilters);
    return result;
}