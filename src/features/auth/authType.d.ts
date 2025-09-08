export interface TokenType {
    access_token: string;
    refresh_token: string;
    timeout: string | undefined;
}

export interface AuthStateType {
    username: string | undefined;
    token: TokenType | null;
    statusSignin: string;
    statusSignout: string;
    message: string;
}
