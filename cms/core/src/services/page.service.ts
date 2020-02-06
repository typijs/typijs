import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Page } from '../models/page.model';
import { ContentService } from './content.service';

@Injectable()
export class PageService extends ContentService<Page> {

  protected apiUrl: string = "/api/page";
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  //TODO: temporary fix hostName
  getStartPage(hostName: string = 'http://localhost:4200'): Observable<Page> {
    const startPageUrl = hostName;
    return this.httpClient.get<Page>(`${this.apiUrl}/published/${btoa(startPageUrl)}`);
  }

  getPublishedPage(linkUrl: string): Observable<Page> {
    return this.httpClient.get<Page>(`${this.apiUrl}/published/${btoa(linkUrl)}`);
  }

}
