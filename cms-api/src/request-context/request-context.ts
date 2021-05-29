import { createNamespace } from 'cls-hooked';

/**
 * Heavy Inspiration from https://github.com/skonves/express-http-context but implemented on Typescript
 */
export class RequestContext {
    private static readonly namespaceName: string = 'request-context-18f62e17-bc97-44ef-a40d-4e16942132f9';
    private static readonly requestNs = createNamespace(RequestContext.namespaceName);

    /**
     * Express.js middleware that is responsible for initializing the context for each request.
     * @param req 
     * @param res 
     * @param next 
     */
    static middleware(req, res, next) {
        RequestContext.requestNs.bindEmitter(req);
        RequestContext.requestNs.bindEmitter(res);

        RequestContext.requestNs.run(() => next());
    }

    /**
     * Gets a value from the context by key.  Will return undefined if the context has not yet been initialized for this request or if a value is not found for the specified key.
     * @param key 
     * @returns 
     */
    static get(key: string): any {
        if (this.requestNs && this.requestNs.active) {
            return this.requestNs.get(key);
        }
        return undefined;
    }

    /**
     * Adds a value to the context by key.  If the key already exists, its value will be overwritten.  No value will persist if the context has not yet been initialized.
     * @param key 
     * @param value 
     * @returns 
     */
    static set(key: string, value: any): void {
        if (this.requestNs && this.requestNs.active) {
            return this.requestNs.set(key, value);
        }
    }
}

