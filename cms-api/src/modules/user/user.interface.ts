export interface IUser {
    username: string;
    email: string;
    password: string;
    role: any[];

    created: Date;
    changed: Date;
}