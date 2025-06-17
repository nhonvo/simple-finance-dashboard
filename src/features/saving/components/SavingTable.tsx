import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export interface Row {
    date: string;
    credit: string;
    balance: string;
}

interface Props {
    rows: Row[];
}

const SavingTable = ({ rows }: Props) => {
    return (
        <div className="overflow-x-auto">
            <h2 className="text-xl font-semibold text-green-700 mb-4">Saving Summary</h2>
            <Table className="min-w-full text-sm text-gray-700 ">
                <TableHeader className="bg-green-50 text-center">
                    <TableRow>
                        <TableHead className="px-4 py-3 font-semibold border-b">Date</TableHead>
                        <TableHead className="px-4 py-3 font-semibold border-b">Credit</TableHead>
                        <TableHead className="px-4 py-3 font-semibold border-b">Cumulative Balance</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map(({ date, credit, balance }, index) => (
                        <TableRow
                            key={index}
                            className="hover:bg-green-50 transition-colors even:bg-gray-50 text-center"
                        >
                            <TableCell className="px-4 py-2 border-b">{date}</TableCell>
                            <TableCell className="px-4 py-2 border-b text-green-600 font-medium">{credit}</TableCell>
                            <TableCell className="px-4 py-2 border-b font-semibold">{balance}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default SavingTable;
