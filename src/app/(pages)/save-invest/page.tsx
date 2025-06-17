'use client';

import { useInvestData } from 'src/features/saving/hooks/useInvestData';
import { useSavingData } from 'src/features/saving/hooks/useSavingData';
import TransactionFilters from 'src/features/dashboard/components/TransactionFilters';
import { useTransactionFilter } from 'src/features/dashboard/hooks/useTransactionFilter';
import { useFinancialDataProcessor } from 'src/features/saving/hooks/useFinancialDataProcessor';
import { FinancialCategorySection } from 'src/features/saving/components/FinancialCategorySection';

export default function SavingPage() {
    const { filters, handleChange } = useTransactionFilter();
    const { saving } = useSavingData(filters);
    const { invest } = useInvestData(filters);

    // Use the custom hook for both datasets. All calculations are memoized.
    const { barChartData: barSavingData, lineChartData: lineSavingData, tableData: tableSavingData, total: totalSaving } = useFinancialDataProcessor(saving ?? []);
    const { barChartData: barInvestData, lineChartData: lineInvestData, tableData: tableInvestData, total: totalInvest } = useFinancialDataProcessor(invest ?? []);

    return (
        <main className="flex-1 p-6 space-y-12 max-w-7xl mx-auto">
            {/* Header */}
            <section>
                <h1 className="text-3xl font-bold mb-2">Savings & Investments</h1>
                <p className="text-gray-600">
                    Track your savings and investment progress over time. Analyze trends and gain insights to improve your financial planning.
                </p>
            </section>
            
            {/* Filters */}
            <section className='bg-white rounded-xl shadow p-4'>
                <h2 className="text-xl font-semibold mb-2">Filter Your Transactions</h2>
                <p className="text-gray-600 mb-4">
                    Use these filters to customize the data shown on your dashboard.
                    Filter by date range, category, or account.
                </p>
                <TransactionFilters filters={filters} handleChange={handleChange} />
            </section>

            {/* Savings Section (Now a reusable component) */}
            <FinancialCategorySection
                title="Your Savings"
                icon="💰"
                description="Review your total savings, track your cumulative progress, and explore month-by-month changes."
                total={totalSaving}
                tableData={tableSavingData}
                lineData={lineSavingData}
                barData={barSavingData}
            />

            {/* Investments Section (Now a reusable component) */}
            <FinancialCategorySection
                title="Your Investments"
                icon="📈"
                description="Get a clear view of your investments with cumulative and monthly breakdowns."
                total={totalInvest}
                tableData={tableInvestData}
                lineData={lineInvestData}
                barData={barInvestData}
            />
        </main>
    );
}