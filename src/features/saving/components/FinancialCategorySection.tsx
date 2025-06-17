import SavingTable, { Row } from '../../../features/saving/components/SavingTable';
import CumulativeBalanceLineChart, { DataPoint as DataPointLineChart } from '../../../features/saving/components/CumulativeBalanceLineChart';
import MonthlyBalanceBarChart, { DataPointBarChart } from '../../../features/saving/components/MonthlyBalanceBarChart';
import { formatCurrency } from 'src/shared/utilities/formatData';


interface FinancialCategoryProps {
    title: string;
    description: string;
    icon: string;
    total: number;
    tableData: Row[]; 
    lineData: DataPointLineChart[];
    barData: DataPointBarChart[];
}

export const FinancialCategorySection = ({ title, description, icon, total, tableData, lineData, barData }: FinancialCategoryProps) => (
    <section className='bg-white rounded-xl shadow p-4'>
        <h2 className="text-2xl font-semibold mt-12 mb-2">{`${icon} ${title}`}</h2>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="text-green-700 text-lg font-bold mb-4">{formatCurrency(total)}</div>
        
        <SavingTable rows={tableData} />

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
            <CumulativeBalanceLineChart data={lineData} />
            <MonthlyBalanceBarChart data={barData} />
        </div>
    </section>
);