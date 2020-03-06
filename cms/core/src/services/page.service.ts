import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Page } from '../models/page.model';
import { ContentService } from './content.service';
import { BrowserLocationService } from './browser-location.service';
import { btoa } from '../helpers/base64';

@Injectable()
export class PageService extends ContentService<Page> {

  protected apiUrl: string = "http://localhost:3000/api/page";
  constructor(
    private locationService: BrowserLocationService,
    httpClient: HttpClient) {
    super(httpClient);
  }

  getStartPage(hostName?: string): Observable<Page> {
    const startPageUrl = hostName ? hostName : this.locationService.getLocation().origin;
    return this.httpClient.get<Page>(`${this.apiUrl}/published/${btoa(startPageUrl)}`);
  }

  getPublishedPage(linkUrl: string): Observable<Page> {
    return this.httpClient.get<Page>(`${this.apiUrl}/published/${btoa(linkUrl)}`);
  }

  getPublishedPageChildren(parentId: string): Observable<Page[]> {
    return this.httpClient.get<Page[]>(`${this.apiUrl}/published/children/${parentId}`);
  }

}
