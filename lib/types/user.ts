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

// For getting user roles
export interface UserRoles {
    id: string;
    name: string;
    description: string;
}

// For getting user logs
export interface UserLogs {
    date: string;
    type: string;
    description: string;
    connection: string;
    connection_id: string;
    client_id: string;
    client_name: string;
    ip: string;
    client_ip: string;
    details: Details;
    user_id: string;
    user_name: string;
    audience: string;
    scope: any;
    log_id: string;
    _id: string;
    isMobile: boolean;
    user_agent: string;
    location_info: LocationInfo;
}

export interface Details {
    actions: Actions;
}

export interface Actions {
    executions: string[];
}

export interface LocationInfo {
    country_code: string;
    country_code3: string;
    country_name: string;
    city_name: string;
    latitude: number;
    longitude: number;
    time_zone: string;
    continent_code: string;
}
