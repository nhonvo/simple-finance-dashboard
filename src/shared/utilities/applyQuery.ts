import { Transaction } from 'src/shared/types/Transaction';

export function applyFiltersIgnoreData(
    transactions: Transaction[],
    filters: [keyof Transaction, string][]
): Transaction[] {
    return filters.reduce((data, [field, value]) => {
        return data.filter(t => {
            const fieldValue = t[field]?.toString().toLowerCase();
            return !fieldValue?.includes(value.toLowerCase());
        });
    }, transactions);
}

export function applyFilters(
    transactions: Transaction[],
    filters: [keyof Transaction, string][]
): Transaction[] {
    return transactions.filter(t => {
        return filters.some(([field, value]) => {
            const fieldValue = t[field];
            if (fieldValue == null) return false;
            return fieldValue.toString().toLowerCase().includes(value.toLowerCase());
        });
    });
}
