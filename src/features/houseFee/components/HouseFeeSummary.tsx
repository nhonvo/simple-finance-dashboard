import React from "react";
import MonthlyExpenseTable from "./MonthlyExpenseTable";
import AreaChartComponent from "./AreaChartComponent";
import { MonthlyReportItem } from "src/features/houseFee/service/houseFeeService";

type Props = {
    monthlyReport: MonthlyReportItem[];
};

const CHART_CONFIGS = [
    {
        key: "rentPayment",
        color: "#1f77b4",
        name: "Rent Payment",
        title: "Monthly Rent Payments",
    },
    {
        key: "managementFee",
        color: "#2ca02c",
        name: "Management Fee",
        title: "Monthly Management Fees",
    },
    {
        key: "utilityPayment",
        color: "#ff7f0e",
        name: "Electric Bill",
        title: "Monthly Electric Bill",
    },
];

const ChartSection = ({
    data,
    title,
    dataKey,
    color,
    name,
}: {
    data: MonthlyReportItem[];
    title: string;
    dataKey: keyof MonthlyReportItem;
    color: string;
    name: string;
}) => (
    <section className="mt-10">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">{title}</h3>
        <AreaChartComponent
            data={data}
            dataKey={dataKey}
            strokeColor={color}
            fillColor={color}
            name={name}
        />
    </section>
);

const HouseFeeSummary = ({ monthlyReport }: Props) => {
    return (
        <div className="house-fee-summary px-4 py-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">Household Expense Summary</h2>
            <p className="text-gray-600 mb-6">
                This section provides a comprehensive overview of your household expenses, including
                monthly rent, management fees, and utility payments. The insights below offer a
                breakdown of each category to help track and manage monthly costs.
            </p>

            <MonthlyExpenseTable monthlyReport={monthlyReport} />

            {CHART_CONFIGS.map(({ key, color, name, title }) => (
                <ChartSection
                    key={key}
                    data={monthlyReport}
                    dataKey={key as keyof MonthlyReportItem}
                    color={color}
                    name={name}
                    title={title}
                />
            ))}
        </div>
    );
};

export default HouseFeeSummary;
