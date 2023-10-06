import { NextResponse } from 'next/server';
import { Folder } from '@/lib/types/documentsAPI';
import { getUser } from '@/lib/utils/getUser';

export async function POST(
    request: Request,
    { params }: { params: { archiveId: string; folderId: string } }
) {
    try {
        const { token } = await getUser();
        const folderData: Folder = await request.json();

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/documents/${params.archiveId}/folders/${params.folderId}/copy`,
            {
                method: 'POST',
                body: JSON.stringify(folderData),
                headers: {
                    Authorization: `${token.token_type} ${token.access_token}`,
                    'Content-type': 'application/json; charset=UTF-8',
                },
            }
        );
        if (!res.ok) {
            const responseMsg = await res.text();
            return new NextResponse(
                responseMsg || 'Something went wrong copying a folder',
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
