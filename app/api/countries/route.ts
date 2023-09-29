import { getUser } from '@/lib/utils/getUser';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { token } = await getUser();
    const { searchParams } = new URL(request.url);
    const countryId = searchParams.get('countryId');
    const lang = searchParams.get('lang');
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/countries/countries/${countryId}/states?languageCode=${lang}`,
        {
            headers: {
                Authorization: `${token.token_type} ${token.access_token}`,
            },
            cache: 'no-store',
        }
    );
    const data = await res.json();
    return NextResponse.json(data);
}
