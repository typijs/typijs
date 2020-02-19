import { Media, MediaService } from '@angular-cms/core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { TreeNode } from '../shared/tree/interfaces/tree-node';
import { TreeService } from '../shared/tree/interfaces/tree-service';

@Injectable()
export class MediaTreeService implements TreeService {

    constructor(private mediaService: MediaService) { }

    getNode(nodeId: string): Observable<TreeNode> {
        return this.mediaService.getContent(nodeId).pipe(
            map(media => new TreeNode({
                id: media._id,
                name: media.name,
                hasChildren: media.hasChildren,
                parentId: media.parentId,
                parentPath: media.parentPath
            })));
    }

    loadChildren(parentNodeId: string): Observable<TreeNode[]> {
        return this.mediaService.getFolderChildren(parentNodeId).pipe(
            map((childFolders: Media[]) => {
                return childFolders.map(folder => new TreeNode({
                    id: folder._id,
                    name: folder.name,
                    hasChildren: folder.hasChildren,
                    parentId: folder.parentId,
                    parentPath: folder.parentPath
                }));
            }));
    }
}