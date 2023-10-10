import { NextResponse } from 'next/server';
import { getUser } from '@/lib/utils/getUser';
import { PropertyData } from '@/lib/types/propertyInfo';

export async function POST(request: Request) {
    try {
        const { token } = await getUser();
        const contact: PropertyData = await request.json();

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/core/core/properties`,
            {
                method: 'POST',
                body: JSON.stringify(contact),
                headers: {
                    Authorization: `${token.token_type} ${token.access_token}`,
                    'Content-type': 'application/json; charset=UTF-8',
                },
            }
        );
        if (!res.ok) {
            const responseMsg = await res.text();
            return new NextResponse(
                responseMsg || 'Something went wrong creating a property',
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
