import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Block } from '../models/block.model';
@Injectable()
export class BlockService {
  constructor(private http: HttpClient) { }

  getBlockContents(): Observable<Block[]> {
    return this.http.get<Block[]>('/api/blocks');
  }

  getBlockFolders(parentId: string): Observable<Block[]> {
    return this.http.get<Block[]>(`/api/block/folders/${parentId}`);
  }

  getChildBlocksOfFolder(folderId: string): Observable<Block[]> {
    return this.http.get<Block[]>(`/api/block/children/${folderId}`);
  }

  getBlockContent(blockId: string): Observable<Block> {
    return this.http.get<Block>(`/api/block/${blockId}`);
  }

  addBlockContent(blockContent: Block): Observable<Block> {
    return this.http.post<Block>('/api/block', blockContent);
  }

  editBlockContent(content: Block): Observable<string> {
    return this.http.put(`/api/block/${content._id}`, content, { responseType: 'text' });
  }
}
