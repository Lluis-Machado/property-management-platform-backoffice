import { IronSessionOptions } from "iron-session";

export const ironConfig: IronSessionOptions = {
    cookieName: "pc-session-cookie",
    password: process.env.COOKIE_PASSWORD as string,
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
    },
}