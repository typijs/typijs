import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BlockService, Block } from '@angular-cms/core';
import { TreeService } from '../shared/tree/interfaces/tree-service';
import { TreeNode } from '../shared/tree/interfaces/tree-node';

@Injectable()
export class BlockTreeService implements TreeService {

    constructor(private blockService: BlockService) { }

    getNode(nodeId: string): Observable<TreeNode> {
        return this.blockService.getContent(nodeId).pipe(
            map(block => new TreeNode({
                id: block._id,
                name: block.name,
                hasChildren: block.hasChildren,
                parentId: block.parentId,
                parentPath: block.parentPath
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