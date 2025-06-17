import React, { useMemo } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    CartesianGrid,
    TooltipProps,
} from 'recharts';
import { formatCurrency, formatDate } from 'src/shared/utilities/formatData';
import { Transaction } from 'src/shared/types/Transaction';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { BLUE_COLORS } from 'src/shared/types/color';

interface Props {
    transaction: Transaction[];
}

interface AggregatedDay {
    transaction_date: string;
    [category: string]: number | string; // Index Signature
}
const DetailedTransactionAnalysis = ({ transaction }: Props) => {
    // Inside your component...
    const { aggregatedData, categories, colorMap } = useMemo(() => {
        // Return a "no data" state if data is empty
        if (!transaction || transaction.length === 0) {
            return { aggregatedData: [], categories: [], colorMap: {} };
        }

        // Use a string 'YYYY-MM-DD' for the key
        const aggregatedMap = transaction.reduce<Record<string, AggregatedDay>>((acc, { transaction_date, category, debit }) => {
            const dateKey = new Date(transaction_date).toISOString().split('T')[0];

            if (!acc[dateKey]) {
                acc[dateKey] = { transaction_date: dateKey };
            }

            acc[dateKey][category] = (acc[dateKey][category] as number || 0) + debit;
            return acc;
        }, {});

        const finalAggregatedData = Object.values(aggregatedMap);
        const finalCategories = Array.from(new Set(transaction.map(d => d.category)));
        const finalColorMap = finalCategories.reduce<Record<string, string>>((acc, category, i) => {
            acc[category] = BLUE_COLORS[i % BLUE_COLORS.length];
            return acc;
        }, {});

        return {
            aggregatedData: finalAggregatedData,
            categories: finalCategories,
            colorMap: finalColorMap
        };
    }, [transaction]); // Only re-run when data changes

    if (aggregatedData.length === 0) {
        return (
            <div style={{ width: '100%', height: 400, display: 'grid', placeContent: 'center' }}>
                <p className="text-gray-500">No transaction data available for this period.</p>
            </div>
        );
    }

    return (
        <div className="w-full h-[400px] bg-white rounded-xl shadow p-4">
            <ResponsiveContainer>
                <BarChart data={aggregatedData}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 80, // <-- Increase this value to give the Y-axis more space
                        bottom: 5,
                    }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(200, 200, 200, 0.3)" />
                    <XAxis
                        dataKey="transaction_date"
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        tick={{ fill: '#4a4a4a' }}
                        tickLine={false}
                        tickFormatter={(value) => `${formatDate(value)}`}
                        axisLine={{ stroke: '#BBBBBB', strokeWidth: 1.2 }}
                        interval="preserveStartEnd"
                    />
                    <YAxis
                        tickFormatter={(value) => `VND ${formatCurrency(value)}`}
                        tick={{ fill: '#4a4a4a' }}
                        axisLine={{ stroke: '#BBBBBB', strokeWidth: 1.2 }}
                    />
                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: 'rgba(200, 200, 200, 0.15)' }} // Adds a hover effect
                    />
                    <Legend verticalAlign="top" height={36} />
                    {categories.map(category => (
                        <Bar
                            key={category}
                            dataKey={category}
                            stackId="a"
                            fill={colorMap[category]}
                            stroke="rgba(0,0,0,0.5)"
                            strokeWidth={0.5}
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

// Custom tooltip to show category, date, expense
const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-2 bg-white border rounded shadow-lg">
                <p className="font-bold">{label}</p>
                {payload.map((entry) => (
                    <p key={`item-${entry.dataKey}`} style={{ color: entry.color }}>
                        {entry.name}: {formatCurrency(entry.value as number)}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};
export default DetailedTransactionAnalysis;
