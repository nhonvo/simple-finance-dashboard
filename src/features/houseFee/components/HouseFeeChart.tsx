import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MonthlyHouseFee } from 'src/features/houseFee/service/houseFeeService';
import { formatCurrency } from 'src/shared/utilities/formatData';


type Props = {
    data: MonthlyHouseFee[];
};

const HouseFeeChart = ({ data }: Props) => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{
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
                <Tooltip formatter={(value: number) => value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} />
                <Legend />
                <Bar dataKey="amount" fill="#1f77b4" name="House Fee" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default HouseFeeChart;
