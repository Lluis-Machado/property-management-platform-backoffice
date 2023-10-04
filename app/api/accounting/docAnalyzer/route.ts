import { NextResponse } from 'next/server';
import { getUser } from '@/lib/utils/getUser';

export async function POST(request: Request) {
    try {
        const { token } = await getUser();
        // TODO CHANGE TYPE
        const apInvoice: any = await request.formData();

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/docanalyzer/DocumentAnalyzer/APInvoice`,
            {
                method: 'POST',
                body: apInvoice,
                cache: 'no-store',
                headers: {
                    Authorization: `${token.token_type} ${token.access_token}`,
                },
            }
        );
        if (!res.ok) {
            const responseMsg = await res.text();
            return new NextResponse(
                responseMsg || 'Something went wrong analyzing a ap invoice',
                {
                    status: res.status,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        return new NextResponse(
            `Unexpected error. Please contact admin. Error info: ${JSON.stringify(
                error
            )}`,
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
