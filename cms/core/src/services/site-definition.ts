import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, publishReplay, refCount, switchMap } from 'rxjs/operators';
import { BrowserLocationService } from '../browser/browser-location.service';
import { convertObjectToUrlQueryString } from '../helpers/common';
import { ContentTypeEnum } from '../constants/content-type.enum';
import { ContentReference } from '../types/content-reference';
import { BaseService } from './base.service';
import { ContentLoader } from './content/content-loader.service';
import { ContentData, PageData } from './content/models/content-data';

@Injectable({
    providedIn: 'root'
})
export class SiteDefinition extends BaseService {
    protected apiUrl: string = `${this.baseApiUrl}/site-definition`;
    private siteDefinition: { [host: string]: Observable<[ContentReference, string]> } = {};
    private startPage: { [host: string]: Observable<PageData> } = {};
    constructor(
        httpClient: HttpClient,
        private contentLoader: ContentLoader,
        private locationService: BrowserLocationService) {
        super(httpClient);
    }

    /**
     * Get current start page id and the corresponding language based on host.
     *
     * If host is not provided, the current host will be used
     *
     * If the site definition has not defined yet, startPageId = 0 and the first enabled language will be return
     * @param host (Optional) the host name such as mysite.com, www.mysite.org:80.
     * If not provide, the current host will be use
     * @returns Return the Tuple [string, string] type of [startPageId, language]
     */
    getSiteDefinition(host?: string): Observable<[ContentReference, string]> {
        if (!host) { host = this.locationService.getLocation().host; }

        if (!this.siteDefinition[host]) {
            const query = convertObjectToUrlQueryString({ host });
            this.siteDefinition[host] = this.httpClient.get<[string, string]>(`${this.apiUrl}/getSiteByHost?${query}`).pipe(
                publishReplay(1), // this tells Rx to cache the latest emitted
                refCount(), // and this tells Rx to keep the Observable alive as long as there are any Subscribers
                map(([startPageId, language]) => [new ContentReference({ id: startPageId, type: ContentTypeEnum.Page }), language]),
            );
        }

        return this.siteDefinition[host];
    }

    getStartPage<T extends PageData>(host?: string): Observable<T> {
        if (!host) { host = this.locationService.getLocation().host; }

        if (!this.startPage[host]) {
            this.startPage[host] = this.getSiteDefinition(host).pipe(
                switchMap(([startPageId, language]) => this.contentLoader.get<T>(startPageId, language)),
                publishReplay(1), // this tells Rx to cache the latest emitted
                refCount() // and this tells Rx to keep the Observable alive as long as there are any Subscribers
            );
        }
        return this.startPage[host] as Observable<T>;
    }
}
