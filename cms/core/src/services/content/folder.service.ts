import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Content } from './models/content.model';
import { BaseService } from '../base.service';

export abstract class FolderService<T extends Content> extends BaseService {

    constructor(httpClient: HttpClient) {
        super(httpClient);
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
