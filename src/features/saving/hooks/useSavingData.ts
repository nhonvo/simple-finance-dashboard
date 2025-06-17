import { useEffect, useState } from 'react';
import { Transaction } from 'src/shared/types/Transaction';
import { FetchTransactionsParams } from 'src/shared/types/FetchTransactionsParams';
import { getSavingTransactions } from '../api/getSavingTransactionsApi';

export function useSavingData(params: FetchTransactionsParams) {
    const [saving, setSaving] = useState<Transaction[] | null>(null);
    const [error, setError] = useState<Error>();

    useEffect(() => {
        getSavingTransactions(params)
            .then(setSaving)
            .catch(setError);
    }, [JSON.stringify(params)]);

    return { saving, error };
}
