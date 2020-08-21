import { Injectable } from '@angular/core';
import { CrudBaseService } from '../shared/crud/crud.service';
import { SiteManage } from './site-manage.model';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SiteManageService extends CrudBaseService<SiteManage> {
    protected modelType: new () => SiteManage = SiteManage;
    apiUrl: string = `${this.baseApiUrl}/site-definition`;
    constructor(httpClient: HttpClient) {
        super(httpClient);
    }
}
