//Safe way to extract property names


/**
 * The safe way to extract property names
 * 
 * https://schneidenbach.gitbooks.io/typescript-cookbook/nameof-operator.html
 * @param name 
 */
export const nameOf = <T>(name: keyof T) => name;

/**
 * The safe way to extract property names
 * 
 * https://schneidenbach.gitbooks.io/typescript-cookbook/nameof-operator.html
 * @param name 
 */
export const nameOfFactory = <T>() => (name: keyof T) => name;