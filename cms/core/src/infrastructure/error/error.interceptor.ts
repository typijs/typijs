import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private router: Router, private authService: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if ([401, 403].includes(err.status) && this.authService.isLoggedIn) {
                // auto logout if 401 or 403 response returned from api
                this.authService.logout();
                this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.routerState.snapshot.url } });
            }

            const error = (err && err.error && err.error.message) || err.statusText;
            //console.error(err);
            return throwError(error);
        }))
    }
}