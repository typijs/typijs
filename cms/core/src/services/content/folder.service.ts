import { HttpClient } from '@angular/common/http';
import { Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';
import { Content } from './models/content.model';

export abstract class FolderService<T extends Content> extends BaseService {
    constructor(injector: Injector) {
        super(injector.get(HttpClient));
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
