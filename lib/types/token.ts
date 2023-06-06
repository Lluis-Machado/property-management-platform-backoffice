export interface tokenRes {
    access_token: string,
    expires_in: number,
    token_type: "Bearer"
}

export interface tokenPayload {
    iss: string;
    sub: string;
    aud: string;
    iat: number;
    exp: number;
    azp: string;
    gty: string;
    permissions: string[];
}