import { Transaction } from 'src/shared/types/Transaction';
import { FetchTransactionsParams } from "src/shared/types/FetchTransactionsParams";
import { getTransactions } from "../transactions/getTransactions";
import { applyFiltersIgnoreData } from "src/shared/utilities/applyQuery";
import { excludeSavingInvestFilters } from "src/shared/types/filterKeywords";
import { getSavingTransactions } from '../saving/getSavingTransactions';
import { getInvestTransactions } from '../investment/getInvestTransactions';

function calculateTransactionSum(
    transactions: Transaction[],
    selector: (tx: Transaction) => number
): number {
    return transactions.reduce((sum, tx) => sum + selector(tx), 0);
}

function calculateAbsSum(transactions: Transaction[]): number {
    return transactions.reduce((sum, tx) => sum + (tx.debit ?? 0), 0)
        - transactions.reduce((sum, tx) => sum + (tx.credit ?? 0), 0);
}

export async function generateOverviewData(params: FetchTransactionsParams) {
    const allParams = {
        order_by: true,
        sort_by: 'transaction_date',
        offset: 0,
        clean: false,
        limit: -1,
    };

    // Fetch transactions
    params.clean = false;
    params.sort_by = "transaction_date";
    params.order_by = false;
    const monthlyTransactions = await getTransactions(params);
    const monthlyCleanTransactions = applyFiltersIgnoreData(monthlyTransactions, excludeSavingInvestFilters);
    const monthlySavingTransactions = await getSavingTransactions(params);
    const monthlyInvestmentTransactions = await getInvestTransactions(params);

    const totalSavingTransactions = await getSavingTransactions(allParams);
    const totalInvestmentTransactions = await getInvestTransactions(allParams);

    // Balances
    const availableBalance = monthlyTransactions[0]?.balance ?? 0;
    const monthlySavingBalance = calculateAbsSum(monthlySavingTransactions);

    const monthlyInvestmentBalance = calculateAbsSum(monthlyInvestmentTransactions);
    const totalSavingBalance = calculateAbsSum(totalSavingTransactions);
    const totalInvestmentBalance = calculateAbsSum(totalInvestmentTransactions);

    // Assets
    const allTimeAsset = totalSavingBalance + totalInvestmentBalance + availableBalance;

    // Incomes and Expenses
    const totalExpense = calculateTransactionSum(monthlyCleanTransactions, tx => tx.debit ?? 0);
    const totalIncome = calculateTransactionSum(monthlyCleanTransactions, tx => tx.credit ?? 0);

    // Other metrics
    const transactionCount = monthlyTransactions.length;
    const totalSaving = totalSavingBalance + totalInvestmentBalance;
    const netChange = totalIncome - totalExpense;

    return {
        // Monthly metrics
        availableBalance,
        monthlySavingBalance,
        monthlyInvestmentBalance,
        transactionCount,
        totalExpense,
        totalIncome,
        netChange,

        // Total (historical) assets
        totalSaving,
        totalSavingBalance,
        totalInvestmentBalance,
        allTimeAsset,

        // Suggested extras
        monthlySavingTransactionsCount: monthlySavingTransactions.length,
        monthlyInvestmentTransactionsCount: monthlyInvestmentTransactions.length,
        totalTransactions: transactionCount + totalSavingTransactions.length + totalInvestmentTransactions.length,
    };
}