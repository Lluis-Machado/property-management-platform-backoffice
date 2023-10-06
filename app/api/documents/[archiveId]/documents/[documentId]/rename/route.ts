import { Document } from '@/lib/types/documentsAPI';
import { getUser } from '@/lib/utils/getUser';
import { NextResponse } from 'next/server';

export async function PATCH(
    request: Request,
    { params }: { params: { archiveId: string; documentId: string } }
) {
    try {
        const { token } = await getUser();
        const renameData: Document = await request.json();

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/documents/${params.archiveId}/documents/${params.documentId}/rename`,
            {
                method: 'PATCH',
                body: JSON.stringify(renameData),
                headers: {
                    Authorization: `${token.token_type} ${token.access_token}`,
                    'Content-type': 'application/json; charset=UTF-8',
                },
            }
        );

        if (!res.ok) {
            const responseMsg = await res.text();
            return new NextResponse(
                responseMsg || 'Something went wrong renaming a document',
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
