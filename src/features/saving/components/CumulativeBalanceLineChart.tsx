import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { formatCurrency } from 'src/shared/utilities/formatData';

export interface DataPoint {
    date: string;
    cumulativeBalance: number;
}

interface Props {
    data: DataPoint[];
}

const CumulativeBalanceLineChart: React.FC<Props> = ({ data }) => {
    return (
        <div className="w-full h-[400px]">
            <h2 className="text-lg font-semibold text-blue-600 mb-2">
                Cumulative Balance Over Time
            </h2>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{
                    top: 20,
                    right: 30,
                    left: 80, // <-- Increase this value to give the Y-axis more space
                    bottom: 5,
                }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                    <XAxis dataKey="date" />
                    <YAxis
                        tickFormatter={(value) => `VND ${formatCurrency(value)}`}
                        tick={{ fill: '#4a4a4a' }}
                        axisLine={{ stroke: '#BBBBBB', strokeWidth: 1.2 }}
                    />
                    <Tooltip formatter={(value) => `VND ${formatCurrency(value as number)}`} />
                    <Line
                        type="monotone"
                        dataKey="cumulativeBalance"
                        stroke="rgba(0, 123, 255, 0.8)"
                        strokeWidth={2}
                        dot={{ r: 4, fill: 'rgba(0, 123, 255, 0.8)' }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CumulativeBalanceLineChart;
