import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                let errorMessage = '';

                if (error.error instanceof ErrorEvent) {
                    // client-side error: Network problems and front-end code errors
                    errorMessage = `Error: ${error.error.message}`;
                } else {
                    // server-side error: AJAX errors, user errors, back-end code errors, database errors, file system errors
                    errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
                }

                // console.error(errorMessage);
                // TODO: show Toast here
                return throwError(errorMessage);
            })
        );
    }
}
