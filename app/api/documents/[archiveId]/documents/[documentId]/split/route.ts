import { getUser } from '@/lib/utils/getUser';
import { NextResponse } from 'next/server';

export async function POST(
    request: Request,
    { params }: { params: { archiveId: string; documentId: string } }
) {
    try {
        const { token } = await getUser();

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/documents/${params.archiveId}/documents/${params.documentId}/split`,
            {
                method: 'POST',
                headers: {
                    Authorization: `${token.token_type} ${token.access_token}`,
                    'Content-type': 'application/json; charset=UTF-8',
                },
                cache: 'no-store',
            }
        );

        if (!res.ok) {
            const responseMsg = await res.text();
            return new NextResponse(
                responseMsg || 'Something went wrong splitting documents',
                {
                    status: res.status,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        return new NextResponse(undefined, { status: res.status });
    } catch (error) {
        return new NextResponse(
            `Unexpected error. Please contact admin. Error info: ${JSON.stringify(
                error
            )}`,
            { status: 500 }
        );
    }
}
