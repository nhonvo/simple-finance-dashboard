import { Transaction } from 'src/shared/types/Transaction';
import { URLSearchParams } from 'url';

export function parseQueryParams(searchParams: URLSearchParams) {
    return {
        query: searchParams.get('query') || undefined,
        limit: searchParams.has('limit') ? Number(searchParams.get('limit')) : undefined,
        offset: searchParams.has('offset') ? Number(searchParams.get('offset')) : undefined,
        sort_by: searchParams.get('sort_by') || undefined,
        order_by: searchParams.has('order_by') ? searchParams.get('order_by') === 'true' : undefined,
        start_date: searchParams.get('start_date') || undefined,
        end_date: searchParams.get('end_date') || undefined,
        clean: searchParams.has('clean') ? searchParams.get('clean') === 'true' : undefined,
    };
}

export function parseExcelDate(value: string | number): Date | null {
    if (typeof value === 'number') {
        // Excel serial number to JS Date
        const excelEpoch = new Date(1899, 11, 30); // Excel's epoch starts from 1899-12-30
        return new Date(excelEpoch.getTime() + value * 86400000); // 86400000 = ms in a day
    }

    if (typeof value === 'string') {
        // Support both ISO and DD/MM/YYYY formats
        return parseDDMMYYYY(value);
    }

    return null;
}


export function parseDDMMYYYY(dateStr: unknown): Date | null {
    if (typeof dateStr !== 'string') return null;

    // If format is "YYYY-MM-DD" or "YYYY-MM-DD HH:mm:ss"
    if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
        const parsed = new Date(dateStr);
        return isNaN(parsed.getTime()) ? null : parsed;
    }

    // If format is "DD-MM-YYYY HH:mm:ss"
    if (/^\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}$/.test(dateStr)) {
        const [datePart, timePart] = dateStr.split(' ');
        const [day, month, year] = datePart.split('-').map(Number);
        const [hour, minute, second] = timePart.split(':').map(Number);
        return new Date(year, month - 1, day, hour, minute, second);
    }

    // If format is "DD/MM/YYYY"
    const parts = dateStr.split('/');
    if (parts.length == 3) {
        const [day, month, year] = parts.map(Number);
        return new Date(year, month - 1, day);
    }

    return null; // Unsupported format
}

function parseYYYYMMDD(dateStr: string): Date | null {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return null;
    const [year, month, day] = parts.map(Number);
    return new Date(year, month - 1, day); // Month is 0-based in JS
}

export function filterByDateRange(
    transactions: Transaction[],
    startDate?: string,
    endDate?: string
): Transaction[] {
    const start = startDate ? parseYYYYMMDD(startDate) : null;
    const end = endDate ? parseYYYYMMDD(endDate) : null;

    return transactions.filter(t => {
        if (!t.transaction_date) return false;

        if (start && t.transaction_date <= start) return false;
        if (end && t.transaction_date >= end) return false;

        return true;
    });
}
