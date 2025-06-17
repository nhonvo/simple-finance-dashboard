'use client';

import React, { useMemo, useState } from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
    TooltipProps,
} from 'recharts';
import { formatCurrency } from 'src/shared/utilities/formatData';
import { Transaction } from 'src/shared/types/Transaction';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { BLUE_COLORS } from 'src/shared/types/color';

// --- TYPE DEFINITIONS ---
interface Props {
    transactions: Transaction[];
}

// Type for the data structure used by the chart
interface ChartDataItem {
    name: string;
    value: number;
    total: number; // Total is included for easy percentage calculation
}

// --- UI COMPONENTS ---
const CustomTooltip = ({ active, payload }: TooltipProps<ValueType, NameType>) => {
    // Check if the tooltip is active and has data
    if (active && payload && payload.length) {
        // The actual data for our slice is in payload[0].payload
        const dataItem = payload[0].payload as ChartDataItem;

        // Calculate the percentage
        const percent = ((dataItem.value / dataItem.total) * 100).toFixed(1);

        return (
            <div className="bg-white/90 backdrop-blur-sm shadow-lg p-3 border border-gray-200 rounded-lg text-sm text-gray-800">
                <div className="flex items-center mb-1">
                    <div
                        className="w-3 h-3 rounded-full mr-2 border border-white"
                        style={{ backgroundColor: payload[0].color }}
                    ></div>
                    <p className="font-bold">{dataItem.name}</p>
                </div>
                <p className="pl-5">
                    <strong>Value:</strong> {formatCurrency(dataItem.value)}
                </p>
                <p className="pl-5">
                    <strong>Percent:</strong> {percent}%
                </p>
            </div>
        );
    }
    return null;
};

const TransactionDistributionChart = ({ transactions }: Props) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const chartData = useMemo(() => {
        // 2. Explicitly filter for transactions with debit > 0 at the very beginning.
        const expenseTransactions = transactions?.filter(tx => tx.debit > 0) || [];

        if (expenseTransactions.length === 0) return [];

        const dataMap = new Map<string, number>();
        expenseTransactions.forEach(({ counter_account, debit, credit }) => {
            if (counter_account) {
                dataMap.set(counter_account, (dataMap.get(counter_account) || 0) + debit - credit);
            }
        });
        const total = Array.from(dataMap.values()).reduce((acc, val) => acc + val, 0);
        if (total === 0) return [];

        // Consolidate small slices into an "Others" category for clarity
        const OTHERS_THRESHOLD = 0.01; // Group items under 3%
        let othersValue = 0;
        const mainData: ChartDataItem[] = [];

        for (const [name, value] of dataMap.entries()) {
            if (value / total < OTHERS_THRESHOLD) {
                othersValue += value;
            } else {
                mainData.push({ name, value, total });
            }
        }

        if (othersValue > 0) {
            mainData.push({ name: 'Others', value: othersValue, total });
        }

        return mainData.sort((a, b) => b.value - a.value);
    }, [transactions]);

    const onPieEnter = (_: ChartDataItem, index: number) => {
        setActiveIndex(index);
    };

    const onPieLeave = () => {
        setActiveIndex(null);
    };

    return (
        <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        innerRadius={60}
                        paddingAngle={2}
                        activeIndex={activeIndex ?? -1}
                        onMouseEnter={onPieEnter}
                        onMouseLeave={onPieLeave}
                        labelLine={false}
                    >
                        {chartData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={BLUE_COLORS[index % BLUE_COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        layout="vertical"
                        align="right"
                        verticalAlign="middle"
                        iconSize={10}
                        wrapperStyle={{ fontSize: '12px', maxHeight: '250px', overflowY: 'auto' }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TransactionDistributionChart;