import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { BlockService } from '@angular-cms/core';
import { TreeService } from '../shared/tree/tree-service';
import { TreeNode } from '../shared/tree/tree-node';

@Injectable()
export class BlockTreeService implements TreeService {

    constructor(private blockService: BlockService) {}

    getNode(nodeId: string): any {
        return this.blockService.getBlockContent(nodeId);
    }

    loadChildren(parentNodeId: string): any {
        return this.blockService.getBlockFolders(parentNodeId);
    }
}