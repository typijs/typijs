import { Injectable, Injector } from '@angular/core';
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

    getStartPage(hostName?: string): Observable<Page> {
        const startPageUrl = hostName ? hostName : this.locationService.getLocation().origin;
        return this.httpClient.get<Page>(`${this.apiUrl}/published/${btoa(startPageUrl)}`);
    }

    getPublishedPage(linkUrl: string): Observable<Page> {
        return this.httpClient.get<Page>(`${this.apiUrl}/published/${btoa(linkUrl)}`);
    }
}
