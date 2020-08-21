import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { PageService, Page, PAGE_TYPE } from '@angular-cms/core';

import { TreeService } from '../shared/tree/interfaces/tree-service';
import { TreeNode } from '../shared/tree/interfaces/tree-node';
import '../types/tree-node-extension';

@Injectable()
export class PageTreeService implements TreeService {

    constructor(private pageService: PageService) { }

    getNode(nodeId: string): any {
        return this.pageService.getContent(nodeId).pipe(
            map(page => TreeNode.createInstanceFromContent(page, PAGE_TYPE)));
    }

    loadChildren(parentNodeId: string): any {
        return this.pageService.getContentChildren(parentNodeId).pipe(
            map((childPages: Page[]) => {
                return childPages.map(page => TreeNode.createInstanceFromContent(page, PAGE_TYPE));
            }));
    }
}
