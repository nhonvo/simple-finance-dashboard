import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs/promises';
import { parseExcelDate } from './parseParams';
import { Transaction } from 'src/shared/types/Transaction';

export const dataPath = path.join(process.cwd(), 'src', 'shared', 'db', 'data.xlsx');

// In-memory cache
let cachedData: Transaction[] | null = null;
let lastReadTime: number | null = null;
const CACHE_TTL_MS = 60 * 60 * 1000; // 60 minutes cache

export async function readData(forceReload = false): Promise<Transaction[]> {
    const now = Date.now();
    if (!forceReload && cachedData && lastReadTime && (now - lastReadTime < CACHE_TTL_MS)) {
        return cachedData;
    }

    const fileBuffer = await fs.readFile(dataPath);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    type RawRow = {
        'transaction_date'?: string;
        'description'?: string;
        'effective_date'?: string;
        'debit'?: string | number;
        'credit'?: string | number;
        'balance'?: string | number;
        'counter_account'?: string;
        'category'?: string;
        'transaction_code'?: string;
    };

    const rawData = XLSX.utils.sheet_to_json<RawRow>(worksheet, { defval: '' });

    cachedData = rawData.map((row): Transaction => ({
        transaction_date: (parseExcelDate(row['transaction_date'] || '')) ?? new Date('Invalid Date'),
        description: row['description'] || '',
        effective_date: (parseExcelDate(row['effective_date'] || '')) ?? new Date('Invalid Date'),
        debit: parseFloat(row['debit']?.toString() || '0'),
        credit: parseFloat(row['credit']?.toString() || '0'),
        balance: parseFloat(row['balance']?.toString() || '0'),
        counter_account: row['counter_account'] || '',
        category: row['category'] || '',
        transaction_code: row['transaction_code'] || '',
    }));

    lastReadTime = now;
    return cachedData;
}
