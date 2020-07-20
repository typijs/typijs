/**
 * Define the builtin roles
 */
export enum Roles {
    Admin = 'Admin',
    Editor = 'Editor'
}

export const requiredAdminOrEditor = [[Roles.Admin], [Roles.Editor]];