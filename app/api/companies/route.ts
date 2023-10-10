import { NextResponse } from 'next/server';
import { getUser } from '@/lib/utils/getUser';
import { CompanyData } from '@/lib/types/companyData';

export async function POST(request: Request) {
    try {
        const { token } = await getUser();
        const company: CompanyData = await request.json();

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/core/core/companies`,
            {
                method: 'POST',
                body: JSON.stringify(company),
                headers: {
                    Authorization: `${token.token_type} ${token.access_token}`,
                    'Content-type': 'application/json; charset=UTF-8',
                },
            }
        );
        if (!res.ok) {
            const responseMsg = await res.text();
            return new NextResponse(
                responseMsg || 'Something went wrong creating a company',
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
