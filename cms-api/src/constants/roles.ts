/**
 * Define the builtin roles
 */
export enum Roles {
    Admin = 'Admin',
    Editor = 'Editor'
}

export const AdminOrEditor = [Roles.Admin, Roles.Editor];