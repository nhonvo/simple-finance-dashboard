import React from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";
import { MonthlyReportItem } from "../service/houseFeeService";
import { formatCurrency } from "src/shared/utilities/formatData";

type Props = {
    data: MonthlyReportItem[];
    dataKey: string;
    strokeColor: string;
    fillColor: string;
    name: string;
};

const AreaChartComponent: React.FC<Props> = ({
    data,
    dataKey,
    strokeColor,
    name,
}) => (
    <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data} margin={{
            top: 20,
            right: 30,
            left: 80, // <-- Increase this value to give the Y-axis more space
            bottom: 5,
        }}>
            <defs>
                <linearGradient id={`color${name.replace(/\s/g, "")}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={strokeColor} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
                </linearGradient>
            </defs>
            <XAxis dataKey="date" />
            <YAxis
                tickFormatter={(value) => `VND ${formatCurrency(value)}`}
                tick={{ fill: '#4a4a4a' }}
                axisLine={{ stroke: '#BBBBBB', strokeWidth: 1.2 }}
            />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip formatter={formatCurrency} />
            <Area
                type="monotone"
                dataKey={dataKey}
                stroke={strokeColor}
                fill={`url(#color${name.replace(/\s/g, "")})`}
                name={name}
            />
        </AreaChart>
    </ResponsiveContainer>
);

export default AreaChartComponent;
