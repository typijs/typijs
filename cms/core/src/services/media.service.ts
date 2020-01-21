import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Media } from '../models/media.model';
@Injectable()
export class MediaService {
  constructor(private http: HttpClient) { }

  getMediaFolders(parentId: string): Observable<Media[]> {
    return this.http.get<Media[]>(`/api/media/folders/${parentId}`);
  }

  getFilesInFolder(folderId: string): Observable<Media[]> {
    return this.http.get<Media[]>(`/api/media/children/${folderId}`);
  }

  getMediaFolder(blockId: string): Observable<Media> {
    return this.http.get<Media>(`/api/media/${blockId}`);
  }

  addMediaFolder(blockContent: Media): Observable<Media> {
    return this.http.post<Media>('/api/media', blockContent);
  }

  editMediaFolder(content: Media): Observable<string> {
    return this.http.put(`/api/media/${content._id}`, content, { responseType: 'text' });
  }
}
