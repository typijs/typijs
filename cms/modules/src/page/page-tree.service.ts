import { Injectable } from '@angular/core';
import { PageService, Page } from '@angular-cms/core';
import { map } from 'rxjs/operators';

import { TreeService } from '../shared/tree/tree-service';
import { TreeNode } from '../shared/tree/tree-node';

@Injectable()
export class PageTreeService implements TreeService {

    constructor(private pageService: PageService) { }

    getNode(nodeId: string): any {
        return this.pageService.getContent(nodeId).pipe(
            map(page => new TreeNode({
                id: page._id,
                name: page.name,
                hasChildren: page.hasChildren,
                parentId: page.parentId,
                parentPath: page.parentPath
            })));
    }

    loadChildren(parentNodeId: string): any {
        return this.pageService.getContentChildren(parentNodeId).pipe(
            map((childPages: Page[]) => {
                return childPages.map(page => new TreeNode({
                    id: page._id,
                    name: page.name,
                    hasChildren: page.hasChildren,
                    parentId: page.parentId,
                    parentPath: page.parentPath
                }));
            }));
    }
}