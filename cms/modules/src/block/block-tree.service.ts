import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BlockService, Block, FOLDER_BLOCK } from '@angular-cms/core';
import { TreeService } from '../shared/tree/interfaces/tree-service';
import { TreeNode } from '../shared/tree/interfaces/tree-node';
import '../types/tree-node-extension';

@Injectable()
export class BlockTreeService implements TreeService {

    constructor(private blockService: BlockService) { }

    getNode(nodeId: string): Observable<TreeNode> {
        return this.blockService.getContent(nodeId, null, null, null).pipe(
            map(block => TreeNode.createInstanceFromContent(block, FOLDER_BLOCK)));
    }

    loadChildren(parentNodeId: string): Observable<TreeNode[]> {
        return this.blockService.getFolderChildren(parentNodeId).pipe(
            map((childFolders: Block[]) => {
                return childFolders.map(folder => TreeNode.createInstanceFromContent(folder, FOLDER_BLOCK)
                );
            })
        );
    }
}
