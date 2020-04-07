//Safe way to extract property names
//https://schneidenbach.gitbooks.io/typescript-cookbook/nameof-operator.html
export const nameOf = <T>(name: keyof T) => name;
export const nameOfFactory = <T>() => (name: keyof T) => name;