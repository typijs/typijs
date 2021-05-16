import { createNamespace } from 'continuation-local-storage';

const namespaceName = 'request';
const ns = createNamespace(namespaceName);

export function bindCurrentNamespace(req, res, next) {
    ns.bindEmitter(req);
    ns.bindEmitter(res);

    ns.run(() => {
        next();
    });
}

export function setCurrentTenantId(tenantId) {
    return ns.set('tenantId', tenantId);
}

export function getCurrentTenantId() {
    return ns.get('tenantId');
}