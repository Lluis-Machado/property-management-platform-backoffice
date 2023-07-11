'server-only'

import { unsealData } from "iron-session";
import { User } from "@/lib/types/user";
import { ironConfig } from "@/lib/ironSession/config";

/**
 * Can be called in page/layout server component.
 * @param cookies ReadonlyRequestCookies
 * @returns SessionUser or null
 */
export async function getRequestCookie(cookies: any): Promise<User | null> {
    const found = cookies.get(ironConfig.cookieName);

    if (!found) return null;

    const { user } = await unsealData(found.value, {
        password: ironConfig.password,
    });

    return user as unknown as User;
}