import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Subject } from 'rxjs/Subject';

import { Content } from '../models/content.model';
@Injectable()
export class BlockService {
  constructor(private http: HttpClient) { }

  contentCreated$: Subject<Content> = new Subject<Content>();

  fireContentCreated(content) {
    this.contentCreated$.next(content);
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
