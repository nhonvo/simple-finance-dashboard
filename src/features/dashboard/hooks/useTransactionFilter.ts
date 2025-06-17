import { useState } from 'react';
import { TransactionFiltersProps } from 'src/features/dashboard/types/TransactionFiltersProps';

export function useTransactionFilter(start_date?: string, end_date?: string) {
    const params: TransactionFiltersProps = {
        order_by: true,
        sort_by: 'transaction_date',
        offset: 0,
        clean: false,
        limit: -1,
        start_date: start_date,
        end_date: end_date
    }

    const [filters, setFilters] = useState<TransactionFiltersProps>(params);
    const handleChange = (name: string, value: string | number | boolean) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };


    return { filters, handleChange };
}
