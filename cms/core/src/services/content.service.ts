import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Content } from '../models/content.model';
import { ConfigService } from './config.service';
import { AppInjector } from '../utils/appInjector';

export class BaseService {
  protected baseApiUrl: string = AppInjector.get(ConfigService).baseApiUrl;
}

export abstract class FolderService<T extends Content> extends BaseService {

  protected abstract apiUrl: string;
  protected httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    super();
    this.httpClient = httpClient;
  }

  getFolderChildren(parentId: string): Observable<T[]> {
    return this.httpClient.get<T[]>(`${this.apiUrl}/folders/${parentId}`);
  }

  getContentInFolder(folderId: string): Observable<T[]> {
    return this.httpClient.get<T[]>(`${this.apiUrl}/children/${folderId}`);
  }

  createFolder(content: Partial<T>): Observable<T> {
    return this.httpClient.post<T>(`${this.apiUrl}/folder`, content);
  }

  editFolder(content: Partial<T>): Observable<string> {
    return this.httpClient.put(`${this.apiUrl}/folder/${content._id}`, content, { responseType: 'text' });
  }
}

export abstract class ContentService<T extends Content> extends FolderService<T> {

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  createContent(content: Partial<T>): Observable<T> {
    return this.httpClient.post<T>(this.apiUrl, content);
  }

  editContent(content: Partial<T>): Observable<string> {
    return this.httpClient.put(`${this.apiUrl}/${content._id}`, content, { responseType: 'text' });
  }

  getContentChildren(parentId: string): Observable<T[]> {
    return this.httpClient.get<T[]>(`${this.apiUrl}/children/${parentId}`);
  }

  getContent(contentId: string): Observable<T> {
    return this.httpClient.get<T>(`${this.apiUrl}/${contentId}`);
  }

  softDeleteContent(contentId: string): Observable<[T, any]> {
    return this.httpClient.delete<[T, any]>(`${this.apiUrl}/${contentId}`)
  }

  cutContent(actionParams: { sourceContentId: string, targetParentId: string }): Observable<T> {
    return this.httpClient.post<T>(`${this.apiUrl}/cut`, actionParams);
  }

  copyContent(actionParams: { sourceContentId: string, targetParentId: string }): Observable<T> {
    return this.httpClient.post<T>(`${this.apiUrl}/cut`, actionParams);
  }
}
