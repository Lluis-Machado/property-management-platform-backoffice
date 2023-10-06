import { getUser } from '@/lib/utils/getUser';
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: { archiveId: string } }
) {
    try {
        const { token } = await getUser();
        const { searchParams } = new URL(request.url);
        const folderId = searchParams.get('folderId');

        let endpoint = `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/documents/${params.archiveId}/documents`;

        if (folderId) {
            endpoint += `?${new URLSearchParams({
                folderId,
            })}`;
        }

        const res = await fetch(endpoint, {
            headers: {
                Authorization: `${token.token_type} ${token.access_token}`,
            },
            cache: 'no-store',
        });

        if (!res.ok) {
            const responseMsg = await res.text();
            return new NextResponse(
                responseMsg || 'Something went wrong getting documents',
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

export async function POST(
    request: Request,
    { params }: { params: { archiveId: string } }
) {
    try {
        const { token } = await getUser();
        const { searchParams } = new URL(request.url);
        const folderId = searchParams.get('folderId');

        const formData: FormData = await request.formData();

        let endpoint = `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/documents/${params.archiveId}/documents`;

        if (folderId) {
            endpoint += `?${new URLSearchParams({
                folderId,
            })}`;
        }

        const res = await fetch(endpoint, {
            method: 'POST',
            body: formData,
            headers: {
                Authorization: `${token.token_type} ${token.access_token}`,
            },
            cache: 'no-store',
        });

        if (!res.ok) {
            const responseMsg = await res.text();
            return new NextResponse(
                responseMsg || 'Something went wrong getting documents',
                { status: res.status }
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
