import { NextResponse } from 'next/server';
import { getUser } from '@/lib/utils/getUser';

export async function POST(request: Request) {
    try {
        const { token } = await getUser();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        // CHANGE TYPE
        const apInvoice: any = await request.json();

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/accounting/tenants/${id}/businesspartners/${apInvoice.businessPartnerId}/loans`,
            {
                method: 'POST',
                body: JSON.stringify(apInvoice),
                headers: {
                    Authorization: `${token.token_type} ${token.access_token}`,
                    'Content-type': 'application/json; charset=UTF-8',
                },
            }
        );
        if (!res.ok) {
            const responseMsg = await res.text();
            return new NextResponse(
                responseMsg || 'Something went wrong creating a loan',
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

export async function PATCH(request: Request) {
    try {
        const { token } = await getUser();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const loanId = searchParams.get('loanId');
        // CHANGE TYPE
        const apInvoice: any = await request.json();

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/accounting/tenants/${id}/loans/${loanId}`,
            {
                method: 'PATCH',
                body: JSON.stringify(apInvoice),
                headers: {
                    Authorization: `${token.token_type} ${token.access_token}`,
                    'Content-type': 'application/json; charset=UTF-8',
                },
            }
        );
        if (!res.ok) {
            const responseMsg = await res.text();
            return new NextResponse(
                responseMsg || 'Something went wrong updating a loan',
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

export async function DELETE(request: Request) {
    try {
        const { token } = await getUser();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const loanId = searchParams.get('loanId');

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/accounting/tenants/${id}/loans/${loanId}`,
            {
                method: 'DELETE',
                headers: {
                    Authorization: `${token.token_type} ${token.access_token}`,
                    'Content-type': 'application/json; charset=UTF-8',
                },
            }
        );
        if (!res.ok) {
            const responseMsg = await res.text();
            return new NextResponse(
                responseMsg || 'Something went wrong deleting a loan',
                {
                    status: res.status,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        return new NextResponse(undefined, { status: 200 });
    } catch (error) {
        return new NextResponse(
            `Unexpected error. Please contact admin. Error info: ${JSON.stringify(
                error
            )}`,
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
