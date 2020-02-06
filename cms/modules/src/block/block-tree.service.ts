import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BlockService, Block } from '@angular-cms/core';
import { TreeService } from '../shared/tree/tree-service';
import { TreeNode } from '../shared/tree/tree-node';

@Injectable()
export class BlockTreeService implements TreeService {

    constructor(private blockService: BlockService) { }

    getNode(nodeId: string): Observable<TreeNode> {
        return this.blockService.getContent(nodeId).pipe(
            map(x => new TreeNode({
                id: x._id,
                name: x.name,
                hasChildren: x.hasChildren,
                parentId: x.parentId,
                parentPath: x.parentPath
            })));
    }

    loadChildren(parentNodeId: string): Observable<TreeNode[]> {
        return this.blockService.getFolderChildren(parentNodeId).pipe(
            map((childFolders: Block[]) => {
                return childFolders.map(folder => new TreeNode({
                    id: folder._id,
                    name: folder.name,
                    hasChildren: folder.hasChildren,
                    parentId: folder.parentId,
                    parentPath: folder.parentPath
                })
                )
            })
        );
    }
}