'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useOverviewData } from '../hooks/useOverviewData';
import { TransactionFiltersProps } from 'src/features/dashboard/types/TransactionFiltersProps';
import { formatCurrency } from 'src/shared/utilities/formatData';

interface Props {
    filters: TransactionFiltersProps;
}

interface SummaryCardItemProps {
    label: string;
    value: number;
    color?: string;
}

function SummaryCardItem({ label, value, color = 'text-gray-700' }: SummaryCardItemProps) {
    return (
        <Card>
            <CardContent className="p-4">
                <p className="text-sm text-gray-500">{label}</p>
                <p className={`text-xl font-bold ${color}`}>{formatCurrency(value)}</p>
            </CardContent>
        </Card>
    );
}

export default function SummaryCards({ filters }: Props) {

    const { overview } = useOverviewData(filters);
    const {
        totalSaving = 0,
        // allTimeAsset = 0,
        availableBalance = 0,
        monthlySavingBalance = 0,
        monthlyInvestmentBalance = 0,
        transactionCount = 0,
        totalExpense = 0,
        totalIncome = 0,
        netChange = 0,
    } = overview || {};

    const items: SummaryCardItemProps[] = [
        { label: 'Monthly Income', value: totalIncome, color: 'text-green-600' },
        { label: 'Available Balance', value: availableBalance, color: 'text-blue-600' },
        { label: 'Monthly Saving', value: monthlySavingBalance, color: 'text-orange-500' },
        { label: 'Monthly Investment', value: monthlyInvestmentBalance, color: 'text-purple-600' },

        // Expenses
        { label: 'Total Expense', value: totalExpense, color: 'text-red-600' },

        // Movement
        { label: 'Net Change', value: netChange, color: netChange >= 0 ? 'text-green-600' : 'text-red-600' },

        // Activity
        { label: 'Monthly Transactions', value: transactionCount, color: 'text-gray-600' },
        // Assets & Balances
        // { label: 'All Assets', value: allTimeAsset, color: 'text-green-600' },
        { label: 'Total Saving', value: totalSaving, color: 'text-blue-600' },
    ];

    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {items.map((item, index) => (
                <SummaryCardItem key={index} {...item} />
            ))}
        </section>
    );
}
