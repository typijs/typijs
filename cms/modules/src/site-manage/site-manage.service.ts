import { Injectable, Injector } from '@angular/core';
import { SiteDefinition } from './site-manage.model';
import { BaseService } from '@angular-cms/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class SiteManageService extends BaseService {
    protected apiUrl: string = `${this.baseApiUrl}/site-definition`;

    constructor(httpClient: HttpClient) {
        super(httpClient);
    }

    getAllSiteDefinitions(): Observable<SiteDefinition[]> {
        return this.httpClient.get<SiteDefinition[]>(this.apiUrl);
    }
}
