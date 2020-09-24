import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudService } from '../shared/crud/crud.service';
import { SiteDefinition } from './site-definition.model';

@Injectable()
export class SiteDefinitionService extends CrudService<SiteDefinition, string> {
    protected apiUrl: string = `${this.baseApiUrl}/site-definition`;

    constructor(httpClient: HttpClient) {
        super(httpClient);
    }
}
