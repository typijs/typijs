import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { BaseService } from '../services/base.service';
import { AuthStatus, TokenResponse } from './auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService extends BaseService {
    authStatus$: Observable<AuthStatus>;
    get authStatus(): AuthStatus {
        return this.authSubject.value;
    }

    get isLoggedIn(): boolean {
        return this.authStatus && this.authStatus.token ? true : false;
    }

    protected apiUrl: string = `${this.baseApiUrl}/auth`;
    private authSubject: BehaviorSubject<AuthStatus>;
    private refreshTokenTimeout;

    constructor(httpClient: HttpClient) {
        super(httpClient);
        this.authSubject = new BehaviorSubject<AuthStatus>(null);
        this.authStatus$ = this.authSubject.asObservable();
    }

    setBaseApiUrl = (baseApiUrl: string): AuthService => {
        this.baseApiUrl = baseApiUrl;
        this.apiUrl = `${baseApiUrl}/auth`;
        return this;
    }

    canSetupAdmin(): Observable<boolean> {
        return this.httpClient.get<boolean>(`${this.apiUrl}/can-setup-admin`);
    }

    setupAdmin(username: string, password: string, email: string): Observable<AuthStatus> {
        const adminUser = { firstName: username, lastName: username, username, password, confirmPassword: password, email };
        return this.httpClient.post<any>(`${this.apiUrl}/setup-admin`, adminUser)
            .pipe(
                switchMap(() => this.login(username, password))
            );
    }

    login(username: string, password: string): Observable<AuthStatus> {
        return this.httpClient.post<TokenResponse>(`${this.apiUrl}/login`, { username, password }, { withCredentials: true })
            .pipe(map(tokenResponse => {
                const authStatus = new AuthStatus(tokenResponse.token);
                this.authSubject.next(authStatus);
                this.startRefreshTokenTimer();
                return authStatus;
            }));
    }

    logout() {
        // revoke refresh token
        this.httpClient.post<any>(`${this.apiUrl}/revoke-token`, {}, { withCredentials: true }).subscribe();
        // revoke access token
        this.authSubject.next(null);
        // stop refresh token request
        this.stopRefreshTokenTimer();
    }

    refreshToken(): Observable<AuthStatus> {
        return this.httpClient.post<TokenResponse>(`${this.apiUrl}/refresh-token`, {}, { withCredentials: true })
            .pipe(map((tokenResponse) => {
                if (tokenResponse && tokenResponse.token) {
                    const authStatus = new AuthStatus(tokenResponse.token);
                    this.authSubject.next(authStatus);
                    this.startRefreshTokenTimer();
                    return authStatus;
                }
                return null;
            }));
    }

    // helper methods
    private startRefreshTokenTimer() {
        if (this.authStatus) {
            // set a timeout to refresh the token a minute before it expires
            const expires = this.authStatus.expiry;
            const timeout = expires.getTime() - Date.now() - (60 * 1000);
            this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
        }
    }

    private stopRefreshTokenTimer() {
        if (this.refreshTokenTimeout) { clearTimeout(this.refreshTokenTimeout); }
    }
}
