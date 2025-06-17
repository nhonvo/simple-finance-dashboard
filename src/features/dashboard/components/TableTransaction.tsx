
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SortableColumn } from '../../../shared/types/SortableColumn';
import { formatCurrency, formatDate } from 'src/shared/utilities/formatData';
import { Transaction } from 'src/shared/types/Transaction';
import PaginationControls from './PaginationControls';
import { usePagination } from '../hooks/usePagination';
import { useTransactionSorting } from '../hooks/useTransactionSorting';

type Props = {
    loading: boolean,
    error: string | null,
    transactions: Transaction[],
};

export default function TableTransaction({
    loading,
    error,
    transactions,
}: Props) {

    const {
        sortedTransactions,
        sortColumn,
        sortOrder,
        handleSort
    } = useTransactionSorting(transactions);

    const {
        paginatedData,
        currentPage,
        totalPages,
        handlePageChange,
    } = usePagination(sortedTransactions, { itemsPerPage: 20 });

    return (
        <section>
            {loading ? (
                <p className="text-gray-500">Loading transactions...</p>
            ) : error ? (
                <p className="text-red-600">Error: {error}</p>
            ) : (
                <>
                    <Table className="min-w-full border border-gray-300 mt-4">
                        <TableHeader className="bg-gray-100">
                            <TableRow>
                                {['transaction_date', 'description', 'counter_account', 'debit', 'credit', 'balance', 'category'].map((col) => (
                                    <TableHead
                                        key={col}
                                        className="border px-4 py-2 cursor-pointer"
                                        onClick={() => handleSort(col as SortableColumn)}
                                    >
                                        {col.charAt(0).toUpperCase() + col.slice(1).replace('_', ' ')}{' '}
                                        {sortColumn === col && (sortOrder === 'asc' ? '↑' : '↓')}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedData.map((tx, idx) => (
                                <TableRow key={idx}>
                                    <TableCell className="border px-4 py-2">{formatDate(tx.transaction_date)}</TableCell>
                                    <TableCell className="border px-4 py-2 whitespace-normal break-words">{tx.description}</TableCell>
                                    <TableCell className="border px-4 py-2 whitespace-normal break-words">{tx.counter_account}</TableCell>
                                    <TableCell className="border px-4 py-2">{formatCurrency(tx.debit)}</TableCell>
                                    <TableCell className="border px-4 py-2">{formatCurrency(tx.credit)}</TableCell>
                                    <TableCell className="border px-4 py-2">{formatCurrency(tx.balance)}</TableCell>
                                    <TableCell className="border px-4 py-2">{tx.category}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <PaginationControls
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </>
            )}
        </section>
    );
}