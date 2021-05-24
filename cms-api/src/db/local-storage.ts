import { createNamespace } from 'continuation-local-storage';

const namespaceName: string = 'request';
const storageKey: string = 'tenantId';

const ns = createNamespace(namespaceName);

export function bindCurrentNamespace(req, res, next) {
    ns.bindEmitter(req);
    ns.bindEmitter(res);

    ns.run(() => {
        next();
    });
}

export function setCurrentTenantId(tenantId) {
    return ns.set(storageKey, tenantId);
}

export function getCurrentTenantId() {
    return ns.get(storageKey);
}