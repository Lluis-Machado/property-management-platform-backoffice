import { ApiCallError } from '@/lib/utils/errors';
import { getUser } from '@/lib/utils/getUser';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const user = await getUser();
    const { searchParams } = new URL(request.url);
    const objId = searchParams.get('objId');
    const objName = searchParams.get('objName');
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/audits/audits/${objId}/${objName}`,
        {
            headers: {
                Authorization: `bearer ${user.token.access_token}`,
            },
            cache: 'no-store',
        }
    );
    if (!res.ok)
        throw new ApiCallError('Something went wrong in getting Audit Log');
    const data = await res.json();
    return NextResponse.json(data);
}
