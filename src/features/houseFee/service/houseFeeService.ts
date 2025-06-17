import { formatCurrency } from "src/shared/utilities/formatData";
import { Transaction } from "src/shared/types/Transaction";

export function filterHouseFeeTransactions(
    transactions: Transaction[],
    keywords: string[]
): Transaction[] {
    // Include all transactions whose category is "rent" and counter_account contains
    return transactions.filter(tx =>
        tx.category === "rent" &&
        keywords.some(k => tx.counter_account.toLowerCase().includes(k))
    );
}
export function groupHouseFeeMonthlyTotals(transactions: Transaction[]): MonthlySum[] {
    const map = new Map<string, number>();

    transactions.forEach(tx => {
        const date = new Date(tx.transaction_date);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 01 to 12
        const key = `${year}-${month}`;
        map.set(key, (map.get(key) || 0) + tx.debit);
    });


    return Array.from(map.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([month, amount]) => ({ month, amount }));
}
export interface MonthlyHouseFee {
    month: string;
    amount: number;
    formattedAmount: string;
};

export function prepareHouseFeeReport(monthlySums: MonthlySum[]): MonthlyHouseFee[] {
    return monthlySums.map(({ month, amount }) => ({
        month,
        amount,
        formattedAmount: formatCurrency(amount),
    }));
}

export interface MonthlyReportItem {
    month: string;
    rentPayment: number;
    managementFee: number;
    utilityPayment: number;
    sum: number;
    formattedRentPayment: string;
    formattedManagementFee: string;
    formattedUtilityPayment: string;
    formattedSum: string;
};
type MonthlySum = {
    month: string; // e.g. "2023-01"
    amount: number;
};

export function groupMonthlyTotals(transactions: Transaction[]): MonthlySum[] {
    const map = new Map<string, number>();


    transactions.forEach(tx => {
        const date = new Date(tx.transaction_date);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 01 to 12
        const key = `${year}-${month}`;
        map.set(key, (map.get(key) || 0) + tx.debit);
    });

    return Array.from(map.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([month, amount]) => ({ month, amount }));
}

export function mergeMonthlyReports(
    rentData: MonthlySum[],
    managementData: MonthlySum[],
    utilityData: MonthlySum[]
): MonthlyReportItem[] {
    // Collect all months
    const monthsSet = new Set([
        ...rentData.map((r) => r.month),
        ...managementData.map((m) => m.month),
        ...utilityData.map((u) => u.month),
    ]);
    const months = Array.from(monthsSet).sort();

    // Helper to find amount for a month or 0
    const findAmount = (arr: MonthlySum[], month: string) =>
        arr.find((item) => item.month === month)?.amount || 0;

    // Format currency function
    function formatCurrency(value: number): string {
        return value.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0,
        });
    }

    return months.map((month) => {
        const rentPayment = findAmount(rentData, month);
        const managementFee = findAmount(managementData, month);
        const utilityPayment = findAmount(utilityData, month);
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
}

