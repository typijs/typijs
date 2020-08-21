import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

export class DefaultRouteReuseStrategy implements RouteReuseStrategy {
    shouldDetach(route: ActivatedRouteSnapshot): boolean { return false; }
    store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandle): void { }
    shouldAttach(route: ActivatedRouteSnapshot): boolean { return false; }
    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null { return null; }
    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        return future.routeConfig === curr.routeConfig;
    }
}

/**
 * Custom route reuse strategy
 *
 * Usage:
 * ```typescript
 * const routes: Routes = [
 *       {
 *          path: '',
 *          component: LayoutComponent,
 *          children: [
 *          {
 *               path: '**',
 *               data: { reuse: false }, //pass reuse param to CustomRouteReuseStrategy
 *               component: CmsContentRender,
 *          }]
 *       }
 *  ]
 * ```
 */
@Injectable()
export class CustomRouteReuseStrategy extends DefaultRouteReuseStrategy {
    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        // For latest Angular, like 5.X , you have to update the import strings:
        // I ended up with this service (for which I'm passing data: {reuse: false} in a route config, whenever I need it to work):
        const reuse = (future.data && future.data.hasOwnProperty('reuse')) ? future.data.reuse : true;
        return super.shouldReuseRoute(future, curr) && reuse;
    }
}
