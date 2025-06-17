import { NextRequest, NextResponse } from 'next/server';
import { parseQueryParams } from 'src/shared/utilities/parseParams';
import { getInvestTransactions } from './getInvestTransactions';

export async function GET(req: NextRequest) {
    const url = req.nextUrl;
    const searchParams = url.searchParams;

    const params = parseQueryParams(searchParams);

    try {
        const data = await getInvestTransactions(params);
        return NextResponse.json(data);
    } catch (e) {
        return NextResponse.json({ error: (e as Error).message }, { status: 500 });
    }
}
