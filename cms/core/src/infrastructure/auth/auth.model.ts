export type TokenPayload = {
    roles?: string[]
    sub: string
    iat: number
    exp: number
    [key: string]: any
}

export type TokenResponse = {
    token?: string
    expiry?: string
}

export class AuthStatus {
    userId: string;
    roles: string[];
    token?: string;
    expiry?: Date;

    constructor(token: string) {
        const jwtToken: TokenPayload = JSON.parse(atob(token.split('.')[1]));
        this.userId = jwtToken.sub;
        this.roles = jwtToken.roles;
        this.expiry = new Date(jwtToken.exp * 1000)
        this.token = token;
    }
}
