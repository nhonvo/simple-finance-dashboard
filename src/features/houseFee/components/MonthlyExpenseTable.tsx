import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { MonthlyReportItem } from "src/features/houseFee/service/houseFeeService";

type Props = {
    monthlyReport: MonthlyReportItem[];
};

const MonthlyExpenseTable = ({ monthlyReport }: Props) => {
    return (
        <section className="overflow-x-auto bg-white rounded-xl shadow p-4">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">
                Monthly Expense Distribution
            </h3>
            <Table className="w-full text-sm">
                <TableHeader className="bg-blue-50 text-blue-900 font-semibold">
                    <TableRow>
                        <TableHead className="px-4 py-3 border-b">Month</TableHead>
                        <TableHead className="px-4 py-3 border-b text-right">Rent Payment</TableHead>
                        <TableHead className="px-4 py-3 border-b text-right">Management Fee</TableHead>
                        <TableHead className="px-4 py-3 border-b text-right">Utility Payment</TableHead>
                        <TableHead className="px-4 py-3 border-b text-right">Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {monthlyReport.map((item) => (
                        <TableRow
                            key={item.month}
                            className="even:bg-gray-50 hover:bg-blue-50 transition-colors"
                        >
                            <TableCell className="px-4 py-2 border-b">{item.month}</TableCell>
                            <TableCell className="px-4 py-2 border-b text-right text-green-600">
                                {item.formattedRentPayment}
                            </TableCell>
                            <TableCell className="px-4 py-2 border-b text-right">
                                {item.formattedManagementFee}
                            </TableCell>
                            <TableCell className="px-4 py-2 border-b text-right">
                                {item.formattedUtilityPayment}
                            </TableCell>
                            <TableCell className="px-4 py-2 border-b text-right font-semibold">
                                {item.formattedSum}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </section>
    );
};

export default MonthlyExpenseTable;
