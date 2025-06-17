import { useMemo } from 'react';
import { Transaction } from 'src/shared/types/Transaction';
import { formatCurrency } from 'src/shared/utilities/formatData';

interface MonthlySum {
    month: string; // e.g., "2023-01"
    amount: number;
}

interface MonthlyReportItem {
    month: string;
    rentPayment: number;
    managementFee: number;
    utilityPayment: number;
    sum: number;
    formattedRentPayment: string;
    formattedManagementFee: string;
    formattedUtilityPayment: string;
    formattedSum: string;
}

export const useHouseFeeData = (transactions: Transaction[]) => {
    return useMemo(() => {
        if (!transactions || transactions.length === 0) {
            return { summaryData: [], rentChartData: [] };
        }

        // --- Helper function to filter and group in one step ---
        const processCategory = (keywords: string[]): MonthlySum[] => {
            const monthlyMap = new Map<string, number>();

            for (const tx of transactions) {
                const matchesKeywords = keywords.some(k => tx.counter_account?.toLowerCase().includes(k));
                if (tx.category === "rent" && matchesKeywords) {
                    const monthKey = new Date(tx.transaction_date).toISOString().slice(0, 7);
                    monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + tx.debit);
                }
            }
            return Array.from(monthlyMap.entries())
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([month, amount]) => ({ month, amount }));
        };

        // --- Process each category ---
        const rentGrouped = processCategory(['tiền nhà']);
        const managementGrouped = processCategory(['phí quản lý']);
        const electricGrouped = processCategory(['tiền điện nước', 'tiền điện']);

        // --- Merge reports ---
        const allMonths = Array.from(new Set([
            ...rentGrouped.map(item => item.month),
            ...managementGrouped.map(item => item.month),
            ...electricGrouped.map(item => item.month),
        ])).sort();

        const summaryData: MonthlyReportItem[] = allMonths.map(month => {
            const rentPayment = rentGrouped.find(item => item.month === month)?.amount || 0;
            const managementFee = managementGrouped.find(item => item.month === month)?.amount || 0;
            const utilityPayment = electricGrouped.find(item => item.month === month)?.amount || 0;
            const sum = rentPayment + managementFee + utilityPayment;

            return {
                month,
                rentPayment,
                managementFee,
                utilityPayment,
                sum,
                formattedRentPayment: formatCurrency(rentPayment),
                formattedManagementFee: formatCurrency(managementFee),
                formattedUtilityPayment: formatCurrency(utilityPayment),
                formattedSum: formatCurrency(sum),
            };
        });

        // --- Prepare data specifically for the rent chart ---
        const rentChartData = rentGrouped.map(({ month, amount }) => ({
            month,
            amount,
            formattedAmount: formatCurrency(amount),
        }));

        return { summaryData, rentChartData };

    }, [transactions]); // The magic: This entire block only runs when `transactions` changes.
};
