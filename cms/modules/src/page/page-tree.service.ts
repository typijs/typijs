import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { PageService } from '@angular-cms/core';
import { TreeService } from '../shared/tree/tree-service';
import { TreeNode } from '../shared/tree/tree-node';

@Injectable()
export class PageTreeService implements TreeService {
    reloadNode$: Subject<string> = new Subject<string>();

    constructor(private pageService: PageService) { 
        this.pageService.pageCreated$.subscribe(content=>{
            this.reloadNode$.next(content.parentId);
        });
    }

    getNode(nodeId: string): any {
        return this.pageService.getPageContent(nodeId);
    }

    loadChildren(parentNodeId: string): any {
        return this.pageService.getChildren(parentNodeId);
    }
}