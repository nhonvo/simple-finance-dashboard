"use client";
import TransactionFilters from "src/features/dashboard/components/TransactionFilters";
import BalanceLineChart from "src/features/dashboard/components/BalanceLineChart";
import MonthlyIncomeExpenseChart from "src/features/dashboard/components/MonthlyIncomeExpenseChart";
import TableTransaction from "src/features/dashboard/components/TableTransaction";
import ExpenseTreeMap from "src/features/dashboard/components/ExpenseTreeMap";
import DetailedTransactionAnalysis from "src/features/dashboard/components/DetailedTransactionAnalysisChart";
import TransactionDistributionChart from "src/features/dashboard/components/TransactionDistributionChart";
import { useTransactionData } from "src/features/dashboard/hooks/useTransactionData";
import { Transaction } from "src/shared/types/Transaction";
import { useTransactionFilter } from "src/features/dashboard/hooks/useTransactionFilter";
import SummaryCards from "src/features/dashboard/components/SummaryCards";
import { getDefaultDateRange } from "src/shared/utilities/getDefaultDateRange";
import { useExpenseTreeData } from 'src/features/dashboard/hooks/useExpenseTreeData';

export default function Dashboard() {
    const {  end_date } = getDefaultDateRange();

    const { filters, handleChange } = useTransactionFilter("01-01-2000", end_date);

    const {
        transactions,
        error,
        loading,
    } = useTransactionData(filters);


    const { expenseTreeMap: data } = useExpenseTreeData(filters);

    return (
        <main className="flex-1 p-6 space-y-12 max-w-7xl mx-auto">
            {/* Overview Section */}
            <section id="overview">
                <h2 className="text-2xl font-bold mb-4">Overview Summary</h2>
                <p className="text-gray-600 mb-6">
                    Get a quick summary of your financial status including total income,
                    expenses, balance, and savings.
                </p>
                <SummaryCards filters={filters} />
            </section>

            {/* Filters */}
            <section className="bg-white rounded-xl shadow p-4">
                <h2 className="text-xl font-semibold mb-2">Filter Your Transactions</h2>
                <p className="text-gray-600 mb-4">
                    Use these filters to customize the data shown on your dashboard.
                    Filter by date range, category, or account.
                </p>
                <TransactionFilters filters={filters} handleChange={handleChange} />
            </section>

            {/* Monthly Trends */}
            <section id="monthly" className="bg-white rounded-xl shadow p-4">
                <h2 className="text-2xl font-bold mb-4">Monthly Trends</h2>
                <p className="text-gray-600 mb-6">
                    Visualize how your income and expenses change month by month to
                    identify patterns or unusual spending.
                </p>
                <MonthlyIncomeExpenseChart transactions={transactions} />
                <BalanceLineChart
                    data={transactions.map((tx: Transaction) => ({
                        transaction_date: tx.transaction_date,
                        balance: tx.balance,
                    }))}
                />
            </section>

            {/* Transaction Table */}
            <section className="bg-white rounded-xl shadow p-4">
                <h2 className="text-2xl font-bold mb-4">Detailed Transactions</h2>
                <p className="text-gray-600 mb-6">
                    Review your individual transactions in the sortable table below. Click
                    on column headers to sort.
                </p>
                <TableTransaction
                    loading={loading}
                    error={error}
                    transactions={transactions}
                />
            </section>

            {/* Tree Map */}
            <section id="highlight">
                <h2 className="text-2xl font-bold mb-4">
                    Expense Breakdown by Category
                </h2>
                <p className="text-gray-600 mb-6">
                    Understand where your money goes with this visual representation of
                    your expenses by category.
                </p>
                <ExpenseTreeMap data={data ?? []} />
            </section>

            {/* Additional Insights */}
            <section className="bg-white rounded-xl shadow p-4">
                <h2 className="text-2xl font-bold mb-4">Transaction Analysis</h2>
                <p className="text-gray-600 mb-6">
                    Dive deeper into your transaction behavior with detailed charts and
                    distribution views.
                </p>
                <DetailedTransactionAnalysis transaction={transactions} />
                <TransactionDistributionChart transactions={transactions} />
            </section>
        </main>
    );
}

