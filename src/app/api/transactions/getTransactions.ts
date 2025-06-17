import { Transaction } from 'src/shared/types/Transaction';
import { FetchTransactionsParams } from "src/shared/types/FetchTransactionsParams";
import { applyFiltersIgnoreData } from "src/shared/utilities/applyQuery";
import { readData } from 'src/shared/utilities/CRUDFile';
import { cleanFilters } from 'src/shared/types/filterKeywords';
import { filterByDateRange } from 'src/shared/utilities/parseParams';
import { QueryOptions } from 'mongoose';
import { queryCollection } from 'src/shared/utilities/queryData';


type SearchableTransactionFields = 'description' | 'category' | 'transaction_code' | 'counter_account';

export async function getTransactions(params: FetchTransactionsParams): Promise<Transaction[]> {
    const {
        query,
        limit,
        offset,
        sort_by,
        order_by,
        start_date,
        end_date,
        clean,
    } = params;

    let data = await readData(); // Assuming this returns Transaction[]

    // --- Filtering logic remains the same ---
    if (clean) {
        data = applyFiltersIgnoreData(data, cleanFilters);
    }
    if (start_date || end_date) {
        data = filterByDateRange(data, start_date, end_date);
    }
    const filterFn = (t: Transaction) => {
        if (query) {
            const q = query.toLowerCase();
            return (['description', 'category', 'transaction_code', 'counter_account'] as SearchableTransactionFields[])
                .some(field => t[field]?.toString().toLowerCase().includes(q));
        }
        return true;
    };

    // --- New logic to build options for queryCollection ---

    // 1. Start with the options we always pass
    const queryOptions: QueryOptions<Transaction> = {
        filterFn,
        offset,
        limit,
    };

    // 2. Conditionally add the 'orderBy' option if sorting is requested
    if (sort_by) {
        queryOptions.orderBy = [{
            key: sort_by as keyof Transaction,
            direction: order_by ? 'asc' : 'desc', // Pass 'asc', 'desc', or undefined (defaults to 'asc' in queryCollection)
        }];
    }

    // 3. Call queryCollection with the new options object
    return queryCollection(data, queryOptions);
}
