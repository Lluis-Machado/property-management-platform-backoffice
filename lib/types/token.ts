export interface TokenRes {
    access_token: string,
    expires_in: number,
    token_type: "Bearer"
};

export interface TokenPayload {
    iss: string;
    sub: string;
    aud: string;
    iat: number;
    exp: number;
    azp: string;
    gty: string;
    permissions: string[];
};