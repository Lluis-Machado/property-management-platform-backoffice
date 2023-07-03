// Local imports
import { TokenRes } from './token';

export interface User {
    token:      TokenRes,
    id:         string,
    email:      string,
    name:       string,
    nickname:   string,
    picture:    string,
    password:   string | undefined,
    isLoggedIn: boolean
};

export interface Auth0User {
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
};

export interface Identity {
    user_id:    string;
    provider:   string;
    connection: string;
    isSocial:   boolean;
};