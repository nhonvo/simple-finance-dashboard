'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency, formatDate } from 'src/shared/utilities/formatData';
import { Transaction } from 'src/shared/types/Transaction';

type Props = {
    transactions: Transaction[];
};
export default function MonthlyIncomeExpenseChart({ transactions }: Props) {

    // Group by month
    const dataMap = new Map<string, { income: number; expense: number }>();

    transactions.forEach(({ transaction_date, debit, credit }) => {
        const date = formatDate(transaction_date)
        const prev = dataMap.get(date) || { income: 0, expense: 0 };

        dataMap.set(date, {
            income: prev.income + credit,
            expense: prev.expense + debit,
        });
    });


    const chartData = Array.from(dataMap.entries()).map(([month, { income, expense }]) => ({
        month,
        income,
        expense,
    }));

    return (
        <div className="w-full h-[400px] ">
            <h2 className="text-lg font-semibold mb-4">Monthly Income & Expenses</h2>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 80, // <-- Increase this value to give the Y-axis more space
                        bottom: 5,
                    }}>
                    <XAxis dataKey="month" />
                    <YAxis
                        tickFormatter={(value) => `VND ${formatCurrency(value)}`}
                        tick={{ fill: '#4a4a4a' }}
                        axisLine={{ stroke: '#BBBBBB', strokeWidth: 1.2 }}
                    />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="income" fill="#10b981" name="Income" />
                    <Bar dataKey="expense" fill="#ef4444" name="Expenses" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
