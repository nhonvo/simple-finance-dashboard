import { useEffect, useState } from 'react';
import { OverviewTransaction } from 'src/features/dashboard/types/OverviewTransaction';
import { FetchTransactionsParams } from 'src/shared/types/FetchTransactionsParams';
import { getOverviewTransactions } from '../api/getTransactionsApi';

export function useOverviewData(params: FetchTransactionsParams) {
    const [overview, setOverview] = useState<OverviewTransaction | null>(null);
    const [error, setError] = useState<Error>();

    useEffect(() => {
        getOverviewTransactions(params)
            .then(setOverview)
            .catch(setError);
    }, [JSON.stringify(params)]);

    return { overview, error };
}
