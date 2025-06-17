import { useEffect, useState } from 'react';
import { ExpenseTreeMapModel } from 'src/features/dashboard/types/ExpenseTreeMapModel';
import { FetchTransactionsParams } from 'src/shared/types/FetchTransactionsParams';
import { getExpenseTree } from '../api/getTransactionsApi';

export function useExpenseTreeData(params: FetchTransactionsParams) {
    const [expenseTreeMap, setExpenseTreeMap] = useState<ExpenseTreeMapModel[] | null>(null);
    const [error, setError] = useState<Error>();

    useEffect(() => {
        getExpenseTree(params)
            .then(setExpenseTreeMap)
            .catch(setError);
    }, [JSON.stringify(params)]);

    return { expenseTreeMap, error };
}
