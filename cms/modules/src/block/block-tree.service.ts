import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { BlockService, Block } from '@angular-cms/core';
import { TreeService } from '../shared/tree/tree-service';
import { TreeNode } from '../shared/tree/tree-node';

@Injectable()
export class BlockTreeService implements TreeService {

    constructor(private blockService: BlockService) { }

    getNode(nodeId: string): Observable<TreeNode> {
        return this.blockService.getBlockContent(nodeId).map(x => new TreeNode({
            id: x._id,
            name: x.name,
            hasChildren: x.hasChildren,
            parentId: x.parentId,
            parentPath: x.parentPath
        }));
    }

    loadChildren(parentNodeId: string): Observable<TreeNode[]> {
        return this.blockService.getBlockFolders(parentNodeId).map((res: Block[]) => {
            return res.map(x => new TreeNode({
                id: x._id,
                name: x.name,
                hasChildren: x.hasChildren,
                parentId: x.parentId,
                parentPath: x.parentPath
            }));
        });
    }
}