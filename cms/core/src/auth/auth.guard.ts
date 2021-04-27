import { Inject, Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { BrowserLocationService } from '../browser/browser-location.service';
import { ADMIN_ROUTE } from '../injection-tokens';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authService: AuthService,
        private locationService: BrowserLocationService,
        @Inject(ADMIN_ROUTE) private adminPath: string) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.authService.isLoggedIn) {
            // logged in so return true
            const authStatus = this.authService.authStatus;
            const roleMatch = this.checkRoleMatch(authStatus.roles, route);
            if (!roleMatch) {
                alert('You do not have the permissions to view this resource');
            }
            return roleMatch;
        } else {
            // not logged in so redirect to login page with the return url
            const loginUrl = `${this.adminPath}/login?returnUrl=${state.url}`;
            this.locationService.navigate(loginUrl);

            // this.router.navigate([`${this.adminPath}/login`], {
            //     queryParams: { returnUrl: state.url }
            // }).then(() => {
            //     window.location.reload();
            // });

            return false;
        }
    }

    private checkRoleMatch(userRoles: string[], route?: ActivatedRouteSnapshot) {
        if (route && route.data && route.data.role) { return userRoles.includes(route.data.role); }
        return true;
    }
}
