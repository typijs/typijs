import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { PageService } from '@angular-cms/core';
import { TreeService } from '../shared/tree/tree-service';
import { TreeNode } from '../shared/tree/tree-node';

@Injectable()
export class PageTreeService implements TreeService {
    selectedNode$: Subject<TreeNode> = new Subject<TreeNode>();
    reloadNode$: Subject<string> = new Subject<string>();

    constructor(private pageService: PageService) {
        this.pageService.pageCreated$.subscribe(content => {
            this.reloadNode$.next(content.parentId);
        });

        this.pageService.pageSelected$.subscribe(x => {
            this.selectedNode$.next(new TreeNode({
                id: x._id,
                name: x.name,
                hasChildren: x.hasChildren,
                parentId: x.parentId,
                parentPath: x.parentPath
            }));
        });
    }

    getNode(nodeId: string): any {
        return this.pageService.getPageContent(nodeId);
    }

    loadChildren(parentNodeId: string): any {
        return this.pageService.getChildren(parentNodeId);
    }
}