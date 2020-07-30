import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { BaseService } from '../../services/base.service';
import { BrowserStorageService } from '../browser/browser-storage.service';
import { AuthStatus, TokenResponse } from './auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService extends BaseService implements OnDestroy {
    protected apiUrl: string = `${this.baseApiUrl}/auth`;
    private readonly loginEvent: string = 'loginEvent';
    private readonly logoutEvent: string = 'logoutEvent';

    private authSubject: BehaviorSubject<AuthStatus>;
    public authStatus$: Observable<AuthStatus>;
    public get authStatus(): AuthStatus {
        return this.authSubject.value;
    }

    public get isLoggedIn(): boolean {
        return this.authStatus && this.authStatus.token ? true : false
    }

    constructor(httpClient: HttpClient, private storageService: BrowserStorageService) {
        super(httpClient);
        this.authSubject = new BehaviorSubject<AuthStatus>(null);
        this.authStatus$ = this.authSubject.asObservable();
        //TODO: Need to check it work with SSR
        if (window) window.addEventListener('storage', this.storageEventListener.bind(this));
    }

    ngOnDestroy(): void {
        //TODO: Need to check it work with SSR
        if (window) window.removeEventListener('storage', this.storageEventListener.bind(this));
    }

    setBaseApiUrl = (baseApiUrl: string): AuthService => {
        this.baseApiUrl = baseApiUrl;
        this.apiUrl = `${baseApiUrl}/auth`;
        return this;
    }

    login(username: string, password: string): Observable<AuthStatus> {
        return this.httpClient.post<TokenResponse>(`${this.apiUrl}/login`, { username, password }, { withCredentials: true })
            .pipe(map(tokenResponse => {
                const authStatus = new AuthStatus(tokenResponse.token);
                //update auth status
                this.authSubject.next(authStatus);
                //update storage to publish event
                this.storageService.set(this.loginEvent, 'login' + Math.random())
                //start refresh token request
                this.startRefreshTokenTimer();
                return authStatus;
            }));
    }

    logout() {
        //revoke refresh token
        this.httpClient.post<any>(`${this.apiUrl}/logout`, {}, { withCredentials: true })
            .pipe(
                finalize(() => {
                    //revoke access token
                    this.authSubject.next(null);
                    //update storage to publish event
                    this.storageService.set(this.logoutEvent, 'logout' + Math.random())
                    //stop refresh token request
                    this.stopRefreshTokenTimer();
                })
            )
            .subscribe();
    }

    refreshToken(): Observable<AuthStatus> {
        return this.httpClient.post<TokenResponse>(`${this.apiUrl}/refresh-token`, {}, { withCredentials: true })
            .pipe(map((tokenResponse) => {
                if (tokenResponse && tokenResponse.token) {
                    const authStatus = new AuthStatus(tokenResponse.token);
                    this.authSubject.next(authStatus);
                    //start refresh token request
                    this.startRefreshTokenTimer();
                    return authStatus
                }
                return null;
            }));
    }

    // helper methods
    private refreshTokenTimeout;

    private startRefreshTokenTimer() {
        if (this.authStatus) {
            // set a timeout to refresh the token a minute before it expires
            const expires = this.authStatus.expiry;
            const timeout = expires.getTime() - Date.now() - (60 * 1000);
            this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
        }
    }

    private stopRefreshTokenTimer() {
        if (this.refreshTokenTimeout) clearTimeout(this.refreshTokenTimeout);
    }

    private storageEventListener(event: StorageEvent) {
        if (event.storageArea === localStorage) {
            if (event.key === this.logoutEvent) {
                //revoke access token
                this.authSubject.next(null);
            }
            if (event.key === this.loginEvent) {
                //TODO: Need to check it work with SSR
                if (location) location.reload();
            }
        }
    }
}