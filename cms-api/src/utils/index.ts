//Safe way to extract property names
//https://schneidenbach.gitbooks.io/typescript-cookbook/nameof-operator.html
export const nameof = <T>(name: keyof T) => name;
export const nameofFactory = <T>() => (name: keyof T) => name;