import { useEffect, useState } from 'react';
import { Transaction } from 'src/shared/types/Transaction';
import { TransactionFiltersProps } from 'src/features/dashboard/types/TransactionFiltersProps';
import { getTransactions } from '../api/getTransactionsApi';

export function useTransactionData(filters: TransactionFiltersProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getTransactions(filters)
            .then(setTransactions)
            .catch(err => setError(err.message || 'Failed to fetch transactions'))
            .finally(() => setLoading(false));
    }, [filters]);

    return { transactions, error, loading, filters, setTransactions };
}
