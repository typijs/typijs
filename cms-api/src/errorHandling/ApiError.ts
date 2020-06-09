/**
 * Base App error class: All application error must be inherited from this class
 */
export class ApiError extends Error {
    public statusCode: number;
    public message: string;
    constructor(statusCode: number, message: string, stack = '') {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        if (stack) {
            this.stack = stack;
        }
    }
}