export type TokenPayload = {
    roles?: string[]
    userId: string
    sub: string
    iat: number
    exp: number
    [key: string]: any
}

export class User {
    id: number;
    username: string;
    email: string;
    roles: string[];
    firstName: string;
    lastName: string;
    token?: string;
    expiry?: string;
}
