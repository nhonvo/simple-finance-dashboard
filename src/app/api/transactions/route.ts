import { NextRequest, NextResponse } from 'next/server';
import { Transaction } from 'src/shared/types/Transaction';
import { parseQueryParams } from 'src/shared/utilities/parseParams';
import { getTransactions } from './getTransactions';

export async function GET(req: NextRequest) {
    try {
        const url = req.nextUrl;
        const searchParams = url.searchParams;

        const params = parseQueryParams(searchParams);

        const transactions: Transaction[] = await getTransactions(params);

        return NextResponse.json(transactions);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Failed to load transactions.' }, { status: 500 });
    }
}
