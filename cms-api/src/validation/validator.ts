import { DocumentNotFoundException } from "../error";
import { ParamNullException } from "../error/exceptions/ParamNullException";
import { isNullOrWhiteSpace } from "../utils";

export class Validator {
    /**
     * Throw the `ParamNullException` if value is null
     * @param name 
     * @param value 
     */
    static throwIfNull(name: string, value: any): void {
        if (!value) throw new ParamNullException(name);
    }

    /**
     * Throw the `ParamNullException` if string value is null, empty or consists all white spaces
     * @param name 
     * @param value 
     */
    static throwIfNullOrEmpty(name: string, value: string): void {
        if (isNullOrWhiteSpace(value)) throw new ParamNullException(name);
    }

    /**
     * Throw the `DocumentNotFoundException` if the document is not found in db
     * @param documentName 
     * @param value 
     * @param queryObj 
     */
    static throwIfNotFound(documentName: string, value: any, queryObj?: { [Key: string]: any }): void {
        if (!value) {
            let message = `The ${documentName} document is not found`;
            if (queryObj) message = `${message}. The query params: ${JSON.stringify(queryObj)}.`;
            throw new DocumentNotFoundException(documentName, message);
        }
    }
}