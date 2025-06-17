import { useEffect, useState } from 'react';
import { Transaction } from 'src/shared/types/Transaction';
import { FetchTransactionsParams } from 'src/shared/types/FetchTransactionsParams';
import { getInvestTransactions } from '../api/getInvestTransactionsApi';

export function useInvestData(params: FetchTransactionsParams) {
    const [invest, setInvest] = useState<Transaction[] | null>(null);
    const [error, setError] = useState<Error>();

    useEffect(() => {
        getInvestTransactions(params)
            .then(setInvest)
            .catch(setError);
    }, [JSON.stringify(params)]);

    return { invest, error };
}
