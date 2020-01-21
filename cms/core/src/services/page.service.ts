import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Page } from '../models/page.model';

@Injectable()
export class PageService {
  constructor(private http: HttpClient) { }

  createPage(pageData: Page): Observable<Page> {
    return this.http.post<Page>('/api/page', pageData);
  }

  editPage(pageData: Page): Observable<string> {
    return this.http.put(`/api/page/${pageData._id}`, pageData, { responseType: 'text' });
  }

  deletePage(id: string): Observable<Page> {
    return this.http.delete<Page>(`/api/page/${id}`)
  }

  getStartPage(): Observable<Page> {
    const startPageUrl = 'http://localhost:4200'
    return this.http.get<Page>(`/api/page/published?url=${startPageUrl}`);
  }

  getPageContent(pageId: string): Observable<Page> {
    return this.http.get<Page>(`/api/page/${pageId}`);
  }

  getPublishedPage(linkUrl: string): Observable<Page> {
    return this.http.get<Page>(`/api/page/published?url=${linkUrl}`);
  }

  getChildren(parentId: string): Observable<Page[]> {
    return this.http.get<Page[]>(`/api/page/children/${parentId}`);
  }
}
