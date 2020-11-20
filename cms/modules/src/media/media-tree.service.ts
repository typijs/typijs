import { Media, MediaService, LanguageService, FOLDER_MEDIA } from '@angular-cms/core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { TreeService } from '../shared/tree/interfaces/tree-service';
import { TreeNode } from '../shared/tree/interfaces/tree-node';
import '../types/tree-node-extension';

@Injectable()
export class MediaTreeService implements TreeService {

    constructor(private mediaService: MediaService, private languageService: LanguageService) { }

    getNode(nodeId: string): Observable<TreeNode> {
        const language = this.languageService.getLanguageParam();
        return this.mediaService.getSimpleContent(nodeId, language).pipe(
            map(media => TreeNode.createInstanceFromContent(media, FOLDER_MEDIA)));
    }

    loadChildren(parentNodeId: string): Observable<TreeNode[]> {
        return this.mediaService.getFolderChildren(parentNodeId).pipe(
            map((childFolders: Media[]) => {
                return childFolders.map(folder => TreeNode.createInstanceFromContent(folder, FOLDER_MEDIA));
            }));
    }
}
