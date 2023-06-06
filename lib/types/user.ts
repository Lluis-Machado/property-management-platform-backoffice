import { tokenRes } from "./token";

export interface user {
    token: tokenRes,
    id: string,
    email: string,
    name: string,
    nickname: string,
    picture: string,
    password: string | undefined,
    isLoggedIn: boolean
}

export interface auth0User {
    blocked:             boolean;
    created_at:          Date;
    email:               string;
    email_verified:      boolean;
    family_name:         string;
    given_name:          string;
    identities:          Identity[];
    name:                string;
    nickname:            string;
    picture:             string;
    updated_at:          Date;
    user_id:             string;
    last_password_reset: Date;
    last_ip:             string;
    last_login:          Date;
    logins_count:        number;
}

export interface Identity {
    user_id:    string;
    provider:   string;
    connection: string;
    isSocial:   boolean;
}