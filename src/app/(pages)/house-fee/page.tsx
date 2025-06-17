'use client';

import HouseFeeSummary from 'src/features/houseFee/components/HouseFeeSummary';
import HouseFeeChart from 'src/features/houseFee/components/HouseFeeChart';
import { useTransactionData } from 'src/features/dashboard/hooks/useTransactionData';
import { useTransactionFilter } from 'src/features/dashboard/hooks/useTransactionFilter';
import TransactionFilters from 'src/features/dashboard/components/TransactionFilters';
import { useHouseFeeData } from 'src/features/houseFee/hooks/useHouseFeeData';

export default function HouseFeePage() {
    const { filters, handleChange } = useTransactionFilter();
    // 1. Fetch raw data
    const { transactions } = useTransactionData(filters);

    // 2. Process all data with a single, memoized hook call
    const { summaryData, rentChartData } = useHouseFeeData(transactions ?? []);

    // 3. Render the UI
    return (
        <main className="p-6 space-y-10 max-w-7xl mx-auto">
            {/* Page Header */}
            <section>
                <h1 className="text-3xl font-bold mb-2">🏠 Monthly House Fee</h1>
                <p className="text-gray-600">
                    A detailed breakdown of your rent, management, and electric fees across each month.
                </p>
            </section>

            {/* Filters */}
            <section className='bg-white rounded-xl shadow p-4'>
                <h2 className="text-xl font-semibold mb-2">Filter Your Transactions</h2>
                <p className="text-gray-600 mb-4">
                    Use these filters to customize the data shown on your dashboard.
                </p>
                <TransactionFilters filters={filters} handleChange={handleChange} />
            </section>

            {/* Summary Section */}
            <section>
                <h2 className="text-2xl font-semibold mb-4">📊 Summary</h2>
                <HouseFeeSummary monthlyReport={summaryData} />
            </section>

            {/* Chart Visualization */}
            <section className='bg-white rounded-xl shadow p-4'>
                <h2 className="text-2xl font-semibold mb-4">📈 Rent Fee Trend</h2>
                <p className="text-gray-600 mb-4">
                    This chart illustrates how your *rent expenses* have changed over time.
                </p>
                <HouseFeeChart data={rentChartData} />
            </section>
        </main>
    );
}