import { useState } from 'react';
import { Transaction } from 'src/shared/types/Transaction';
import { SortableColumn } from '../../../shared/types/SortableColumn';

export function useTransactionSorting(transactions: Transaction[]) {
    const [sortColumn, setSortColumn] = useState<SortableColumn | null>('transaction_date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const handleSort = (column: SortableColumn) => {
        if (sortColumn === column) {
            setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortColumn(column);
            setSortOrder('asc');
        }
    };

    const sortedTransactions = sortTransactions(transactions, sortColumn, sortOrder);

    return { sortedTransactions, sortColumn, sortOrder, handleSort };
}

export function sortTransactions(transactions: Transaction[], column: SortableColumn | null, order: 'asc' | 'desc') {
    if (!column) return transactions;

    return [...transactions].sort((a, b) => {
        const aVal = a[column];
        const bVal = b[column];

        if (aVal < bVal) return order === 'asc' ? -1 : 1;
        if (aVal > bVal) return order === 'asc' ? 1 : -1;
        return 0;
    });
}