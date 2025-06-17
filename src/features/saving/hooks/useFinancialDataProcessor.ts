import { useMemo } from 'react';
import { Transaction } from 'src/shared/types/Transaction';
import { formatCurrency } from 'src/shared/utilities/formatData';

export const useFinancialDataProcessor = (transactions: Transaction[]) => {
    return useMemo(() => {
        if (!transactions || transactions.length === 0) {
            return { monthlyData: [], barChartData: [], lineChartData: [], tableData: [], total: 0 };
        }

        const monthlyMap = new Map<string, number>();

        for (const transaction of transactions) {
            const monthKey = new Date(transaction.transaction_date).toISOString().slice(0, 7); // YYYY-MM
            const current = monthlyMap.get(monthKey) ?? 0;
            monthlyMap.set(monthKey, current - transaction.credit + transaction.debit);
        }

        const sortedMonths = Array.from(monthlyMap.entries()).sort(([a], [b]) => a.localeCompare(b));

        let cumulative = 0;
        const monthlyData = sortedMonths.map(([date, balance]) => {
            cumulative += balance;
            return {
                date,
                balance,
                cumulativeBalance: cumulative,
            };
        });

        // The final cumulative balance is the total
        const total = monthlyData.length > 0 ? monthlyData[monthlyData.length - 1].cumulativeBalance : 0;
        
        const barChartData = monthlyData.map(item => ({ date: item.date, balance: item.balance }));
        const lineChartData = monthlyData.map(item => ({ date: item.date, cumulativeBalance: item.cumulativeBalance }));
        const tableData = monthlyData.slice(-10).map(item => ({
            date: item.date,
            credit: formatCurrency(item.balance),
            balance: formatCurrency(item.cumulativeBalance),
        }));

        return { barChartData, lineChartData, tableData, total };

    }, [transactions]); // This whole block only re-runs if `transactions` changes
};
