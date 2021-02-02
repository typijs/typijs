import { Injectable, Injector } from '@angular/core';
import { convertObjectToUrlQueryString } from '../../helpers/common';
import { Observable } from 'rxjs';
import { btoa } from '../../helpers/base64';
import { TypeOfContentEnum } from '../../types';
import { ContentService } from './content.service';
import { PageData } from './models/content-data';
import { Page } from './models/page.model';

@Injectable({
    providedIn: 'root'
})
export class PageService extends ContentService<Page> {
    protected apiUrl: string = `${this.baseApiUrl}/page`;

    constructor(injector: Injector) {
        super(injector);
    }

    isMatching(typeOfContent: string) {
        return typeOfContent === TypeOfContentEnum.Page;
    }

    getContentData(content: Page): PageData {
        return new PageData(content);
    }

    getPageByLinkUrl(linkUrl: string): Observable<Page> {
        return this.httpClient.get<Page>(`${this.apiUrl}/published/${btoa(linkUrl)}`);
    }

    getPageUrls(pageIds: string[], language?: string): Observable<Page[]> {
        const host = this.locationService.getLocation().host;
        const query = convertObjectToUrlQueryString({ language, host });
        return this.httpClient.post<Page[]>(`${this.apiUrl}/getUrls?${query}`, pageIds);
    }
}
