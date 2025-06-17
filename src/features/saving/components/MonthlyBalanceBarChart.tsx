import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

export interface DataPointBarChart {
    date: string;
    balance: number;
}

interface Props {
    data: DataPointBarChart[];
}

const MonthlyBalanceBarChart: React.FC<Props> = ({ data }) => {
    return (
        <div className="w-full h-[400px]">
            <h2 className="text-lg font-semibold text-red-600 mb-2">
                Monthly Balance Changes
            </h2>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{
                    top: 20,
                    right: 30,
                    left: 80, // <-- Increase this value to give the Y-axis more space
                    bottom: 5,
                }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                    <XAxis dataKey="date" />
                    <YAxis tickFormatter={(value) => `VND ${value.toLocaleString()}`} />
                    <Tooltip formatter={(value) => `VND ${value.toLocaleString()}`} />
                    <Bar dataKey="balance" fill="rgba(150, 20, 20, 0.7)" name="Monthly Balance" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default MonthlyBalanceBarChart;
