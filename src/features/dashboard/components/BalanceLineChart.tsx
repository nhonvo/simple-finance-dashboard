'use client';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { formatCurrency, formatDate } from 'src/shared/utilities/formatData';

interface ChartData {
    transaction_date: Date;
    balance: number;
}

export default function BalanceLineChart({ data }: { data: ChartData[] }) {
    return (
        <section className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Balance Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 80, // <-- Increase this value to give the Y-axis more space
                        bottom: 5,
                    }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="transaction_date"
                        tickFormatter={formatDate}
                    />
                    <YAxis
                        tickFormatter={(value) => `VND ${formatCurrency(value)}`}
                        tick={{ fill: '#4a4a4a' }}
                        axisLine={{ stroke: '#BBBBBB', strokeWidth: 1.2 }}
                    />
                    <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                        labelFormatter={(label: Date | string) =>
                            `Ngày ${formatDate(label)}`
                        }
                    />
                    <Line
                        type="monotone"
                        dataKey="balance"
                        stroke="#3b82f6"
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </section>
    );
}
