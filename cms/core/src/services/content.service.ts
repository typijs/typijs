import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Subject } from 'rxjs/Subject';

import { Content } from '../models/content.model';
//contents-by-parent/:parentId
@Injectable()
export class ContentService {
  constructor(private http: HttpClient) { }

  contentCreated$: Subject<Content> = new Subject<Content>();

  fireContentCreated(content) {
    this.contentCreated$.next(content);
  }

  getStartPage(): Observable<Content> {
    const startPageUrl = '/'
    return this.http.get<Content>(`/api/content-by-url?url=${startPageUrl}`);
  } 

  getContents(): Observable<Content[]> {
    return this.http.get<Content[]>('/api/contents');
  }

  countContents(): Observable<number> {
    return this.http.get<number>('/api/contents/count');
  }

  addContent(content: Content): Observable<Content> {
    return this.http.post<Content>('/api/content', content);
  }

  getContent(content: Content): Observable<Content> {
    return this.http.get<Content>(`/api/content/${content._id}`);
  }

  getContentByUrl(linkUrl: string): Observable<Content> {
    return this.http.get<Content>(`/api/content-by-url?url=${linkUrl}`);
  }

  getContentsByParentId(parentId: string):  Observable<Content[]> {
    return this.http.get<Content[]>(`/api/contents-by-parent/${parentId}`);
  }

  editContent(content: Content): Observable<string> {
    return this.http.put(`/api/content/${content._id}`, content, { responseType: 'text' });
  }

  deleteContent(content: Content): Observable<string> {
    return this.http.delete(`/api/content/${content._id}`, { responseType: 'text' });
  }

  getBlockContents(): Observable<Content[]> {
    return this.http.get<Content[]>('/api/blocks');
  }

  addBlockContent(blockContent: Content): Observable<Content> {
    return this.http.post<Content>('/api/block', blockContent);
  }

  getBlockContent(content: Content): Observable<Content> {
    return this.http.get<Content>(`/api/block/${content._id}`);
  }

  editBlockContent(content: Content): Observable<string> {
    return this.http.put(`/api/block/${content._id}`, content, { responseType: 'text' });
  }
}
