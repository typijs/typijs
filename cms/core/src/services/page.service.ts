import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Page } from '../models/page.model';
import { ContentService } from './content.service';
import { LOCATION, LocationRef } from './browser-location.service';

@Injectable()
export class PageService extends ContentService<Page> {

  protected apiUrl: string = "/api/page";
  constructor(httpClient: HttpClient, @Inject(LOCATION) private location: LocationRef) {
    super(httpClient);
  }

  //TODO: temporary fix hostName
  getStartPage(hostName?: string): Observable<Page> {
    const startPageUrl = hostName ? hostName : this.location.origin;
    return this.httpClient.get<Page>(`${this.apiUrl}/published/${btoa(startPageUrl)}`);
  }

  getPublishedPage(linkUrl: string): Observable<Page> {
    return this.httpClient.get<Page>(`${this.apiUrl}/published/${btoa(linkUrl)}`);
  }

  getPublishedPageChildren(parentId: string): Observable<Page[]> {
    return this.httpClient.get<Page[]>(`${this.apiUrl}/published/children/${parentId}`);
  }

}
