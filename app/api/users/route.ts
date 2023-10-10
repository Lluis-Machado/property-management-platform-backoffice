import { CreateAuth0User } from '@/lib/types/user';
import { getUser } from '@/lib/utils/getUser';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { token } = await getUser();
        const user: CreateAuth0User = await request.json();

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/auth/users`,
            {
                method: 'POST',
                body: JSON.stringify(user),
                headers: {
                    Authorization: `${token.token_type} ${token.access_token}`,
                    'Content-type': 'application/json; charset=UTF-8',
                },
            }
        );
        if (!res.ok) {
            const responseMsg = await res.text();
            return new NextResponse(
                responseMsg || 'Something went wrong creating a user',
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
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
