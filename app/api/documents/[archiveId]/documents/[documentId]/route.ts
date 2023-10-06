import { getUser } from '@/lib/utils/getUser';
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: { archiveId: string; documentId: string } }
) {
    try {
        const { token } = await getUser();

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/documents/${params.archiveId}/documents/${params.documentId}`,
            {
                headers: {
                    Authorization: `${token.token_type} ${token.access_token}`,
                },
                cache: 'no-store',
            }
        );

        if (!res.ok) {
            const responseMsg = await res.text();
            return new NextResponse(
                responseMsg || 'Something went wrong getting a document',
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
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { archiveId: string; documentId: string } }
) {
    try {
        const { token } = await getUser();

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/documents/${params.archiveId}/documents/${params.documentId}`,
            {
                method: 'DELETE',
                headers: {
                    Authorization: `${token.token_type} ${token.access_token}`,
                },
                cache: 'no-store',
            }
        );

        if (!res.ok) {
            const responseMsg = await res.text();
            return new NextResponse(
                responseMsg || 'Something went wrong deleting a document',
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
            { status: 500 }
        );
    }
}
