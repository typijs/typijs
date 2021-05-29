import { RequestContext } from "./request-context";

export class TenantContext {
    private static readonly tenantKey: string = 'tenantId-18f62e17-bc97-44ef-a40d-4e16942132f9';

    static setCurrentTenantId(tenantId: string) {
        return RequestContext.set(this.tenantKey, tenantId);
    }

    static getCurrentTenantId() {
        return RequestContext.get(this.tenantKey);
    }
}