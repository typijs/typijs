import { DocumentNotFoundException } from "../error";
import { ParamNullException } from "../error/exceptions/ParamNullException";

export class Validator {
    static ThrowIfNull(name: string, value: any): void {
        if (!value) throw new ParamNullException(name);
    }

    static ThrowIfNullOrEmpty(name: string, value: string): void {
        if (!value || value.trim() === '') throw new ParamNullException(name);
    }

    static ThrowIfDocumentNotFound(documentName: string, value: any, queryObj?: { [Key: string]: any }): void {
        if (!value) {
            let message = `The ${documentName} document is not found`;
            if (queryObj) message = `${message}. The query params: ${JSON.stringify(queryObj)}.`;
            throw new DocumentNotFoundException(name, message);
        }
    }
}