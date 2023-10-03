// Local imports
import { TokenRes } from './token';

export interface User {
    token: TokenRes;
    id: string;
    email: string;
    name: string;
    nickname: string;
    picture: string;
    password: string | undefined;
    isLoggedIn: boolean;
}

// For fetching users
export interface Auth0User {
    created_at: string;
    email: string;
    email_verified: boolean;
    identities: Identity[];
    name: string;
    nickname: string;
    picture: string;
    updated_at: string;
    user_id: string;
    user_metadata: UserMetadata;
    last_login: string;
    last_ip: string;
    logins_count: number;
    app_metadata: AppMetadata;
}

export interface Identity {
    user_id: string;
    provider: string;
    connection: string;
    isSocial: boolean;
}

export interface UserMetadata {}

export interface AppMetadata {}

// For creating users
export interface CreateAuth0User {
    blocked: boolean;
    connection: string;
    email_verified: boolean;
    email: string;
    family_name: string;
    given_name: string;
    name: string;
    nickname: string;
    password: string;
    picture?: string;
    user_id: string;
    verify_email: boolean;
}

// For updating users
export interface UpdateAuth0User {
    blocked: boolean;
    name: string;
    nickname: string;
    picture: string;
    verify_email: boolean;
    verify_phone_number: boolean;
    password: string;
    connection: string;
    client_id: string;
    username: string;
}
