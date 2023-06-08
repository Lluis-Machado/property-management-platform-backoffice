import { getIronSession } from "iron-session/edge";
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { NextRequest, NextResponse } from "next/server";
import { ironConfig } from "@/lib/ironSession/config";
import { i18n } from "@/i18n-config";

// Check if we support user langs or use default
function getLocale(req: NextRequest): string {
    try {
        // Negotiator expects plain object so we need to transform headers
        const headers: Record<string, string> = {}
        req.headers.forEach((value, key) => (headers[key] = value))
        // Get browser user langs from headers
        const languages = new Negotiator({ headers }).languages();
        // @ts-ignore locales are readonly
        const locales: string[] = i18n.locales
        return match(languages, locales, i18n.defaultLocale);
    } catch (error) {
        console.error(error) // TODO: Send to log service
        return i18n.defaultLocale;
    }
}

// Check if there is any supported locale in the pathname
function pathnameIsMissingLocale(req: NextRequest): boolean {
    const pathname = req.nextUrl.pathname
    return i18n.locales.every(
        (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    )
}

export async function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname;

    // `/_next/` and `/api/` are ignored by the watcher, but we need to ignore files in `public` manually.
    if (
        [
            '/favicon.ico',
            '/Portrait_Placeholder.png',
            '/WuF_Logo.png',
            '/WuF_Symbol_Complete.png',
            '/WuF_White_Words.png',
            '/WuF_White.png',
            '/WuF_Words.png',
        ].includes(pathname)
    ) return
    
    //////////////// Check user session ////////////////
    const res = NextResponse.next()
    const { user } = await getIronSession(req, res, ironConfig)

    // console.log("//////////////// USER DATA (middleware) ////////////////\n", { user })

    if (pathname.includes('/private') && !user?.isLoggedIn)
        return NextResponse.redirect(new URL(`/${getLocale(req)}/?error=Login to access`, req.url))

    if ((pathname === '/' || pathname === '/es' || pathname === '/en' || pathname === '/de') && user?.isLoggedIn)
        return NextResponse.redirect(new URL(`/${getLocale(req)}/private`, req.url))

    //////////////// Check if no supported locale on pathname ////////////////
    if (pathnameIsMissingLocale(req)) {
        const locale = getLocale(req)

        // e.g. incoming req is /products
        // The new URL is now /en-US/products
        return NextResponse.redirect(
            new URL(`/${locale}/${pathname}`, req.url)
        )
    }

    return res
}

export const config = {
    // Matcher ignoring `/_next/` and `/api/`
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};