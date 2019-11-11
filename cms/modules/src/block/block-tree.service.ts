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
        return this.blockService.getBlockContent(nodeId).pipe(
            map(x => new TreeNode({
                id: x._id,
                name: x.name,
                hasChildren: x.hasChildren,
                parentId: x.parentId,
                parentPath: x.parentPath
            })));
    }

    loadChildren(parentNodeId: string): Observable<TreeNode[]> {
        return this.blockService.getBlockFolders(parentNodeId).pipe(
            map((res: Block[]) => {
                return res.map(x => new TreeNode({
                    id: x._id,
                    name: x.name,
                    hasChildren: x.hasChildren,
                    parentId: x.parentId,
                    parentPath: x.parentPath
                })
                )
            })
        );
    }
}